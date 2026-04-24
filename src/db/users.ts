import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function createUserDoc(user: any) {
  await setDoc(doc(db, "users", user.uid), {
    name: user.displayName || "",
    email: user.email,
    profilePic: "",
    currencies: {}, // empty at start
  });
}

export async function getUser(userId: string) {
  const docRef = doc(db, "users", userId);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    return snapshot.data();
  } else {
    throw new Error("User not found");
  }
}
