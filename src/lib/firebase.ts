import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-5skVZN5Xz1X-nnQdRMV03zdQwsZ7In8",
  authDomain: "aplikasi-ijazah.firebaseapp.com",
  projectId: "aplikasi-ijazah",
  storageBucket: "aplikasi-ijazah.firebasestorage.app",
  messagingSenderId: "309441136003",
  appId: "1:309441136003:web:2707742038f3a884cb62b6",
  measurementId: "G-R7H1EM9FT1"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
