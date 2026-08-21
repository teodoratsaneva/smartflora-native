import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { usePlantStore } from '../../data/PlantStore';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPlant'>;

export function AddPlantScreen({ navigation }: Props) {
  const { plants, addPlant } = usePlantStore();
  const [commonName, setCommonName] = useState('');
  const [scientificName, setScientificName] = useState('');

  const canSave = commonName.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    const id = Date.now();
    addPlant({
      id,
      commonName: commonName.trim(),
      scientificName: scientificName.trim() || undefined,
      createdAt: Date.now(),
      careHistory: [],
    });
    navigation.replace('PlantDetails', { plantId: id });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Име на растението</Text>
      <TextInput
        style={styles.input}
        placeholder="напр. Монстера"
        value={commonName}
        onChangeText={setCommonName}
      />

      <Text style={styles.label}>Научно име (по избор)</Text>
      <TextInput
        style={styles.input}
        placeholder="напр. Monstera deliciosa"
        value={scientificName}
        onChangeText={setScientificName}
      />

      <Text style={styles.hint}>
        Търсенето по вид растение (Perenual API) и снимка ще се добавят на следваща стъпка.
      </Text>

      <TouchableOpacity
        style={[styles.primaryButton, !canSave && styles.primaryButtonDisabled]}
        onPress={handleSave}
        disabled={!canSave}
      >
        <Text style={styles.primaryButtonText}>Запази</Text>
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
  hint: { fontSize: 12, color: colors.textMuted, marginTop: 16 },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
