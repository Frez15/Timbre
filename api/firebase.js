// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvqFN-_r1XQkf1jQEATHLKztu9EdijnkU",
  authDomain: "timbre-152bf.firebaseapp.com",
  projectId: "timbre-152bf",
  storageBucket: "timbre-152bf.firebasestorage.app",
  messagingSenderId: "228520068137",
  appId: "1:228520068137:web:24ddcf1776e3e8743d0838",
  measurementId: "G-0MMV8MMZBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
