import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { usePlantStore } from '../../data/PlantStore';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'PlantDetails'>;

export function PlantDetailsScreen({ route, navigation }: Props) {
  const { plantId } = route.params;
  const { getPlant } = usePlantStore();
  const plant = getPlant(plantId);

  if (!plant) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Растението не е намерено.</Text>
      </View>
    );
  }

  const recentRecords = [...plant.careHistory].sort((a, b) => b.timestamp - a.timestamp).slice(0, 7);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.name}>{plant.commonName}</Text>
      {plant.scientificName ? <Text style={styles.scientificName}>{plant.scientificName}</Text> : null}

      {plant.lastAiScore != null && (
        <View style={styles.aiCard}>
          <Text style={styles.aiScore}>{plant.lastAiScore}/100 — {plant.lastAiStatus}</Text>
          {plant.lastAiAdvice ? <Text style={styles.aiAdvice}>{plant.lastAiAdvice}</Text> : null}
        </View>
      )}

      <Text style={styles.sectionTitle}>История на грижите (последни {recentRecords.length})</Text>
      {recentRecords.length === 0 ? (
        <Text style={styles.emptyText}>Все още няма записани данни.</Text>
      ) : (
        recentRecords.map((record) => (
          <View key={record.timestamp} style={styles.recordRow}>
            <Text style={styles.recordDate}>{new Date(record.timestamp).toLocaleDateString('bg-BG')}</Text>
            <Text style={styles.recordDetail}>
              💧 {record.soilHumidity ?? '—'}% · 🌡️ {record.temperature ?? '—'}°C · {record.isWatered ? '✅ Поляно' : '—'}
            </Text>
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('AddCareData', { plantId: plant.id })}
      >
        <Text style={styles.primaryButtonText}>+ Добави запис за грижа</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  name: { fontSize: 26, fontWeight: '700', color: colors.text },
  scientificName: { fontSize: 15, color: colors.textMuted, fontStyle: 'italic', marginTop: 2 },
  aiCard: { backgroundColor: colors.primaryLight, borderRadius: 12, padding: 14, marginTop: 16 },
  aiScore: { fontSize: 16, fontWeight: '600', color: colors.primary },
  aiAdvice: { fontSize: 14, color: colors.text, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginTop: 24, marginBottom: 10 },
  emptyText: { fontSize: 14, color: colors.textMuted },
  recordRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
  },
  recordDate: { fontSize: 13, color: colors.textMuted },
  recordDetail: { fontSize: 15, color: colors.text, marginTop: 2 },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 12,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
