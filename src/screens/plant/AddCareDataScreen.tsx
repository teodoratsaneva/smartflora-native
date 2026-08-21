import { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { usePlantStore } from '../../data/PlantStore';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'AddCareData'>;

export function AddCareDataScreen({ route, navigation }: Props) {
  const { plantId } = route.params;
  const { addCareRecord } = usePlantStore();
  const [soilHumidity, setSoilHumidity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [isWatered, setIsWatered] = useState(false);

  function handleSave() {
    addCareRecord(plantId, {
      soilHumidity: soilHumidity ? Number(soilHumidity) : null,
      temperature: temperature ? Number(temperature) : null,
      isWatered,
      timestamp: Date.now(),
    });
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Влажност на почвата (%)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="напр. 35"
        value={soilHumidity}
        onChangeText={setSoilHumidity}
      />

      <Text style={styles.label}>Температура (°C)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="напр. 22"
        value={temperature}
        onChangeText={setTemperature}
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Поляно днес</Text>
        <Switch value={isWatered} onValueChange={setIsWatered} trackColor={{ true: colors.primary }} />
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
        <Text style={styles.primaryButtonText}>Запази запис</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  label: { fontSize: 13, color: colors.textMuted, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
