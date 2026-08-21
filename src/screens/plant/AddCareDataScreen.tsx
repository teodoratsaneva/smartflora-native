import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { usePlantStore } from '../../data/PlantStore';
import { AppHeader } from '../components/AppHeader';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'AddCareData'>;

export function AddCareDataScreen({ route, navigation }: Props) {
  const { plantId } = route.params;
  const { getPlant, addCareRecord } = usePlantStore();
  const plant = getPlant(plantId);

  const [temperature, setTemperature] = useState(22);
  const [soilMoisture, setSoilMoisture] = useState(50);
  const [isWatered, setIsWatered] = useState(false);

  if (!plant) {
    return (
      <View style={styles.container}>
        <AppHeader onBack={() => navigation.goBack()} />
        <Text style={styles.notFound}>Plant not found.</Text>
      </View>
    );
  }

  function handleSave() {
    const result = addCareRecord(plantId, {
      soilHumidity: soilMoisture,
      temperature,
      isWatered,
      timestamp: Date.now(),
    });
    if (!result.ok) {
      Alert.alert('Error', result.error);
      return;
    }
    Alert.alert('Success', 'Data saved successfully!');
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <AppHeader onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <Text style={styles.plantName}>{plant.name}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{plant.name}</Text>

          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>Temperature (°C)</Text>
            <Text style={styles.sliderValue}>{temperature.toFixed(1)} °C</Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={45}
            step={0.5}
            value={temperature}
            onValueChange={setTemperature}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />

          <View style={[styles.sliderRow, { marginTop: 18 }]}>
            <Text style={styles.sliderLabel}>Soil Moisture (%)</Text>
            <Text style={styles.sliderValue}>{Math.round(soilMoisture)} %</Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={soilMoisture}
            onValueChange={setSoilMoisture}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />

          <Pressable style={styles.checkboxRow} onPress={() => setIsWatered((v) => !v)}>
            <View style={[styles.checkbox, isWatered && styles.checkboxChecked]}>
              {isWatered && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Ionicons name="water" size={16} color={colors.info} style={{ marginLeft: 8, marginRight: 4 }} />
            <Text style={styles.checkboxLabel}>Watered Today</Text>
          </Pressable>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { padding: 20 },
  notFound: { color: colors.textMuted, padding: 20 },
  plantName: { color: colors.textMuted, fontSize: 18, fontWeight: '600', marginBottom: 14 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 20 },
  sliderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sliderLabel: { color: colors.textMuted, fontSize: 14 },
  sliderValue: { color: colors.text, fontSize: 14, fontWeight: '600' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 22 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxLabel: { color: colors.text, fontSize: 14, fontWeight: '500' },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 26,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
