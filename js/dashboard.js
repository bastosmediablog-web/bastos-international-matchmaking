 import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// Dashboard Elements
const userName = document.getElementById("userName");
const profileProgress = document.getElementById("profileProgress");
const profileMessage = document.getElementById("profileMessage");
const matchesContainer = document.getElementById("matchesContainer");

// ----------------------------
// Calculate Profile Completion
// ----------------------------
function calculateProfileCompletion(data) {

  let completed = 0;
  const totalFields = 6;

  if (data.fullName) completed++;
  if (data.gender) completed++;
  if (data.dob) completed++;
  if (data.location) completed++;
  if (data.relationshipGoal) completed++;
  if (data.about) completed++;

  return Math.round((completed / totalFields) * 100);

}

// ----------------------------
// Update Progress Bar
// ----------------------------
function updateProfileProgress(data) {

  const percentage = calculateProfileCompletion(data);

  profileProgress.style.width = percentage + "%";
  profileProgress.textContent = percentage + "%";

  if (percentage === 100) {

    profileMessage.textContent = "🎉 Your profile is complete!";

  } else {

    profileMessage.textContent =
      `Complete your profile to reach 100%. Current completion: ${percentage}%`;

  }

}

// ----------------------------
// Calculate Age
// ----------------------------
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

// ----------------------------
// Load Suggested Matches
// ----------------------------
async function loadSuggestedMatches(currentUserId) {

  try {

    const querySnapshot = await getDocs(collection(db, "users"));

    let html = "";
    let count = 0;

    querySnapshot.forEach((document) => {

      if (document.id === currentUserId) return;

      if (count >= 3) return;

      const member = document.data();

      html += `

      <div class="match-preview mb-3">

        <strong>${member.fullName}</strong>

        <p>
          📍 ${member.location || "Location not provided"}
        </p>

        <p>
          🎂 ${calculateAge(member.dob)} years
        </p>

        <p>
          💍 ${member.relationshipGoal || "Not specified"}
        </p>

      </div>

      `;

      count++;

    });

    if (count === 0) {

      html = `

      <div class="text-center">

        <p>No other members have joined yet.</p>

      </div>

      `;

    }

    matchesContainer.innerHTML = html;

  } catch (error) {

    console.error("Suggested Matches Error:", error);

    matchesContainer.innerHTML = `

      <p>Unable to load suggested matches.</p>

    `;

  }

}

// ----------------------------
// Protect Dashboard
// ----------------------------
onAuthStateChanged(auth, async (user) => {

  if (!user) {

    window.location.href = "login.html";
    return;

  }

  try {

    const userRef = doc(db, "users", user.uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {

      userName.textContent = "Member";
      return;

    }

    const data = userSnap.data();

    // Welcome Message
    userName.textContent = data.fullName || "Member";

    // Profile Completion
    updateProfileProgress(data);

    // Suggested Matches
    await loadSuggestedMatches(user.uid);

  } catch (error) {

    console.error("Dashboard Error:", error);

    alert("Unable to load your dashboard. Please refresh the page.");

  }

});
