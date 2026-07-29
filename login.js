import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


const loginForm = document.getElementById("loginForm");


if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;


    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );


      alert("Login successful!");

      window.location.href = "dashboard.html";


    } catch (error) {


      switch(error.code) {


        case "auth/invalid-credential":
          alert("Incorrect email or password.");
          break;


        case "auth/user-not-found":
          alert("No account found with this email.");
          break;


        case "auth/wrong-password":
          alert("Incorrect password.");
          break;


        default:
          alert("Login failed. Please try again.");

      }


      console.error(error);

    }


  });

}
