export type CareRecord = {
  soilHumidity: number | null;
  temperature: number | null;
  isWatered: boolean;
  timestamp: number;
};

export type Plant = {
  id: number;
  name: string;
  variety: string;
  imageUri?: string;
  createdAt: number;
  idealTemp: number;
  idealHumidity: number;
  history: CareRecord[];
};

export type AiAnalysis = {
  score: number;
  status: string;
  analysis: string;
  recommendation: string;
};
