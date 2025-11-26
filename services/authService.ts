import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { User, BotSettings } from '../types';

const DEFAULT_SETTINGS: BotSettings = {
  botName: 'ShopBot',
  avatarColor: 'indigo',
  welcomeMessage: "Hi there! 👋 Welcome to our store. How can I help you today?",
  customInstructions: "You are a friendly and professional AI sales assistant. Be helpful, concise, and warm. Help customers find what they need and answer their questions.",
  currency: 'NGN',
  businessDetails: {
    openingHours: 'Mon-Fri: 9:00 AM - 6:00 PM',
    address: 'Online Store',
    contactInfo: 'Contact us via WhatsApp',
    deliveryPolicy: 'We offer delivery and shipping options. Ask for details!'
  }
};

export const authService = {
  // Observe auth state changes
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          // Ensure defaults
          if (!userData.botSettings.businessDetails) {
            userData.botSettings.businessDetails = { ...DEFAULT_SETTINGS.businessDetails };
          }
          callback(userData);
        } else {
          // Should not happen for registered users, but handle gracefully
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },

  login: async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      if (!userData.botSettings.businessDetails) {
        userData.botSettings.businessDetails = { ...DEFAULT_SETTINGS.businessDetails };
      }
      return userData;
    } else {
      throw new Error('User data not found');
    }
  },

  register: async (email: string, password: string, businessName: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const newUser: User = {
      id: userCredential.user.uid,
      email,
      businessName,
      botSettings: { ...DEFAULT_SETTINGS }
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
    return newUser;
  },

  loginWithGoogle: async (): Promise<User> => {
    const { signInWithPopup } = await import('firebase/auth');
    const { googleProvider } = await import('./firebase');

    const userCredential = await signInWithPopup(auth, googleProvider);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      if (!userData.botSettings.businessDetails) {
        userData.botSettings.businessDetails = { ...DEFAULT_SETTINGS.businessDetails };
      }
      return userData;
    } else {
      // Create new user if not exists
      const newUser: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        businessName: userCredential.user.displayName || 'My Business',
        botSettings: { ...DEFAULT_SETTINGS }
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      return newUser;
    }
  },

  logout: async () => {
    await signOut(auth);
  },

  updateSettings: async (userId: string, settings: BotSettings, businessName?: string, vendorWhatsApp?: string): Promise<User | null> => {
    const userRef = doc(db, 'users', userId);
    const updates: any = { botSettings: settings };

    if (businessName) {
      updates.businessName = businessName;
    }

    if (vendorWhatsApp !== undefined) {
      updates.vendorWhatsApp = vendorWhatsApp;
    }

    await updateDoc(userRef, updates);

    const updatedDoc = await getDoc(userRef);
    if (updatedDoc.exists()) {
      return updatedDoc.data() as User;
    }
    return null;
  },

  // Get bot configuration by user ID (for shareable links)
  getBotById: async (userId: string): Promise<User | null> => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  }
};