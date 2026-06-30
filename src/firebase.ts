import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAP5SjIlcpzf-UQSBX7OFE_FYtBh8Cgm_8",
  authDomain: "incuvadoraauthen.firebaseapp.com",
  projectId: "incuvadoraauthen",
  storageBucket: "incuvadoraauthen.firebasestorage.app",
  messagingSenderId: "814517190665",
  appId: "1:814517190665:web:843e8ee915c1c5c41b38d8",
  measurementId: "G-CYT9QVFZK4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
