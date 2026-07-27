
import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const form = document.getElementById("registerForm");

if (form) {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const gender = document.getElementById("gender").value;
    const dob = document.getElementById("dob").value;
    const location = document.getElementById("location").value.trim();
    const relationshipGoal = document.getElementById("relationshipGoal").value;

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {

        fullName,
        email,
        gender,
        dob,
        location,
        relationshipGoal,

        createdAt: serverTimestamp()

      });

      alert("Registration successful!");

      window.location.href = "dashboard.html";

    } catch (error) {

      alert(error.message);

      console.error(error);

    }

  });

}
