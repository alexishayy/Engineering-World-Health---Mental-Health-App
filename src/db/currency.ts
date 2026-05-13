import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function addCurrency(
  userId: string,
  petType: string,
  amount: number,
) {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    [`currencies.${petType}`]: increment(amount),
  });
}
