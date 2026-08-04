 import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// Dashboard elements
const userName = document.getElementById("userName");
const profileProgress = document.getElementById("profileProgress");
const profileMessage = document.getElementById("profileMessage");
const matchesContainer = document.getElementById("matchesContainer");

// Calculate profile completion
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

// Update progress bar
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

// Temporary matches
function loadSuggestedMatches() {

  matchesContainer.innerHTML = `

    <div class="match-preview">
      <strong>Coming Soon 🚀</strong>
      <p>Real member suggestions will appear here.</p>
    </div>

  `;

}

// Protect dashboard
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

    // Welcome message
    userName.textContent = data.fullName || "Member";

    // Progress
    updateProfileProgress(data);

    // Matches
    loadSuggestedMatches();

  } catch (error) {

    console.error("Dashboard Error:", error);

    alert("Unable to load your dashboard. Please refresh the page.");

  }

});
