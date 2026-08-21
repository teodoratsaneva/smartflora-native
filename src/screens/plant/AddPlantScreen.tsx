import { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { usePlantStore } from '../../data/PlantStore';
import { AppHeader } from '../components/AppHeader';
import { plantCatalog, getVarietiesFor, getSpecsByVariety } from '../../data/plantCatalog';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPlant'>;

export function AddPlantScreen({ navigation }: Props) {
  const { addPlant } = usePlantStore();
  const [selectedName, setSelectedName] = useState('');
  const [selectedVariety, setSelectedVariety] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

  const varieties = getVarietiesFor(selectedName);
  const canSave = Boolean(selectedName && selectedVariety && photoUri);

  async function handlePickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  function handleAddPlant() {
    if (!canSave) return;
    const specs = getSpecsByVariety(selectedName, selectedVariety);
    const id = Date.now();
    addPlant({
      id,
      name: selectedName,
      variety: selectedVariety,
      imageUri: photoUri,
      createdAt: Date.now(),
      idealTemp: specs?.idealTemp ?? 22,
      idealHumidity: specs?.idealHumidity ?? 50,
      history: [],
    });
    navigation.replace('PlantDetails', { plantId: id });
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.body}>
        <Text style={styles.pageTitle}>Add New Plant</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedName}
            onValueChange={(value) => {
              setSelectedName(value);
              setSelectedVariety('');
            }}
            style={styles.picker}
            dropdownIconColor={colors.primary}
            {...(Platform.OS === 'ios' ? { itemStyle: styles.pickerItemIOS } : {})}
          >
            <Picker.Item label="Select Plant Name" value="" color={colors.textFaint} />
            {plantCatalog.map((p) => (
              <Picker.Item key={p.name} label={p.name} value={p.name} />
            ))}
          </Picker>
        </View>

        {selectedName ? (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedVariety}
              onValueChange={setSelectedVariety}
              style={styles.picker}
              dropdownIconColor={colors.primary}
              {...(Platform.OS === 'ios' ? { itemStyle: styles.pickerItemIOS } : {})}
            >
              <Picker.Item label="Select Plant Variety" value="" color={colors.textFaint} />
              {varieties.map((v) => (
                <Picker.Item key={v.variety} label={v.variety} value={v.variety} />
              ))}
            </Picker>
          </View>
        ) : null}

        <TouchableOpacity style={styles.photoBox} onPress={handlePickPhoto}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={28} color={colors.textMuted} />
              <Text style={styles.photoText}>Add Plant Photo</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, !canSave && styles.primaryButtonDisabled]}
          onPress={handleAddPlant}
          disabled={!canSave}
        >
          <Text style={styles.primaryButtonText}>Add Plant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { padding: 20 },
  pageTitle: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 20 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  picker: { color: colors.text, backgroundColor: colors.surface },
  pickerItemIOS: { color: colors.text },
  photoBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 12,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 24,
    overflow: 'hidden',
  },
  photoText: { color: colors.textMuted, fontSize: 13, marginTop: 8 },
  photoPreview: { width: '100%', height: '100%' },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonDisabled: { opacity: 0.4 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
