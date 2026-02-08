import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGWjm_X9thiNNFQ0e7MtCZWmlKKTq6tL8",
  authDomain: "mental-health-app-ewh.firebaseapp.com",
  projectId: "mental-health-app-ewh",
  storageBucket: "mental-health-app-ewh.firebasestorage.app",
  messagingSenderId: "121234910977",
  appId: "1:121234910977:web:b794c3bc271ab894553500",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
