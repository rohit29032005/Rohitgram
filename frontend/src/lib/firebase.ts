import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRscGf-b_VQ6Mgjg8FQdHN9M0tC59Mc6M",
  authDomain: "rohitgram-ec590.firebaseapp.com",
  projectId: "rohitgram-ec590",
  storageBucket: "rohitgram-ec590.firebasestorage.app",
  messagingSenderId: "211302791723",
  appId: "1:211302791723:web:cf92f89bfdd6969dfd086e",
  measurementId: "G-4RE8SH4CFF"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
