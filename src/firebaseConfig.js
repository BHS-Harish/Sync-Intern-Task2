import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "*****",
  authDomain: "*****",
  projectId: "*****",
  storageBucket: "*****",
  messagingSenderId: "*****",
  appId: "*****"
};

export const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const database=getFirestore(app);