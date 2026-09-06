// Firebase Initialization and Configuration for EcoSort Ghana
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId
};

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

// Configure Google Auth Provider
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account'
});

// Helper for Google Sign-In via Popup
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    return result.user;
  } catch (error: any) {
    const errorStr = String(error?.code || '') + ' ' + String(error?.message || '') + ' ' + String(error || '');
    const isCancellation = 
      error?.code === 'auth/popup-closed-by-user' || 
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/user-cancelled' ||
      errorStr.includes('popup-closed-by-user') ||
      errorStr.includes('cancelled-popup-request') ||
      errorStr.includes('user-cancelled');

    if (isCancellation) {
      console.info('[Firebase Auth] Google sign-in window closed by user.');
      return null;
    }

    console.error('[Firebase Auth] Google Sign-In Error:', error);
    throw error;
  }
}

// Helper for signing out
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('[Firebase Auth] Sign-Out Error:', error);
    throw error;
  }
}

// Initialize Firestore (with databaseId if specified)
export const db: Firestore = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
  : getFirestore(app);

// Enable offline persistence in Firestore where supported
if (typeof window !== 'undefined') {
  try {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.info('[Firebase] Multiple tabs open, persistence enabled in first tab only.');
      } else if (err.code === 'unimplemented') {
        console.info('[Firebase] Current browser does not support Firestore offline persistence.');
      }
    });
  } catch {
    // Ignore persistence setup errors
  }
}

export default db;
