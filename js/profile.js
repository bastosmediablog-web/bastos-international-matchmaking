import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const profileName = document.getElementById("profileName");

const fullName = document.getElementById("fullName");
const location = document.getElementById("location");
const goal = document.getElementById("goal");
const about = document.getElementById("about");

const profileForm = document.getElementById("profileForm");


let currentUserId = null;



onAuthStateChanged(auth, async (user) => {


  if (!user) {

    window.location.href = "login.html";
    return;

  }


  currentUserId = user.uid;


  const userRef = doc(db, "users", user.uid);


  const userSnap = await getDoc(userRef);



  if (userSnap.exists()) {


    const data = userSnap.data();


    profileName.textContent = data.fullName || "Member";

    fullName.value = data.fullName || "";

    location.value = data.location || "";

    goal.value = data.goal || "";

    about.value = data.about || "";


  }


});



profileForm.addEventListener("submit", async (e) => {


  e.preventDefault();


  if (!currentUserId) return;



  const userRef = doc(db, "users", currentUserId);



  await updateDoc(userRef, {


    fullName: fullName.value,

    location: location.value,

    goal: goal.value,

    about: about.value


  });



  profileName.textContent = fullName.value;


  alert("Profile updated successfully ❤️");


});
