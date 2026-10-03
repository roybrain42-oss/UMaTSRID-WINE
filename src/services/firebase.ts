// Firebase Initialization and Configuration for EcoSort Ghana
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore, enableIndexedDbPersistence, doc, getDocFromServer } from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
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

/**
 * Format Firebase Auth error codes into friendly user messages
 */
export function getFriendlyAuthErrorMessage(error: any): string {
  if (!error) return 'An unknown authentication error occurred.';
  const code = error.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please verify your credentials or sign up.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters with letters and numbers.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by your browser. Please allow popups for this site or open in a full window.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in window was closed before completing.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Access temporarily restricted. Try again later or reset password.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

/**
 * Helper for Google Sign-In via Popup
 */
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

/**
 * Sign in using email and password via Firebase Auth
 */
export async function signInWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return credential.user;
  } catch (error: any) {
    console.error('[Firebase Auth] Email Sign-In Error:', error);
    throw error;
  }
}

/**
 * Register / Create account using email and password via Firebase Auth
 */
export async function signUpWithEmail(email: string, pass: string, displayName?: string): Promise<FirebaseUser> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (displayName && credential.user) {
      try {
        await updateProfile(credential.user, { displayName });
      } catch (err) {
        console.warn('[Firebase Auth] Could not update displayName:', err);
      }
    }
    return credential.user;
  } catch (error: any) {
    console.error('[Firebase Auth] Email Sign-Up Error:', error);
    throw error;
  }
}

/**
 * Send password reset email via Firebase Auth
 */
export async function sendResetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error: any) {
    console.error('[Firebase Auth] Password reset error:', error);
    throw error;
  }
}

/**
 * Helper for signing out
 */
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

// Test connection on boot as recommended by the skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'system_settings', 'connection_test'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is offline or database initializing.');
    }
    return false;
  }
}

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

export { onAuthStateChanged };
export type { FirebaseUser };
export default db;
