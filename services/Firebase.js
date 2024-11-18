// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC17Nt9NLToahdrjomUpg6zkz8YJDoKkqM",
  authDomain: "proyectopersonal-9a373.firebaseapp.com",
  projectId: "proyectopersonal-9a373",
  storageBucket: "proyectopersonal-9a373.firebasestorage.app",
  messagingSenderId: "847590792427",
  appId: "1:847590792427:web:44ecb8ab6425fc815ab2ae",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export const db = getFirestore(appFirebase);

export default appFirebase;
