// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3sAyqpFDwTAB6hjSiQYhOwOfhvVZG2M0",
  authDomain: "galacycell.firebaseapp.com",
  projectId: "galacycell",
  storageBucket: "galacycell.firebasestorage.app",
  messagingSenderId: "445037003551",
  appId: "1:445037003551:web:821e22c12ad226136c262a",
  measurementId: "G-NJ6N60WF2P"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);