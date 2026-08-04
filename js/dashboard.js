 import { auth, db } from "./firebase.js";

 import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const userName = document.getElementById("userName");
const profileProgress = document.getElementById("profileProgress");
const profileMessage = document.getElementById("profileMessage");
const matchesContainer = document.getElementById("matchesContainer");


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
     
// Calculate profile completion
let completed = 0;
const totalFields = 6;

if (data.fullName) completed++;
if (data.gender) completed++;
if (data.dob) completed++;
if (data.location) completed++;
if (data.relationshipGoal || data.goal) completed++;
if (data.about) completed++;

const percentage = Math.round((completed / totalFields) * 100);

profileProgress.style.width = percentage + "%";
profileProgress.textContent = percentage + "%";

if (percentage === 100) {
    profileMessage.textContent = "🎉 Your profile is complete!";
} else {
    profileMessage.textContent =
        `Complete your profile to reach 100%. Current completion: ${percentage}%`;
}
     matchesContainer.innerHTML = `
    <div class="match-preview">
        <strong>Coming Soon 🚀</strong>
        <p>Real member suggestions will appear here.</p>
    </div>
`;
    } else {

      userName.textContent = "Member";

    }


  } catch (error) {

    console.error("Error loading profile:", error);

  }

});
