export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  AddPlant: undefined;
  AddCareData: { plantId: string };
  PlantDetails: { plantId: string };
};
