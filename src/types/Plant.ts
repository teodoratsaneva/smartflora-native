export type CareRecord = {
  soilHumidity: number | null;
  temperature: number | null;
  isWatered: boolean;
  timestamp: number;
};

export type Plant = {
  id: number;
  commonName: string;
  scientificName?: string;
  imageUrl?: string;
  createdAt: number;
  idealJson?: string;
  careHistory: CareRecord[];
  lastAiScore?: number;
  lastAiStatus?: string;
  lastAiAdvice?: string;
  lastAiTimestamp?: number;
};
