import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDG4Wiv3DPUvxc5HskmuKX83qwkLJx75Sc",
  authDomain: "loudthotzpoetry.firebaseapp.com",
  projectId: "loudthotzpoetry",
  storageBucket: "loudthotzpoetry.firebasestorage.app",
  messagingSenderId: "420233133951",
  appId: "1:420233133951:web:12be97876dc9fa948f644a",
  measurementId: "G-6EDVFL528Q",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
