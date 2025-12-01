import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
  type Analytics,
} from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC5HKAord3bOR0iTe7WszB_lxJH9ydfzGc",
  authDomain: "cquatro.firebaseapp.com",
  projectId: "cquatro",
  storageBucket: "cquatro.firebasestorage.app",
  messagingSenderId: "1050640512376",
  appId: "1:1050640512376:web:629372d9e5ed65875d848d",
  measurementId: "G-V9Y4LP04ZH",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      analytics = null;
    });
}

export { app, auth, analytics };
