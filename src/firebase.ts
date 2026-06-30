import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyANv06GKxOhqSAF5V8Ii1_CvtQ4PEnSKEo",
  authDomain: "incuvadoraunesum.firebaseapp.com",
  projectId: "incuvadoraunesum",
  storageBucket: "incuvadoraunesum.firebasestorage.app",
  messagingSenderId: "1030800499466",
  appId: "1:1030800499466:web:e2b86435639358bd4650f3",
  measurementId: "G-7R7NPN53D4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
