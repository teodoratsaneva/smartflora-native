export type PlantSpec = {
  variety: string;
  idealTemp: number;
  idealHumidity: number;
};

export type PlantCatalogEntry = {
  name: string;
  varieties: PlantSpec[];
};

export const plantCatalog: PlantCatalogEntry[] = [
  {
    name: 'Ficus',
    varieties: [
      { variety: 'Benjamin', idealTemp: 22, idealHumidity: 60 },
      { variety: 'Lyrata', idealTemp: 21, idealHumidity: 55 },
    ],
  },
  {
    name: 'Orchid',
    varieties: [
      { variety: 'Phalaenopsis', idealTemp: 23, idealHumidity: 70 },
    ],
  },
  {
    name: 'Monstera',
    varieties: [
      { variety: 'Deliciosa', idealTemp: 24, idealHumidity: 65 },
    ],
  },
  {
    name: 'Cactus',
    varieties: [
      { variety: 'Barrel', idealTemp: 26, idealHumidity: 20 },
      { variety: 'Prickly Pear', idealTemp: 27, idealHumidity: 15 },
    ],
  },
  {
    name: 'Snake Plant',
    varieties: [
      { variety: 'Laurentii', idealTemp: 21, idealHumidity: 35 },
    ],
  },
];

export function getVarietiesFor(name: string): PlantSpec[] {
  return plantCatalog.find((p) => p.name === name)?.varieties ?? [];
}

export function getSpecsByVariety(name: string, variety: string): PlantSpec | undefined {
  return getVarietiesFor(name).find((v) => v.variety === variety);
}
