
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVPJCVx4yITPia6DF3U0YyxZP_PTT-570" ,
  authDomain: "mern-estate-aban.firebaseapp.com",
  projectId: "mern-estate-aban",
  storageBucket: "mern-estate-aban.appspot.com",
  messagingSenderId: "69845892315",
  appId: "1:69845892315:web:31d4e1195dca89964f20fe"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);