import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCruFR54ee-vx6OT4nvEZRjwRk3UioUoOQ",
  authDomain: "qqqqqq-b0de0.firebaseapp.com",
  projectId: "qqqqqq-b0de0",
  storageBucket: "qqqqqq-b0de0.firebasestorage.app",
  messagingSenderId: "917413585767",
  appId: "1:917413585767:web:b500f5b90d4296ec7e05c2",
  measurementId: "G-D5610XF37H"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, storage, analytics };
