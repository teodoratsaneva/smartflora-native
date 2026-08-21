import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Plant } from '../../types/Plant';
import { analyzePlant } from '../../data/aiAnalysis';
import { colors, statusColor, statusMutedColor } from '../../theme/colors';

type Props = {
  plant: Plant;
  onDetails: () => void;
  onAddData: () => void;
};

export function PlantCard({ plant, onDetails, onAddData }: Props) {
  const { score, status } = analyzePlant(plant);
  const badgeColor = statusColor(score);
  const badgeIcon = score >= 70 ? 'sunny' : score >= 40 ? 'partly-sunny' : 'water';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {plant.imageUri ? (
          <Image source={{ uri: plant.imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="leaf" size={26} color={colors.primary} />
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{plant.name}</Text>
          <View style={[styles.badge, { backgroundColor: statusMutedColor(score) }]}>
            <Ionicons name={badgeIcon} size={13} color={badgeColor} />
            <Text style={[styles.badgeText, { color: badgeColor }]}>Status: {status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={onDetails}>
          <Text style={styles.actionText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onAddData}>
          <Text style={styles.actionText}>Add Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  image: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },
  imagePlaceholder: { backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 6 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  actionButton: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});
