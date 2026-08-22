import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { LoginScreen } from '../screens/profile/LoginScreen';
import { RegisterScreen } from '../screens/profile/RegisterScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { AddPlantScreen } from '../screens/plant/AddPlantScreen';
import { AddCareDataScreen } from '../screens/plant/AddCareDataScreen';
import { PlantDetailsScreen } from '../screens/plant/PlantDetailsScreen';
import { useAuth } from '../auth/AuthContext';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.background },
};

export function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddPlant" component={AddPlantScreen} />
            <Stack.Screen name="AddCareData" component={AddCareDataScreen} />
            <Stack.Screen name="PlantDetails" component={PlantDetailsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
