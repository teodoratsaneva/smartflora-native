import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../auth/AuthContext';
import type { CareRecord, Plant } from '../types/Plant';

type NewPlantInput = {
  name: string;
  variety: string;
  imageUri?: string;
  idealTemp: number;
  idealHumidity: number;
};

type PlantStoreValue = {
  plants: Plant[];
  loading: boolean;
  getPlant: (id: string) => Plant | undefined;
  addPlant: (plant: NewPlantInput) => Promise<string>;
  addCareRecord: (plantId: string, record: CareRecord) => Promise<{ ok: true } | { ok: false; error: string }>;
};

const PlantStoreContext = createContext<PlantStoreValue | undefined>(undefined);

function isSameDay(a: number, b: number) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function PlantStoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPlants([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const plantsQuery = query(collection(db, 'users', user.uid, 'plants'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      plantsQuery,
      (snapshot) => {
        setPlants(
          snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              name: data.name,
              variety: data.variety,
              imageUri: data.imageUri,
              createdAt: data.createdAt,
              idealTemp: data.idealTemp,
              idealHumidity: data.idealHumidity,
              history: data.history ?? [],
            } as Plant;
          })
        );
        setLoading(false);
      },
      () => setLoading(false)
    );

    return unsubscribe;
  }, [user]);

  const value = useMemo<PlantStoreValue>(
    () => ({
      plants,
      loading,
      getPlant: (id) => plants.find((p) => p.id === id),
      addPlant: async (input) => {
        if (!user) throw new Error('Not signed in');
        const docRef = await addDoc(collection(db, 'users', user.uid, 'plants'), {
          ...input,
          createdAt: Date.now(),
          history: [],
        });
        return docRef.id;
      },
      addCareRecord: async (plantId, record) => {
        if (!user) return { ok: false, error: 'Not signed in.' };
        const plant = plants.find((p) => p.id === plantId);
        if (plant?.history.some((entry) => isSameDay(entry.timestamp, record.timestamp))) {
          return { ok: false, error: 'Already entered the data today!' };
        }
        await updateDoc(doc(db, 'users', user.uid, 'plants', plantId), {
          history: arrayUnion(record),
        });
        return { ok: true };
      },
    }),
    [plants, loading, user]
  );

  return <PlantStoreContext.Provider value={value}>{children}</PlantStoreContext.Provider>;
}

export function usePlantStore() {
  const ctx = useContext(PlantStoreContext);
  if (!ctx) throw new Error('usePlantStore must be used within PlantStoreProvider');
  return ctx;
}
