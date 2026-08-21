import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CareRecord, Plant } from '../types/Plant';

type PlantStoreValue = {
  plants: Plant[];
  getPlant: (id: number) => Plant | undefined;
  addPlant: (plant: Plant) => void;
  addCareRecord: (plantId: number, record: CareRecord) => { ok: true } | { ok: false; error: string };
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
  const [plants, setPlants] = useState<Plant[]>([]);

  const value = useMemo<PlantStoreValue>(
    () => ({
      plants,
      getPlant: (id) => plants.find((p) => p.id === id),
      addPlant: (plant) => setPlants((prev) => [...prev, plant]),
      addCareRecord: (plantId, record) => {
        const plant = plants.find((p) => p.id === plantId);
        if (plant?.history.some((entry) => isSameDay(entry.timestamp, record.timestamp))) {
          return { ok: false, error: 'Already entered the data today!' };
        }
        setPlants((prev) =>
          prev.map((p) => (p.id === plantId ? { ...p, history: [...p.history, record] } : p))
        );
        return { ok: true };
      },
    }),
    [plants]
  );

  return <PlantStoreContext.Provider value={value}>{children}</PlantStoreContext.Provider>;
}

export function usePlantStore() {
  const ctx = useContext(PlantStoreContext);
  if (!ctx) throw new Error('usePlantStore must be used within PlantStoreProvider');
  return ctx;
}
