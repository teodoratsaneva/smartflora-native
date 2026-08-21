import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { PlantStoreProvider } from './src/data/PlantStore';

export default function App() {
  return (
    <PlantStoreProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </PlantStoreProvider>
  );
}
