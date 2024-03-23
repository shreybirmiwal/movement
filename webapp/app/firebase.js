import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyB50vmN1GAlCDsXhkXOGUU1osR1Xc923jg",
  authDomain: "move-efb90.firebaseapp.com",
  projectId: "move-efb90",
  storageBucket: "move-efb90.appspot.com",
  messagingSenderId: "334461289924",
  appId: "1:334461289924:web:cad230e8da375f2ba39091"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);