import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export type FriendSummary = {
  id: string;
  name: string;
  email: string;
  streak?: number;
};

export type CheerEvent = {
  cheererId: string;
  cheererName: string;
  timestamp: number;
};

export type UserDocument = {
  name: string;
  email: string;
  profilePic: string;
  currencies: any;
  friends: FriendSummary[];
  incomingFriendRequests: FriendSummary[];
  recentCheers?: CheerEvent[];
};

export async function createUserDoc(user: any) {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      name: user.displayName || user.email?.split("@")[0] || "",
      email: user.email?.toLowerCase(),
      profilePic: "",
      currencies: {},
      friends: [],
      incomingFriendRequests: [],
      recentCheers: [],
    });
    return;
  }

  const existing = snapshot.data();
  const updates: Partial<UserDocument> = {};

  if (!existing?.name) {
    updates.name = user.displayName || user.email?.split("@")[0] || "";
  }
  if (!existing?.email) {
    updates.email = user.email?.toLowerCase();
  }
  if (existing?.profilePic === undefined) {
    updates.profilePic = "";
  }
  if (existing?.currencies === undefined) {
    updates.currencies = {};
  }
  if (!Array.isArray(existing?.friends)) {
    updates.friends = [];
  }
  if (!Array.isArray(existing?.incomingFriendRequests)) {
    updates.incomingFriendRequests = [];
  }
  if (!Array.isArray(existing?.recentCheers)) {
    updates.recentCheers = [];
  }

  if (Object.keys(updates).length > 0) {
    await updateDoc(userRef, updates);
  }
}

export async function getUser(userId: string) {
  const docRef = doc(db, "users", userId);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    return snapshot.data() as UserDocument;
  } else {
    throw new Error("User not found");
  }
}

export async function findUserByEmail(email: string) {
  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(
    query(usersRef, where("email", "==", email.toLowerCase()))
  );

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  return { id: docSnap.id, data: docSnap.data() as UserDocument };
}

export async function findUserByName(name: string) {
  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(
    query(usersRef, where("name", "==", name))
  );

  if (querySnapshot.empty) {
    return null;
  }

  const docSnap = querySnapshot.docs[0];
  return { id: docSnap.id, data: docSnap.data() as UserDocument };
}

export async function findUserByIdentity(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  const emailMatch = await findUserByEmail(trimmedValue);
  if (emailMatch) {
    return emailMatch;
  }

  return await findUserByName(trimmedValue);
}

export async function sendFriendRequest(
  fromUser: FriendSummary,
  toUserId: string
) {
  const targetDocRef = doc(db, "users", toUserId);
  await updateDoc(targetDocRef, {
    incomingFriendRequests: arrayUnion(fromUser),
  });
}

export async function acceptFriendRequest(
  currentUser: FriendSummary,
  requester: FriendSummary
) {
  const currentRef = doc(db, "users", currentUser.id);
  const requesterRef = doc(db, "users", requester.id);

  // Read both documents so we can deduplicate by id and write canonical shapes
  const [currentSnap, requesterSnap] = await Promise.all([
    getDoc(currentRef),
    getDoc(requesterRef),
  ]);

  if (!currentSnap.exists() || !requesterSnap.exists()) {
    throw new Error("User document not found");
  }

  const currentData = currentSnap.data() as UserDocument;
  const requesterData = requesterSnap.data() as UserDocument;

  const currentIncoming = Array.isArray(currentData?.incomingFriendRequests)
    ? currentData.incomingFriendRequests.slice()
    : [];
  const currentFriends = Array.isArray(currentData?.friends)
    ? currentData.friends.slice()
    : [];
  const requesterFriends = Array.isArray(requesterData?.friends)
    ? requesterData.friends.slice()
    : [];

  const newIncoming = currentIncoming.filter((r) => r.id !== requester.id);

  const upsertFriend = (arr: FriendSummary[], f: FriendSummary) => {
    const map = new Map(arr.map((item) => [item.id, item]));
    map.set(f.id, {
      id: f.id,
      name: f.name,
      email: f.email,
      streak: f.streak ?? 0,
    });
    return Array.from(map.values());
  };

  const newCurrentFriends = upsertFriend(currentFriends, {
    id: requester.id,
    name: requester.name,
    email: requester.email,
    streak: requester.streak ?? 0,
  });

  const newRequesterFriends = upsertFriend(requesterFriends, {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    streak: currentUser.streak ?? 0,
  });

  // Write back deduplicated arrays using setDoc merge to preserve other fields
  await Promise.all([
    setDoc(
      currentRef,
      { incomingFriendRequests: newIncoming, friends: newCurrentFriends },
      { merge: true }
    ),
    setDoc(requesterRef, { friends: newRequesterFriends }, { merge: true }),
  ]);
}

export async function declineFriendRequest(
  currentUserId: string,
  requester: FriendSummary
) {
  const currentRef = doc(db, "users", currentUserId);
  await updateDoc(currentRef, {
    incomingFriendRequests: arrayRemove(requester),
  });
}

export async function sendCheerToFriend(
  currentUserId: string,
  currentUserName: string,
  friendId: string
) {
  const cheerEvent: CheerEvent = {
    cheererId: currentUserId,
    cheererName: currentUserName,
    timestamp: Date.now(),
  };

  const friendRef = doc(db, "users", friendId);
  await updateDoc(friendRef, {
    recentCheers: arrayUnion(cheerEvent),
  });
}

export async function removeFriend(
  currentUser: FriendSummary,
  friend: FriendSummary
) {
  const currentRef = doc(db, "users", currentUser.id);
  const friendRef = doc(db, "users", friend.id);

  await updateDoc(currentRef, {
    friends: arrayRemove(friend),
  });

  await updateDoc(friendRef, {
    friends: arrayRemove(currentUser),
  });
}

// Cheer-all functionality removed. Per-friend cheering remains via `sendCheerToFriend`.

export function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}
