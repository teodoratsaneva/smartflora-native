import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { LoginScreen } from '../screens/profile/LoginScreen';
import { RegisterScreen } from '../screens/profile/RegisterScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { AddPlantScreen } from '../screens/plant/AddPlantScreen';
import { AddCareDataScreen } from '../screens/plant/AddCareDataScreen';
import { PlantDetailsScreen } from '../screens/plant/PlantDetailsScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Регистрация' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'SmartFlora', headerBackVisible: false }} />
        <Stack.Screen name="AddPlant" component={AddPlantScreen} options={{ title: 'Добави растение' }} />
        <Stack.Screen name="AddCareData" component={AddCareDataScreen} options={{ title: 'Данни за грижа' }} />
        <Stack.Screen name="PlantDetails" component={PlantDetailsScreen} options={{ title: 'Детайли' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
