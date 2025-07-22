
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { serverConfig } from "./firebase-config-server";

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(serverConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);

export { app, db };
