import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';

// User's Real Google Firebase Configuration (anndata-c276c)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB5YRDiGu-bMZ7Bodtxp1QTjl1GmLtezgw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "anndata-c276c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "anndata-c276c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "anndata-c276c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "109076935845",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:109076935845:web:9d46962f2d20b879cfc94c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HSSTGN8ECH"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Invisible reCAPTCHA Verifier for Real Mobile Phone SMS
export const setupRecaptcha = (buttonElementId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, buttonElementId || 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        console.log('reCAPTCHA solved. Real SMS dispatched via Google Firebase anndata-c276c.');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired.');
      }
    });
  }
  return window.recaptchaVerifier;
};

// Send Real Mobile Phone SMS via Firebase Phone Auth
export const sendRealMobileSms = async (phoneNumber, buttonId) => {
  try {
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    const verifier = setupRecaptcha(buttonId);
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    window.confirmationResult = confirmationResult;
    return { success: true, confirmationResult };
  } catch (error) {
    console.error('Firebase Phone SMS Error:', error);
    throw error;
  }
};

// Real Google Sign-In Popup
export const loginWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      name: user.displayName,
      email: user.email,
      uid: user.uid,
      photoURL: user.photoURL
    };
  } catch (error) {
    console.error('Firebase Google Sign-In Error:', error);
    throw error;
  }
};
