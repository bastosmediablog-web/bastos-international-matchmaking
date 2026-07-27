// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyB92MdH8-1OpgGeLASNiZNadScRpT__YDY",
  authDomain: "bastos-matchmaking.firebaseapp.com",
  projectId: "bastos-matchmaking",
  storageBucket: "bastos-matchmaking.firebasestorage.app",
  messagingSenderId: "243503113261",
  appId: "1:243503113261:web:62e97ef60adfb1742804a4",
  measurementId: "G-FGJ25RXKEM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export them so other files can use them
export { app, auth, db, storage };
