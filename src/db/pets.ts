import {
  collection,
  doc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function addPet(userId: string, petType: string) {
  const petRef = doc(collection(db, "users", userId, "pets"));

  await setDoc(petRef, {
    type: petType,
    level: 1,
    xp: 0,
    createdAt: Date.now(),
  });
}

export async function addPetXP(userId: string, petId: string, amount: number) {
  const petRef = doc(db, "users", userId, "pets", petId);

  await updateDoc(petRef, {
    xp: increment(amount),
  });
}

export async function getPets(userId: string) {
  const petsRef = collection(db, "users", userId, "pets");
  const snapshot = await getDocs(petsRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// New: simple pet progress helpers stored on the user document under `petProgress`.
export async function getPetProgress(userId: string) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return {};
  const data = snap.data();
  return (data as any).petProgress ?? {};
}

export async function setPetProgress(userId: string, progress: any) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { petProgress: progress });
}
