 import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const userName = document.getElementById("userName");


onAuthStateChanged(auth, async (user) => {

  if (!user) {

    // No logged-in user
    window.location.href = "login.html";
    return;

  }


  try {

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);


    if (userSnap.exists()) {

      const data = userSnap.data();

      userName.textContent = data.fullName || "Member";

    } else {

      userName.textContent = "Member";

    }


  } catch (error) {

    console.error("Error loading profile:", error);

  }

});
