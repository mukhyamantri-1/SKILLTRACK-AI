import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import appletConfig from '../firebase-applet-config.json';

// Use the provisioned Firebase configuration from firebase-applet-config.json
export const firebaseConfig = {
  apiKey: appletConfig.apiKey,
  authDomain: appletConfig.authDomain,
  projectId: appletConfig.projectId,
  storageBucket: appletConfig.storageBucket,
  messagingSenderId: appletConfig.messagingSenderId,
  appId: appletConfig.appId
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const auth = getAuth(app);

// Initialize Firestore with robust connection settings for iframe & cross-origin network environments
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  }, appletConfig.firestoreDatabaseId || undefined);
} catch (e) {
  // If already initialized or if persistence not supported in this runtime
  firestoreInstance = appletConfig.firestoreDatabaseId
    ? getFirestore(app, appletConfig.firestoreDatabaseId)
    : getFirestore(app);
}

export const db = firestoreInstance;

export const googleProvider = new GoogleAuthProvider();

// Export required Firebase Auth & Firestore functions
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc
};

export type { User };
