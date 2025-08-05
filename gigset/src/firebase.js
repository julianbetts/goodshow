// src/lib/firebase.js
import { initializeApp } from 'firebase/app';     
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCn29mVFV2Hw73YPfYldIFLXYWA0AHIGrU",
  authDomain: "goodshow-446a7.firebaseapp.com",
  projectId: "goodshow-446a7",
  storageBucket: "goodshow-446a7.firebasestorage.app",
  messagingSenderId: "709962433901",
  appId: "1:709962433901:web:b2d0d31410ecea9fef0664",
  measurementId: "G-HGTQQNBP7E"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
