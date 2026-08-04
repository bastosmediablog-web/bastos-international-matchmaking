 import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const membersContainer = document.getElementById("membersContainer");

// Calculate age from date of birth
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

// Display members
async function loadMembers(currentUserId) {

  try {

    const querySnapshot = await getDocs(collection(db, "users"));

    membersContainer.innerHTML = "";

    let html = "";
    let totalMembers = 0;

    querySnapshot.forEach((document) => {

      if (document.id === currentUserId) return;

      const member = document.data();

      totalMembers++;

      html += `

      <div class="col-md-6 col-lg-4">

        <div class="dashboard-card h-100">

          <h3>${member.fullName || "Member"}</h3>

          <p>
            <strong>Age:</strong><br>
            ${calculateAge(member.dob)} years
          </p>

          <p>
            <strong>📍 Location:</strong><br>
            ${member.location || "Not provided"}
          </p>

          <p>
            <strong>💍 Relationship Goal:</strong><br>
            ${member.relationshipGoal || "Not specified"}
          </p>

          <p>
            <strong>About Me</strong><br>
            ${member.about || "No description yet."}
          </p>

          <a
  href="member.html?id=${document.id}"
  class="btn btn-primary-brand w-100">

  View Profile

</a>

        </div>

      </div>

      `;

    });

    if (totalMembers === 0) {

      membersContainer.innerHTML = `

      <div class="col-12">

        <div class="dashboard-card text-center">

          <h3>No Members Yet</h3>

          <p>

            You're currently the only registered member.

          </p>

          <p>

            Invite your friends to join Bastos Matchmaking.

          </p>

        </div>

      </div>

      `;

      return;

    }

    membersContainer.innerHTML = html;

  } catch (error) {

    console.error("Members Error:", error);

    membersContainer.innerHTML = `

    <div class="col-12">

      <div class="dashboard-card text-center">

        <h3>Something went wrong</h3>

        <p>

          We couldn't load the members list.

        </p>

      </div>

    </div>

    `;

  }

}

// Protect page
onAuthStateChanged(auth, (user) => {

  if (!user) {

    window.location.href = "login.html";
    return;

  }

  loadMembers(user.uid);

});
