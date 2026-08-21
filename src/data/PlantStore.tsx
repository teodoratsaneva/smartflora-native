import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CareRecord, Plant } from '../types/Plant';

type PlantStoreValue = {
  plants: Plant[];
  getPlant: (id: number) => Plant | undefined;
  addPlant: (plant: Plant) => void;
  addCareRecord: (plantId: number, record: CareRecord) => void;
};

const PlantStoreContext = createContext<PlantStoreValue | undefined>(undefined);

export function PlantStoreProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>([]);

  const value = useMemo<PlantStoreValue>(
    () => ({
      plants,
      getPlant: (id) => plants.find((p) => p.id === id),
      addPlant: (plant) => setPlants((prev) => [...prev, plant]),
      addCareRecord: (plantId, record) =>
        setPlants((prev) =>
          prev.map((p) =>
            p.id === plantId ? { ...p, careHistory: [...p.careHistory, record] } : p
          )
        ),
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
