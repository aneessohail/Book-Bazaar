
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAKmCiOADmDx9mdsHN35t4UIPchFubXBiQ",
  authDomain: "basic-da640.firebaseapp.com",
  projectId: "basic-da640",
  storageBucket: "basic-da640.appspot.com",
  messagingSenderId: "357123592852",
  appId: "1:357123592852:web:9cca172cb4d6fd25845a81"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app);
export const db=getFirestore(app)