import {
  collection,
  doc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
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
