import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { usePlantStore } from '../../data/PlantStore';
import { useAuth } from '../../auth/AuthContext';
import { PlantCard } from './PlantCard';
import { AppHeader } from '../components/AppHeader';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { plants, loading } = usePlantStore();
  const { signOutUser } = useAuth();

  return (
    <View style={styles.container}>
      <AppHeader onLogout={signOutUser} />
      <Text style={styles.pageTitle}>My Plants</Text>

      {loading ? (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : plants.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="leaf-outline" size={48} color={colors.textFaint} />
          <Text style={styles.emptyTitle}>No plants yet</Text>
          <Text style={styles.emptySubtitle}>Add your first plant to start tracking its care</Text>
        </View>
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <PlantCard
              plant={item}
              onDetails={() => navigation.navigate('PlantDetails', { plantId: item.id })}
              onAddData={() => navigation.navigate('AddCareData', { plantId: item.id })}
            />
          )}
        />
      )}

      <View style={styles.fabWrapper}>
        <Pressable
          style={styles.fab}
          accessibilityLabel="Add New Plant"
          onPress={() => navigation.navigate('AddPlant')}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </Pressable>
        <Text style={styles.fabLabel}>Add New Plant</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  pageTitle: { color: colors.text, fontSize: 24, fontWeight: '700', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 4 },
  list: { padding: 20, paddingBottom: 140 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginTop: 12 },
  emptySubtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: 6 },
  fabWrapper: { position: 'absolute', alignSelf: 'center', bottom: 26, alignItems: 'center' },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabLabel: { color: colors.textMuted, fontSize: 12, marginTop: 6, fontWeight: '600' },
});
