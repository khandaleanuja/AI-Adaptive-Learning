import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDi0JCLKr706FfSJntYP4Cjl8gM2oQQm1c",
  authDomain: "adaptive-ai-learning-3f90d.firebaseapp.com",
  projectId: "adaptive-ai-learning-3f90d",
  storageBucket: "adaptive-ai-learning-3f90d.firebasestorage.app",
  messagingSenderId: "116803514836",
  appId: "1:116803514836:web:6879b38a3a6a231b31e641"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);