// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNcwgEfvLUTfHFiE_Xy8xsbv1ihiK07SY",
  authDomain: "sos-blood-app-6e214.firebaseapp.com",
  projectId: "sos-blood-app-6e214",
  storageBucket: "sos-blood-app-6e214.appspot.com", // ✅ use .appspot.com not .app
  messagingSenderId: "548854353131",
  appId: "1:548854353131:web:c9011891d624480d0642ae",
  measurementId: "G-QNHJPM0Z81"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
