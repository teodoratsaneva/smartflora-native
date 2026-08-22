import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { PlantStoreProvider } from './src/data/PlantStore';
import { AuthProvider } from './src/auth/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <PlantStoreProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </PlantStoreProvider>
    </AuthProvider>
  );
}
