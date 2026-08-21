import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

type Props = {
  title?: string;
};

export function AppHeader({ title = 'SmartFlora' }: Props) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Pressable onPress={() => setShowInfo(true)} hitSlop={10} accessibilityLabel="Help">
        <Ionicons name="information-circle-outline" size={26} color="#fff" />
      </Pressable>

      <Modal visible={showInfo} transparent animationType="fade" onRequestClose={() => setShowInfo(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowInfo(false)}>
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.cardTitle}>Getting Started with SmartFlora</Text>
            <Text style={styles.step}>1. Add your plants using the large + button.</Text>
            <Text style={styles.step}>2. Tap "Details" to see the statistic for your plant.</Text>
            <Text style={styles.step}>3. Use "Add Data" to log care.</Text>
            <Text style={styles.step}>
              4. Check status badges (like "Optimal") for an instant health overview. The app
              reminds you when care is needed.
            </Text>
            <Text style={styles.close}>Tap the info icon again to close this help window.</Text>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: colors.surfaceElevated, borderRadius: 16, padding: 22 },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 14 },
  step: { color: colors.textMuted, fontSize: 14, lineHeight: 21, marginBottom: 8 },
  close: { color: colors.primary, fontSize: 13, marginTop: 10 },
});
