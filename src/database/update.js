import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export const updateWorker = async (parentUid, workerUid, workerData) => {
  try {
    const workerRef = doc(db, "users", parentUid, "workers", workerUid);
    await updateDoc(workerRef, workerData);
    console.log("Worker updated successfully:", workerUid);
  } catch (error) {
    console.error("Error updating worker:", error);
    throw error;
  }
};

export const updateSite = async (parentUid, siteUid, siteData) => {
  try {
    const siteRef = doc(db, "users", parentUid, "sites", siteUid);
    await updateDoc(siteRef, siteData);
    console.log("Site updated successfully:", siteUid);
  } catch (error) {
    console.error("Error updating site:", error);
    throw error;
  }
};
