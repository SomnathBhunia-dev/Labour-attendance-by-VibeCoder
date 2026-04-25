import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";

export const deleteWorker = async (parentUid, workerUid) => {
  try {
    await deleteDoc(doc(db, "users", parentUid, "workers", workerUid));
    console.log("Worker deleted successfully:", workerUid);
  } catch (error) {
    console.error("Error deleting worker:", error);
    throw error;
  }
};

export const deleteSite = async (parentUid, siteUid) => {
  try {
    await deleteDoc(doc(db, "users", parentUid, "sites", siteUid));
    console.log("Site deleted successfully:", siteUid);
  } catch (error) {
    console.error("Error deleting site:", error);
    throw error;
  }
};
