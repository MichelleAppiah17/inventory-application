// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // For Firestore
// Import other Firebase services as needed
// import { getAuth } from "firebase/auth"; // For Firebase Authentication
// import { getStorage } from "firebase/storage"; // For Firebase Storage

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
const db = getFirestore(app); // This initializes Firestore

export default app;
export { db };
