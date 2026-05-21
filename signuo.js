function showSignupForm(){
    document.getElementById("signupForm").style.display = "flex";
  }

  function closeSignupForm(){
    document.getElementById("signupForm").style.display = "none";
  }

  function submitForm(){

    var fname = document.getElementById("fname").value;
    var lname = document.getElementById("lname").value;
    var mobile = document.getElementById("mobile").value;
    var email = document.getElementById("email").value;

    //To clear any preveious error

    document.getElementById("fnameError").innerHTML = "";
    document.getElementById("lnameError").innerHTML = "";
    document.getElementById("mobileError").innerHTML = "";
    document.getElementById("emailError").innerHTML = "";

    if(fname.length < 3){
      document.getElementById("fnameError").innerHTML = "First name must have at least 3 characters";
    }

    if(lname.length < 3){
      document.getElementById("lnameError").innerHTML = "Last name must have at least 3 characters";
    }
        
      /* "^" is the start of string
     /d{8} means exactly 8 digits
      $ means end of string*/

    if(!/^\d{8}$/.test(mobile)){
      
      document.getElementById("mobileError").innerHTML = "Mobile number must be exactly 8 digits";
    }

    if(!email.includes("@")){
      document.getElementById("emailError").innerHTML = "Enter A valid email address";
    }

    if(
      fname.length < 3 || lname.length < 3 || !/^\d{8}$/.test(mobile) || !email.includes("@")
    ) return;


    //save users's first name in localstorage
    localStorage.setItem("firstName", fname);
    
    //so it immediately shows the name without refresh
    document.getElementById("userName").innerHTML = fname;






    alert("Registration successful! Welcome , "+ fname + "!");

     closeSignupForm();

    document.getElementById("fname").value = "";
    document.getElementById("lname").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("email").value = "";
}



//get the first name of the user    
window.onload = function() {
  var name = localStorage.getItem("firstName");
  if(name){
      document.getElementById("userName").textContent = name;
  }
};

