// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { genCategories, genProducts, genUsers } from "./SeedDB";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize firestore
export const db = getFirestore(app);

//generate database in firestore
genUsers(db);
genCategories(db);
// genProducts(db);

export const timestamp = serverTimestamp();

//initialize cloud storage
export const storage = getStorage(app);

//initialize auth
export const auth = getAuth();
