 import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const membersContainer = document.getElementById("membersContainer");

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

// Get initials for profile placeholder
function getInitials(name) {

  if (!name) return "M";

  return name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();

}

// Load all members
async function loadMembers(currentUserId) {

  try {

    const querySnapshot = await getDocs(collection(db, "users"));

    let html = "";
    let totalMembers = 0;

    querySnapshot.forEach((document) => {

      if (document.id === currentUserId) return;

      const member = document.data();

      totalMembers++;

      html += `

      <div class="col-md-6 col-lg-4 mb-4">

        <div class="member-profile-card">

          <div class="member-photo">

            ${getInitials(member.fullName)}

          </div>

          <div class="member-body">

            <h3>${member.fullName || "Member"}</h3>

            <p class="member-age">

              ${calculateAge(member.dob)} Years • ${member.gender || ""}

            </p>

            <p class="member-location">

              📍 ${member.location || "Location not provided"}

            </p>

            <div class="member-goal">

              💍 ${member.relationshipGoal || "Not specified"}

            </div>

            <p class="member-about">

              ${member.about || "This member hasn't added an introduction yet."}

            </p>

            <div class="member-actions">

              <button
                class="btn btn-outline-brand"
                disabled>

                ❤️ Like

              </button>

              <a
                href="member.html?id=${document.id}"
                class="btn btn-primary-brand">

                👁 View

              </a>

            </div>

          </div>

        </div>

      </div>

      `;

    });

    if (totalMembers === 0) {

      membersContainer.innerHTML = `

      <div class="col-12">

        <div class="dashboard-card text-center">

          <h2>No Members Yet</h2>

          <p>

            You're currently the only member on Bastos Matchmaking.

          </p>

          <p>

            Invite others to join and start making meaningful connections.

          </p>

        </div>

      </div>

      `;

      return;

    }

    membersContainer.innerHTML = html;

  }

  catch (error) {

    console.error(error);

    membersContainer.innerHTML = `

      <div class="col-12">

        <div class="dashboard-card text-center">

          <h2>Oops!</h2>

          <p>

            Unable to load members at the moment.

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
