import { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { usePlantStore } from '../../data/PlantStore';
import { analyzePlant } from '../../data/aiAnalysis';
import { AppHeader } from '../components/AppHeader';
import { HealthGauge } from '../components/HealthGauge';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'PlantDetails'>;

const screenWidth = Dimensions.get('window').width;

export function PlantDetailsScreen({ route, navigation }: Props) {
  const { plantId } = route.params;
  const { getPlant } = usePlantStore();
  const plant = getPlant(plantId);
  const [range, setRange] = useState<7 | 31>(7);

  const chartData = useMemo(() => {
    if (!plant) return null;
    const sorted = [...plant.history].sort((a, b) => a.timestamp - b.timestamp).slice(-range);
    if (sorted.length < 2) return null;

    const labels = sorted.map((entry) => {
      const date = new Date(entry.timestamp);
      return range <= 7
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    });

    return {
      labels,
      datasets: [
        { data: sorted.map((e) => e.temperature ?? 0), color: () => 'rgba(76, 175, 80, 1)', strokeWidth: 2 },
        { data: sorted.map((e) => e.soilHumidity ?? 0), color: () => 'rgba(33, 150, 243, 1)', strokeWidth: 2 },
      ],
      legend: ['Temperature (°C)', 'Soil Moisture (%)'],
    };
  }, [plant, range]);

  if (!plant) {
    return (
      <View style={styles.container}>
        <AppHeader />
        <Text style={styles.emptyText}>Plant not found.</Text>
      </View>
    );
  }

  const { score, status, analysis, recommendation } = analyzePlant(plant);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <AppHeader />
      <View style={styles.body}>
        <Text style={styles.name}>{plant.name}</Text>

        <View style={styles.gaugeSection}>
          <HealthGauge score={score} />
          <Text style={styles.assessment}>Overall Health Assessment: {status}</Text>
        </View>

        <Text style={styles.sectionTitle}>Temperature and Soil Moisture Trend</Text>

        <View style={styles.rangeToggle}>
          <TouchableOpacity
            style={[styles.rangeButton, range === 7 && styles.rangeButtonActive]}
            onPress={() => setRange(7)}
          >
            <Text style={[styles.rangeButtonText, range === 7 && styles.rangeButtonTextActive]}>Last 7 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rangeButton, range === 31 && styles.rangeButtonActive]}
            onPress={() => setRange(31)}
          >
            <Text style={[styles.rangeButtonText, range === 31 && styles.rangeButtonTextActive]}>Last 31 Days</Text>
          </TouchableOpacity>
        </View>

        {chartData ? (
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            bezier
            chartConfig={{
              backgroundGradientFrom: colors.surface,
              backgroundGradientTo: colors.surface,
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(154, 163, 154, ${opacity})`,
              propsForDots: { r: '3' },
            }}
            style={styles.chart}
          />
        ) : (
          <View style={styles.chartPlaceholder}>
            <Text style={styles.emptyText}>Not enough data yet — add at least 2 daily records to see the trend.</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>AI Analysis & Recommendations</Text>
        <View style={styles.analysisCard}>
          <Text style={styles.analysisLabel}>Analysis:</Text>
          <Text style={styles.analysisText}>{analysis}</Text>
          <Text style={[styles.analysisLabel, styles.recommendationLabel]}>Recommendation:</Text>
          <Text style={styles.analysisText}>{recommendation}</Text>
        </View>

        <TouchableOpacity
          style={styles.addDataButton}
          onPress={() => navigation.navigate('AddCareData', { plantId: plant.id })}
        >
          <Text style={styles.addDataButtonText}>+ Add Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  body: { padding: 20 },
  name: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 18 },
  gaugeSection: { alignItems: 'center', marginBottom: 24 },
  assessment: { color: colors.text, fontSize: 15, fontWeight: '600', marginTop: 12 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 12 },
  rangeToggle: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  rangeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  rangeButtonActive: { backgroundColor: colors.primaryMuted, borderColor: colors.primary },
  rangeButtonText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  rangeButtonTextActive: { color: colors.primary },
  chart: { borderRadius: 16 },
  chartPlaceholder: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  analysisCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  analysisLabel: { color: colors.primary, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  recommendationLabel: { color: colors.warning, marginTop: 14 },
  analysisText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  addDataButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 26,
  },
  addDataButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
