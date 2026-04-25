import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDuKB0w9GeyXPTr9pBlyjjLrgumqqQPePU",
  authDomain: "md-mubarok-hossain.firebaseapp.com",
  databaseURL: "https://md-mubarok-hossain-default-rtdb.firebaseio.com",
  projectId: "md-mubarok-hossain",
  storageBucket: "md-mubarok-hossain.firebasestorage.app",
  messagingSenderId: "399079788020",
  appId: "1:399079788020:web:3121a231a7b432ff6bbda1",
  measurementId: "G-6WZRLRZ89Y",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export { app, db };
