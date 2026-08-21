import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Plant } from '../../types/Plant';
import { colors } from '../../theme/colors';

type Props = {
  plant: Plant;
  onPress: () => void;
};

export function PlantCard({ plant, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {plant.imageUrl ? (
        <Image source={{ uri: plant.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={{ fontSize: 28 }}>🌱</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{plant.commonName}</Text>
        {plant.scientificName ? (
          <Text style={styles.scientificName} numberOfLines={1}>{plant.scientificName}</Text>
        ) : null}
        {plant.lastAiScore != null && (
          <View style={styles.scoreRow}>
            <View style={[styles.scoreDot, { backgroundColor: scoreColor(plant.lastAiScore) }]} />
            <Text style={styles.scoreText}>{plant.lastAiStatus ?? plant.lastAiScore}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function scoreColor(score: number) {
  if (score >= 80) return colors.primary;
  if (score >= 40) return colors.warning;
  return colors.danger;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: { width: 56, height: 56, borderRadius: 10, marginRight: 12 },
  imagePlaceholder: { backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  scientificName: { fontSize: 13, color: colors.textMuted, fontStyle: 'italic' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  scoreDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  scoreText: { fontSize: 12, color: colors.textMuted },
});
