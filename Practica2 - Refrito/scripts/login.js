function ValidarCorreo() {
    event.preventDefault(); // Preventing default form submission behavior
    localStorage.clear(); // Clearing localStorage
     // Retrieving email and password from input fields
    var email = document.getElementById('TxtEmail').value;
    var password = document.getElementById('TxtPassword').value;
  
    //validation 
    if (email == "") {
      alert("Email is required");
      document.getElementById('TxtEmail').focus();
      return false;
    } else if (password == "" || password == " ") {
      alert("Password is required");
      document.getElementById('TxtPassword').focus();
      return false;
    } else {
      //connecting if nothing is empty


      // Creating a new XMLHttpRequest object
      var remoto = new XMLHttpRequest();
      var url = "http://localhost:5001/login/" + email + "/" + password;   // Constructing URL for login
  
      remoto.open("GET", url, true)
      remoto.setRequestHeader("Content-Type","application/json");
       // Function to handle response
      remoto.onreadystatechange = function() {
        if (remoto.readyState == 4) {
          if (remoto.status == 200) {
            // Parsing response JSON
            var response = JSON.parse(remoto.responseText); 
            var token = response.token;

             // Storing user token in localStorage
            localStorage.setItem("usuario", token);

           // Testing if the token can be retrieved from localStorage
            var pruebita = localStorage.getItem("usuario");

            alert("Login successful");

            // Redirecting to user's homepage
            window.location.href = "perfil_interested.html";     // Main page
          } else if (remoto.status == 404) {
            alert("User not found");
          } else {
            alert("Error: " + remoto.status);
          }
        }
      };
      remoto.send(); // Sending the request
    }
  }
  
// Event listener for sign-up button
  btnSignUp.addEventListener("click",function(){
    window.location.href = "index.html";  // Redirecting to sign-up page
  })