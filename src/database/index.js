import { db } from "@/firebase";
import { doc, setDoc, deleteDoc, updateDoc, Timestamp } from "firebase/firestore";

// --- GENERIC HELPERS ---
const userDoc = (uid, ...path) => doc(db, "users", uid, ...path);

// --- CREATE / UPDATE ---

/**
 * Creates or updates the Contractor's main profile.
 */
export const createContractorProfile = async (uid, userData) => {
    await setDoc(userDoc(uid), {
        ...userData,
        uid,
        role: userData.role || "Contractor",
        createdAt: userData.createdAt || Timestamp.now(),
        updatedAt: Timestamp.now(),
        isActive: true,
    }, { merge: true });
};

/**
 * Adds a new Worker (Labourer).
 */
export const addWorker = async (userId, data) => {
    await setDoc(userDoc(userId, "workers", data.uid), {
        ...data,
        createdAt: Timestamp.now(),
    });
};

/**
 * Adds a new Site.
 */
export const addSite = async (userId, siteId, data) => {
    await setDoc(userDoc(userId, "sites", siteId), {
        ...data,
        uid: siteId,
        createdAt: Timestamp.now(),
    });
};

/**
 * Adds a daily attendance record.
 */
export const addAttendance = async (userId, { site, teams, date }) => {
    const dateString = date.toISOString().split('T')[0];
    const recordId = `${site.uid}_${dateString}`;

    // Create a map of present laborers for easy lookup
    const presentLaborersMap = teams.reduce((acc, worker) => {
        acc[worker.uid] = { name: worker.name };
        return acc;
    }, {});

    await setDoc(userDoc(userId, "dailyAttendance", recordId), {
        siteId: site.uid,
        siteName: site.name,
        date: Timestamp.fromDate(date),
        laborerCount: teams.length,
        presentLaborerIds: teams.map(t => t.uid),
        presentLaborers: presentLaborersMap,
        updatedAt: Timestamp.now(),
    });
};

// --- UPDATE ---
export const updateWorker = (userId, uid, data) => updateDoc(userDoc(userId, "workers", uid), data);
export const updateSite = (userId, uid, data) => updateDoc(userDoc(userId, "sites", uid), data);

// --- DELETE ---
export const deleteWorker = (userId, uid) => deleteDoc(userDoc(userId, "workers", uid));
export const deleteSite = (userId, uid) => deleteDoc(userDoc(userId, "sites", uid));

/**
 * Deletes a daily attendance record.
 */
export const deleteAttendance = async (userId, siteId, date) => {
    const dateString = date.toISOString().split('T')[0];
    const recordId = `${siteId}_${dateString}`;
    await deleteDoc(userDoc(userId, "dailyAttendance", recordId));
};
