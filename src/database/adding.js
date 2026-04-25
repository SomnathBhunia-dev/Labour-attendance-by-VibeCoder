import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

/**
 * Creates or updates the Contractor's main profile.
 * @param {string} uid - The Auth UID.
 * @param {object} userData - Profile data (name, email, phone, etc.).
 */
export const createContractorProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      uid: uid,
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      photoURL: userData.photoURL,
      role: userData.role || "Contractor",
      createdAt: userData.createdAt || Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true,
      // ... any other contractor settings
    }, { merge: true });
    console.log("Contractor profile created/updated:", uid);
  } catch (error) {
    console.error("Error creating contractor profile:", error);
    throw error;
  }
};

/**
 * Adds a new Worker (Labourer) to the contractor's sub-collection.
 * @param {string} parentUid - The Contractor's UID.
 * @param {object} workerData - Worker details.
 */
export const addWorker = async (parentUid, workerData) => {
  try {
    // If workerData has a uid, use it, otherwise generate one or let Firestore do it.
    // Here we assume the caller provides a uid (like in the original code)
    const workerRef = doc(db, "users", parentUid, "workers", workerData.uid);

    await setDoc(workerRef, {
      uid: workerData.uid,
      name: workerData.name,
      role: workerData.role,
      dailyWage: workerData.dailyWage ?? null,
      avatar: workerData.avatar ?? null,
      createdAt: Timestamp.now(),
    });
    console.log("Worker added successfully:", workerData.uid);
  } catch (error) {
    console.error("Error adding worker:", error);
    throw error;
  }
};

/**
 * Adds a new Site to the contractor's sub-collection.
 * @param {string} parentUid - The Contractor's UID.
 * @param {string} siteUid - The Site's UID.
 * @param {object} siteData - Site details.
 */
export const addSite = async (parentUid, siteUid, siteData) => {
  try {
    const siteRef = doc(db, "users", parentUid, "sites", siteUid);
    await setDoc(siteRef, {
      uid: siteUid,
      name: siteData.name,
      location: siteData.location,
      avatar: siteData.avatar,
      mistriWage: siteData.mistriWage,
      laborWage: siteData.laborWage,
      createdAt: Timestamp.now(),
    });
    console.log("Site added successfully:", siteUid);
  } catch (error) {
    console.error("Error adding site:", error);
    throw error;
  }
};

/**
 * Adds a daily attendance record to the contractor's sub-collection.
 * @param {string} parentUid - The Contractor's UID.
 * @param {object} attendanceInfo - Attendance details.
 */
export const addAttendance = async (parentUid, attendanceInfo) => {
  const { site, teams, date } = attendanceInfo;

  const siteId = site.uid;
  const siteName = site.name;
  const dateString = date.toISOString().split('T')[0];
  const recordId = `${siteId}_${dateString}`;

  // Path: users/{parentUid}/dailyAttendance/{recordId}
  const dailyRecordRef = doc(db, "users", parentUid, "dailyAttendance", recordId);

  try {
    const presentLaborersMap = {};
    const presentLaborerIds = [];

    for (const laborer of teams) {
      presentLaborerIds.push(laborer.uid);
      presentLaborersMap[laborer.uid] = {
        name: laborer.name,
        // wage snapshot if needed
      };
    }

    const recordData = {
      siteId: siteId,
      siteName: siteName,
      date: Timestamp.fromDate(date),
      laborerCount: teams.length,
      presentLaborerIds: presentLaborerIds,
      presentLaborers: presentLaborersMap,
      updatedAt: Timestamp.now(),
    };

    await setDoc(dailyRecordRef, recordData);
    console.log("Successfully recorded attendance for site:", siteName);

  } catch (error) {
    console.error("Error recording site attendance:", error);
    throw error;
  }
};