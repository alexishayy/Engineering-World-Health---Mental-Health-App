import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { createUserDoc } from "../db/users";
import { auth } from "../firebase/firebaseConfig";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(false);
        await createUserDoc(firebaseUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
