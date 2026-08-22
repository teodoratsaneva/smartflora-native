import { Platform } from 'react-native';
import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

function createAuth(): Auth {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }
  // Native (iOS/Android via Expo Go): persist the session across app restarts.
  // Requires @react-native-async-storage/async-storage.
  const { getReactNativePersistence } = require('firebase/auth');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  try {
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    // initializeAuth throws if it was already called (e.g. Fast Refresh) — fall back to the existing instance.
    return getAuth(app);
  }
}

export const auth = createAuth();
export const db = getFirestore(app);
