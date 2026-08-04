 import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// Get member ID from URL
const params = new URLSearchParams(window.location.search);
const memberId = params.get("id");

// Page elements
const memberName = document.getElementById("memberName");
const memberAgeGender = document.getElementById("memberAgeGender");
const memberLocation = document.getElementById("memberLocation");
const memberGoal = document.getElementById("memberGoal");
const memberAbout = document.getElementById("memberAbout");
const memberPhoto = document.getElementById("memberPhoto");

// Calculate age
function calculateAge(dob) {

  if (!dob) return "Not specified";

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const month = today.getMonth() - birthDate.getMonth();

  if (
    month < 0 ||
    (month === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;

}

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    window.location.href = "login.html";
    return;

  }

  if (!memberId) {

    memberName.textContent = "Member not found";
    return;

  }

  try {

    const memberRef = doc(db, "users", memberId);

    const memberSnap = await getDoc(memberRef);

    if (!memberSnap.exists()) {

      memberName.textContent = "Member not found";
      return;

    }

    const member = memberSnap.data();

    memberName.textContent =
      member.fullName || "Member";

    memberAgeGender.textContent =
      `${calculateAge(member.dob)} years • ${member.gender || ""}`;

    memberLocation.textContent =
      `📍 ${member.location || "Location not provided"}`;

    memberGoal.textContent =
      member.relationshipGoal || "Not specified";

    memberAbout.textContent =
      member.about || "No description available.";

    // Default profile image
    memberPhoto.src =
      "https://via.placeholder.com/150";

  } catch (error) {

    console.error(error);

    memberName.textContent =
      "Unable to load member profile.";

  }

});
