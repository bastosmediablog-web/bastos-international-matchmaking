import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const membersContainer = document.getElementById("membersContainer");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const querySnapshot = await getDocs(collection(db, "users"));

    membersContainer.innerHTML = "";

    let totalMembers = 0;

    querySnapshot.forEach((doc) => {

      const member = doc.data();

      // Don't show the logged-in user
      if (doc.id === user.uid) return;

      totalMembers++;

      membersContainer.innerHTML += `

      <div class="col-md-6 col-lg-4">

        <div class="dashboard-card h-100">

          <h3>${member.fullName || "Member"}</h3>

          <p><strong>📍 Location:</strong><br>
          ${member.location || "Not provided"}</p>

          <p><strong>💍 Looking For:</strong><br>
          ${member.relationshipGoal || "Not specified"}</p>

          <p><strong>About Me</strong><br>
          ${member.about || "No description yet."}</p>

          <button class="btn btn-primary-brand w-100" disabled>
            View Profile
          </button>

        </div>

      </div>

      `;

    });

    if (totalMembers === 0) {

      membersContainer.innerHTML = `

      <div class="col-12 text-center">

        <div class="dashboard-card">

          <h3>No Members Yet</h3>

          <p>
          You're currently the only registered member.
          Invite others to join Bastos Matchmaking!
          </p>

        </div>

      </div>

      `;

    }

  } catch (error) {

    console.error(error);

    membersContainer.innerHTML = `

    <div class="col-12 text-center">

      <div class="dashboard-card">

        <h3>Error</h3>

        <p>
        Unable to load members.
        Please refresh the page.
        </p>

      </div>

    </div>

    `;

  }

});
