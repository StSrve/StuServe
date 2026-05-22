function showSignupForm() {
  document.getElementById("signupForm").style.display = "flex";
}

function closeSignupForm() {
  document.getElementById("signupForm").style.display = "none";
}

// Add 'async' right before your function definition
async function submitForm() {

  var fname = document.getElementById("fname").value;
  var lname = document.getElementById("lname").value;
  var mobile = document.getElementById("mobile").value;
  var email = document.getElementById("email").value;

  // ... [Keep your exact error clearing and validation rules here] ...

  if (fname.length < 3 || lname.length < 3 || !/^\d{8}$/.test(mobile) || !email.includes("@")) {
    return;
  }

  // 1. Package the student data into an object
  var newProfile = {
    firstName: fname,
    lastName: lname,
    mobile: mobile,
    email: email
  };

  // 2. USE YOUR CLOUD HELPER METHOD INSTEAD OF LOCALSTORAGE
  // This pushes the data safely to 'stuserve_store' with the correct key structure
  await saveProfileToCloud(newProfile);

  // 3. Keep your UI feedback working synchronously
  document.getElementById("userName").innerHTML = fname;
  alert("Registration successful! Welcome, " + fname + "!");

  closeSignupForm();

  // Clear fields
  document.getElementById("fname").value = "";
  document.getElementById("lname").value = "";
  document.getElementById("mobile").value = "";
  document.getElementById("email").value = "";
}

// 1. Make sure this import is at the very top of your file
import { loadAllProfilesFromCloud } from 'supabase-config.js';

// 2. Replace your old loadStudents function with this async version
async function loadStudents() {
  try {
    // Fetch the global array of student profiles using your helper
    const profiles = await loadAllProfilesFromCloud();

    const container = document.getElementById("browseStudentsContainer");
    if (!container) {
      console.error("Could not find the element #browseStudentsContainer on this page.");
      return;
    }

    container.innerHTML = ""; // Clear out any stale local cards or spinners

    // Loop through the profiles and display them
    profiles.forEach(function (student) {
      // Note: Make sure the properties match exactly how you save them in step 1!
      // If you saved them as student.firstName, use that here.
      container.innerHTML += `
                <div class="student-card">
                    <h3>${student.firstName || student.fname} ${student.lastName || student.lname}</h3>
                    <p>Email: ${student.email}</p>
                    <p>Mobile: ${student.mobile}</p>
                </div>
            `;
    });

  } catch (error) {
    console.error("Failed to refresh the browse student list:", error);
  }
}


//get the first name of the user    
window.onload = function () {
  var name = localStorage.getItem("firstName");
  if (name) {
    document.getElementById("userName").textContent = name;
  }
};

