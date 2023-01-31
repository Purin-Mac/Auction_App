// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import firebase from 'firebase/compat/app';
// import "firebase/compat/auth"
// import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// firebase.initializeApp(firebaseConfig);

// //initialize firestore
// export const db = firebase.firestore();

// export const auth = firebase.auth();

// const provider = new firebase.auth.GoogleAuthProvider();
// provider.setCustomParameters({ prompt: 'select_account' });

// export const signInWithGoogle = () => firebase.auth().signInWithPopup(provider);

// export default firebase;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize firestore
export const db = getFirestore(app);

// const provider = new GoogleAuthProvider();
// provider.setCustomParameters({ prompt: 'select_account' });

//initialize auth
export const auth = getAuth();

// export const signInWithGoogle = () =>
//     signInWithPopup(auth, provider).then((result) => {console.log(result)});