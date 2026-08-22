import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useAuth } from '../../auth/AuthContext';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

export function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSignUp() {
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Invalid email format!');
      return;
    }
    if (!passwordRegex.test(password)) {
      Alert.alert('Error', 'Password must be 8+ characters with a capital letter and a number.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    setSubmitting(true);
    const result = await signUp(email.trim(), password);
    setSubmitting(false);
    if (!result.ok) {
      Alert.alert('Error', result.error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <Ionicons name="leaf" size={30} color={colors.primary} />
        <Text style={styles.brand}>SmartFlora</Text>
      </View>
      <Text style={styles.welcome}>Create your account</Text>

      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textFaint}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.textFaint}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={colors.textFaint}
          secureTextEntry={!showPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp} disabled={submitting}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Sign Up</Text>}
      </TouchableOpacity>

      <View style={styles.signUpRow}>
        <Text style={styles.linkMuted}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.signUpLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 28, justifyContent: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 28, fontWeight: '700', color: colors.primary, marginLeft: 8 },
  welcome: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginTop: 6, marginBottom: 32 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: colors.text, fontSize: 15 },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  linkMuted: { color: colors.textMuted, fontSize: 13 },
  signUpRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  signUpLink: { color: colors.primary, fontSize: 13, fontWeight: '700' },
});
