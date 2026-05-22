function showSignupForm() {
  document.getElementById("signupForm").style.display = "flex";
}

function closeSignupForm() {
  document.getElementById("signupForm").style.display = "none";
}

// Add 'async' right here before the function keyword
async function submitForm() {
  var fname = document.getElementById("fname").value;
  var lname = document.getElementById("lname").value;
  var mobile = document.getElementById("mobile").value;
  var email = document.getElementById("email").value;

  // ... Keep your exact input validation rules here ...

  if (fname.length < 3 || lname.length < 3 || !/^\d{8}$/.test(mobile) || !email.includes("@")) return;

  // REPLACE YOUR OLD LOCALSTORAGE LINES WITH THIS TRY/CATCH BLOCK:
  try {
    const studentKey = `student_${email}`;

    // Send to your stuserve_store table
    const { data, error } = await supabase
      .from('stuserve_store')
      .insert([
        {
          key: studentKey,
          value: {
            firstName: fname,
            lastName: lname,
            mobile: mobile,
            email: email
          }
        }
      ]);

    if (error) throw error; // If Supabase reports an error, jump to the catch block

    // Global success triggers!
    alert("Registration successful! Welcome, " + fname + "!");
    document.getElementById("userName").innerHTML = fname;
    closeSignupForm();

    // Reset inputs
    document.getElementById("fname").value = "";
    document.getElementById("lname").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("email").value = "";

  } catch (error) {
    console.error("Database connection failure:", error.message);
    alert("Could not save registration across devices: " + error.message);
  }
}

async function loadStudents() {
  try {
    const { data, error } = await supabase
      .from('stuserve_store')
      .select('*');

    if (error) throw error;

    // Clear out your current browse container UI element first
    const container = document.getElementById("browseStudentsContainer");
    container.innerHTML = "";

    // Loop through the data array returned from your cloud table
    data.forEach(function (row) {
      // Read out the properties directly from your custom JSON value bucket
      var student = row.value;

      // Build simple UI cards dynamically for every student entry found
      container.innerHTML += `
                <div class="student-card">
                    <h3>${student.firstName} ${student.lastName}</h3>
                    <p>Email: ${student.email}</p>
                    <p>Mobile: ${student.mobile}</p>
                </div>
            `;
    });

  } catch (error) {
    console.error("Error reading students from Supabase:", error.message);
  }
}



//get the first name of the user    
window.onload = function () {
  var name = localStorage.getItem("firstName");
  if (name) {
    document.getElementById("userName").textContent = name;
  }
};

