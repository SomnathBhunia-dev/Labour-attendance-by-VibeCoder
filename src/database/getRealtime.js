import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';

/**
 * Sets up a real-time listener for all users in the 'users' collection.
 * @param {function} callback - Function to call with the updated user list on every change.
 * @returns {function} Unsubscribe function to stop listening.
 */
export function listenToAllUsers(callback) {
  const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
    const users = snapshot.docs.map(doc => doc.data());
    callback(users);
  });
  return unsubscribe;
} 