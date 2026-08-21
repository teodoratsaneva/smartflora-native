export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  AddPlant: undefined;
  AddCareData: { plantId: number };
  PlantDetails: { plantId: number };
};
