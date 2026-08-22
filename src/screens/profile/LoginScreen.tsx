import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useAuth } from '../../auth/AuthContext';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    const result = await signIn(email.trim(), password);
    setSubmitting(false);
    if (!result.ok) {
      Alert.alert('Error', result.error);
    }
  }

  async function handleResetPassword() {
    if (!resetEmail) return;
    const result = await resetPassword(resetEmail.trim());
    if (result.ok) {
      Alert.alert('Success', 'Password reset email sent.');
      setForgotMode(false);
    } else {
      Alert.alert('Error', result.error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <Ionicons name="leaf" size={30} color={colors.primary} />
        <Text style={styles.brand}>SmartFlora</Text>
      </View>
      <Text style={styles.welcome}>Welcome back!</Text>

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

      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={submitting}>
        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Log In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setForgotMode((v) => !v)}>
        <Text style={styles.linkMuted}>Forgot Password?</Text>
      </TouchableOpacity>

      {forgotMode && (
        <View style={styles.forgotBox}>
          <TextInput
            style={styles.forgotInput}
            placeholder="Enter your email"
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            keyboardType="email-address"
            value={resetEmail}
            onChangeText={setResetEmail}
          />
          <TouchableOpacity style={styles.forgotButton} onPress={handleResetPassword}>
            <Text style={styles.forgotButtonText}>Send reset link</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.signUpRow}>
        <Text style={styles.linkMuted}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signUpLink}>Sign Up</Text>
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
  linkMuted: { color: colors.textMuted, textAlign: 'center', fontSize: 13, marginTop: 18 },
  signUpRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  signUpLink: { color: colors.primary, fontSize: 13, fontWeight: '700', marginTop: 18 },
  forgotBox: { marginTop: 14 },
  forgotInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    color: colors.text,
    marginBottom: 10,
  },
  forgotButton: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  forgotButtonText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});
