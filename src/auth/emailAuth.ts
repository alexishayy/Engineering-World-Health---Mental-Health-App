import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

/**
 * Create a new user account
 */
export async function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Log in existing user
 */
export async function logIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Log out current user
 */
export async function logOut() {
  return signOut(auth);
}
