
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYJbPzcp7CE4YP1IkqhtHdaZXdahBegds",
  authDomain: "sportmate-4272f.firebaseapp.com",
  projectId: "sportmate-4272f",
  storageBucket: "sportmate-4272f.firebasestorage.app",
  messagingSenderId: "720065906251",
  appId: "1:720065906251:web:3270e636429bfc9b4e2fce",
  measurementId: "G-ECR75EGF50"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(FirebaseApp);
export const db = getFirestore(FirebaseApp);