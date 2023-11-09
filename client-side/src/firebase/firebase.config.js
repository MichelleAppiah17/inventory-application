// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4C-_gUmNS2iOdoj8kuBRdr7m88qMqDu4",
  authDomain: "mern-book-inventory-70d78.firebaseapp.com",
  projectId: "mern-book-inventory-70d78",
  storageBucket: "mern-book-inventory-70d78.appspot.com",
  messagingSenderId: "162548478652",
  appId: "1:162548478652:web:dd8217743f1b308e7196b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;