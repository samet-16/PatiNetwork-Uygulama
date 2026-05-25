
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * PATIMAP FIREBASE MİMARİSİ
 * 
 * Bu yapılandırma process.env.API_KEY'i kullanır.
 * Eğer proje ID ve API anahtarı uyuşmazsa Firebase 'auth/api-key-not-valid' hatası verir.
 * Uygulama bu durumda 'Demo Modu'na düşecek şekilde tasarlanmıştır.
 */

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "patimap-78148.firebaseapp.com",
  projectId: "patimap-78148",
  storageBucket: "patimap-78148.appspot.com",
  messagingSenderId: "781489202874",
  appId: "1:781489202874:web:58853a0fdb60bc936d0483"
};

let app: FirebaseApp;

// Hatalı başlatmayı önlemek için kontrol
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

export const auth = getAuth(app!);
export const db = getFirestore(app!);
export const storage = getStorage(app!);

export const isConfigValid = 
  !!process.env.API_KEY && 
  process.env.API_KEY !== "" && 
  process.env.API_KEY !== "undefined";

export default app!;
