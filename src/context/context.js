"use client"
import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import Reducer from './reducer';
import { addAttendance, addWorker, addSite, createContractorProfile, updateWorker, updateSite, deleteWorker, deleteSite, deleteAttendance } from '@/database/index';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import Notification from '@/component/Notification';

export const initialState = {
  isAuthenticated: false,
  user: null,
  users: [], // This will now store Workers
  sites: [],
  teams: [],
  dailyRecords: {
    log: [],
    activeSite: null,
    assignTeams: 0,
    activeMistri: 0,
    activeLaborer: 0,
    date: null,
  },
  allAttendance: [],
};

const avatarList = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDOxUOlUBvUsp79L34QdGlLdnY7bUDgXCD_5aONt3YUfDHWxqllPrJwy7be7sLnhY8Gfm-5rA9bYka3cJrBEfLVCfIGjUwZTslqsFNF6qF7suVhOzhywR2QB_UuqQrBOMRc0D87TqueldNgsviSACHaiVbwg_mGowg8FNLTprrJBCpM8wYrngSa2dnDRJlkA-NNKz0xRcgmxo1bQww1xA6MIr3btOLFEg8_OvGhiQ67p-xAkBwKuA7Vh_EdNKKlYW738K29VGpVszk',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAL3j5cgoeYR1c61LeAJQnEE4V-KysAnOM99ig6XgTVErPdIYcsuyHSlqQY33sWvVkapurCxhNq8_lB-A-z4fQzIj_YGZcIOZJEZh0CvMNpdFpxnjdMRATRsySj1zL0EDW-ENbt2lafZF62DT5MidOgTM-TSRzRkEA4CAGKQtPOLg6igRRbdhanSOX6SEa4-XblJV6j9Zeq4UhvvtCRRl4hElPJfrNYchazN74_2ReFAFK4oSHSVhHfpkmDT2fTCMp1rPyyhn7uSPo',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDy9jMDGgDJ3cOicGcWJivCY0oivONGsIeij6O7MzAL36jjfYufmG9UGA-GW6nWhUzZIEWjC7cg9w97fiVJqTDgsrTVUS6J-XVDjtr04aD-xDp4VM7kByLhDiDMMXJ3koRJdLLt03_HUAuyN35zBXoB4Ks9VSmDHdxXw3FP_XbMDYxaP9nt3vuHwyyHwupWcSjNVuxNO0d1hNrJe6tIaKtVbOP4u-c0GIwNlFPuW2JDC-TcGUSJfQxz74fL3o0yfxxHr48c6rCF7Nc',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCn1hqdhgJiF2572vJQHQG27trVI5oR4aXCo1mA54L6rrEb5GaQb9cEw1CZqJ2C6BTi2IYFKfEzirK4WX0DWcWXNudrMf7BwT0r8DJb93AuprRyr2BAi-1-LJoKicPjr_U5EtA6Ne2YMwAJbO6BIJdL8OOh4dUl3cg2QzG5YBePl3CRkX3xYm1GnZAzhru9fcgPWnL7EY4LWxxRao8-YbOkWxXgolO8Y1VbOY91Px0IlhWdtMapzvflHo1wHNZa1sqQobBMpzjFm-Y',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBbO54kSPZBj5b8nEe3YDr34g-hA6eIZG2JxT5c6wBILm1FfKyYGOthP3Wm-jFNiJ8jCyiJWm-0Yy43iTPFL7v_29d6bPGgikmi0Cwn4R7pHAp5-4_18g172iOrMwlZytiAJ-O_zjQhqnYxJPW-sEtSjMrd-27s-ZC4XmcBiKUoVBBRhEKxIA21dAI4jD2EkgAuVKeP8h15KFXda6MHEGxt5mpw7QAZ2bJ7r-m29dZ7TBbpK-S9F-eYSefuGblcMlXOreppr-_lyC4',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBG4DIel7wxfmaYhCFW2t1BLWlWl6lBdtjwFw0K8H6soYxwaefKRy8EZfdDRlnzIPMeaCwTN8RkKpXqWFf_2W0_9aqdqwhJBxnQDQnyA71Io7GyzgY1VmkY3M_O6T2nMeujR5Hwi5JNb4P8eaJ-pw7TlRg5qjF_-x6KOezTp-8WABCcMbzS3VFn5u2dqRSrDKD_J3xuJmt_fV58YGLqsDW4QDRS95eJ51u_Ff6BZwJhK3TTdXx3HxKgGG9NK4lm0Usykrt2Ceuedno',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBlZku6m67qfrg02pauIHS8y7SJctUSQjDAYa6xdi299OFY8zYaD_wpQdyI6ufMRVWgJiXNmMHEALwpbgxY2UtzRiDUmTJBNrQSG49GTi37wj1pIUJiwwZ0wIdD9ZaISILavi6Z-kaLC4TNCyD4xO7RVeLqExtIwJZ35TY4a4HzaBt6A7Bw6alcl3zNq8_h947DFDoUM8lgzH0LERHKAc_np1etmRsu0IE9zYWc2uVeRjFYZa_9SjlGCjgB3LJHrous41o9gIAq5FU',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAsDK0jl4Hhi0ttC-rzBdBqpkzFakgUSBcOuBairlOrlbqmWPXOKqAnxJB7gyLqIR7fLMHXPbix0IGmsag5Awj38EdzrGsDtW8vsHXoNW64psOpbfMkCO2s_uhTAybnERF8p7iwHYwd7i79D20BmjjFldaZa_5GOikyPu1mKIieQ2woXzP3v12CA855fdXIEwIZU6tEG0qkMwU2ZS1l5GMDdFPvP6u21XgOgy3OAlMvCXq-HneRy7dZ8T7npjcKuV-A_pYYXphTOnw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBTraajyHE6um147_AE0cZwx9w8UPtyK8B6EOpVeMa9c5H9I5BJdu5ZKEnnlPyh-nTdHdDK7zARk-_KqkQfjgUn1r3OqFGNsApRJgeRzdpEcgl-MXuahuMbn4YqZ_bTuPsDzNCEma_ZM068sIEYwm2gVfd_WEtgZoH_jNHIDVxcFQEUdU6-ZQQicBYj3Atxxard4dJPR67m9iC4lSURceDac0Ozbsk6tcK5XCd_0aq_GLPQ1YkbEkCMmSJHFSbTJtfVweKQ193jZkk',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCS6YbnPEbLYRgVEhQnVSL5jr34GGkNJWv59eaDAcWm4a0gg-vdFxponuuAE6C71UO4h51zyNGkwiFr2-UBPYfJeqE8L5WQfj_2smPlrl9saYW9XEfjp6gh5zd6jIXhiuR-X7ICZbAgjj-NvpQ-QnyoLu-e_YGqozk4Z_Ga6D-Z8y0IXcHGXMitBvUZS8aXW3cwVxhxdCnt4pO3WzYvqZtOpCEcCdYb1Lzhk4RVxZFNEhHe6LJcrHmBYl1G9MVgeUFUoEkvJ5sRqz8',
];

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const [lastAvatarIndex, setLastAvatarIndex] = useState(avatarList.length - 1);
  const [notification, setNotification] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSites = () => { };
    let unsubscribeWorkers = () => { };
    let unsubscribeAttendance = () => { };

    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // 1. Fetch/Set Contractor Profile
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          dispatch({ type: "SET_AUTH", payload: { ...user, ...userDocSnap.data() } });
        } else {
          dispatch({ type: "SET_AUTH", payload: { ...user, isNewUser: true } });
        }

        // 2. Start Listeners for Sub-collections

        // Workers (formerly Users/Teams)
        unsubscribeWorkers = onSnapshot(collection(db, "users", user.uid, "workers"), (snapshot) => {
          const workers = snapshot.docs.map(doc => doc.data());
          // Dispatch SET_USERS to populate state.users and state.teams
          dispatch({ type: "SET_USERS", payload: workers });
        });

        // Sites
        unsubscribeSites = onSnapshot(collection(db, "users", user.uid, "sites"), (snapshot) => {
          const sites = snapshot.docs.map(doc => doc.data());
          dispatch({ type: "SET_SITES", payload: sites });
        });

        // Daily Attendance
        unsubscribeAttendance = onSnapshot(collection(db, "users", user.uid, "dailyAttendance"), (snapshot) => {
          const records = snapshot.docs.map(doc => {
            const data = doc.data();
            if (data.date && data.date.toDate) {
              data.date = data.date.toDate();
            }
            return data;
          });

          const today = new Date();
          const todayRecords = records.filter(record => {
            const recordDate = record.date;
            return recordDate.getDate() === today.getDate() &&
              recordDate.getMonth() === today.getMonth() &&
              recordDate.getFullYear() === today.getFullYear();
          });

          dispatch({ type: "SET_DAILY_RECORDS", payload: todayRecords });
          dispatch({ type: "SET_ALL_ATTENDANCE", payload: records });
        });

      } else {
        dispatch({ type: "CLEAR_AUTH" });
        // Cleanup listeners when logged out
        unsubscribeSites();
        unsubscribeWorkers();
        unsubscribeAttendance();
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSites();
      unsubscribeWorkers();
      unsubscribeAttendance();
    };
  }, []);

  const signIn = (user) => {
    // Firebase handles state automatically
  };

  const signOut = () => {
    auth.signOut();
  };

  const handleAddMember = async (newMember) => {
    if (!state.user?.uid) return;

    const timestamp = Date.now();
    const safeName = newMember.name ? newMember.name.replace(/\s+/g, '_').toLowerCase() : 'user';
    const uid = `${safeName}_${timestamp}`;
    let nextIndex = (lastAvatarIndex + 1) % avatarList.length;
    if (avatarList.length === 1) nextIndex = 0;

    const workerObj = {
      uid,
      name: PreetyText(newMember.name),
      dailyWage: newMember.dailyWage,
      avatar: avatarList[nextIndex],
      role: PreetyText(newMember.role),
    };

    setLastAvatarIndex(nextIndex);
    try {
      await addWorker(state.user.uid, workerObj);
      setNotification({ type: 'success', message: 'Member added successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to add member.' });
    }
  };

  const handleAddSite = async (newSite) => {
    if (!state.user?.uid) return;

    const timestamp = Date.now();
    const safeName = newSite.name ? newSite.name.replace(/\s+/g, '_').toLowerCase() : 'site';
    const uid = `${safeName}_${timestamp}`;
    let nextIndex = (lastAvatarIndex + 1) % avatarList.length;
    if (avatarList.length === 1) nextIndex = 0;

    const siteObj = {
      uid,
      name: PreetyText(newSite.name),
      location: PreetyText(newSite.location),
      avatar: avatarList[nextIndex],
      mistriWage: newSite.mistriWage,
      laborWage: newSite.laborWage,
    };

    setLastAvatarIndex(nextIndex);
    try {
      await addSite(state.user.uid, siteObj.uid, siteObj);
      setNotification({ type: 'success', message: 'Site added successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to add site.' });
    }
  };

  const handleEditMember = async (memberData) => {
    if (!state.user?.uid) return;
    try {
      await updateWorker(state.user.uid, memberData.uid, memberData);
      setNotification({ type: 'success', message: 'Member updated successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to update member.' });
    }
  };

  const handleDeleteMember = async (uid) => {
    if (!state.user?.uid) return;
    try {
      await deleteWorker(state.user.uid, uid);
      setNotification({ type: 'success', message: 'Member deleted successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to delete member.' });
    }
  };

  const handleEditSite = async (siteData) => {
    if (!state.user?.uid) return;
    try {
      await updateSite(state.user.uid, siteData.uid, siteData);
      setNotification({ type: 'success', message: 'Site updated successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to update site.' });
    }
  };

  const handleDeleteSite = async (uid) => {
    if (!state.user?.uid) return;
    try {
      await deleteSite(state.user.uid, uid);
      setNotification({ type: 'success', message: 'Site deleted successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to delete site.' });
    }
  };

  const setUser = (i) => {
    dispatch({ type: "SET_USERS", payload: i });
  };

  const setAttendence = async (i) => {
    if (!state.user?.uid) return;
    try {
      await addAttendance(state.user.uid, i);
      setNotification({ type: 'success', message: 'Attendance recorded successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to record attendance.' });
    }
  };

  const handleDeleteAttendance = async (siteId, date) => {
    if (!state.user?.uid) return;
    try {
      await deleteAttendance(state.user.uid, siteId, date);
      setNotification({ type: 'success', message: 'Attendance deleted successfully!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to delete attendance.' });
    }
  };

  const PreetyText = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }

  return (
    <StateContext.Provider value={{ ...state, dispatch, loading, signIn, signOut, setUser, handleAddMember, handleAddSite, setAttendence, handleDeleteAttendance, handleEditMember, handleDeleteMember, handleEditSite, handleDeleteSite, notification, setNotification }} >
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {children}
    </StateContext.Provider >
  )
}

export const useStateValue = () => useContext(StateContext);
