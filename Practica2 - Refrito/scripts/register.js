// Get references to the HTML elements
var btnGuardar = document.getElementById("btnGuardar");
var txtNombre = document.getElementById("name");
var txtEmail = document.getElementById("email");
var txtPasswd = document.getElementById("passwd");
var txtPasswdConfirm = document.getElementById("passwdConfirm");

var remoto = new XMLHttpRequest(); // Create a new XMLHttpRequest object
var url = "http://localhost:5001/interested"; // Define the URL for the POST request to the server

// Add an event listener to the save button
btnGuardar.addEventListener("click", function(){ 
    // Add an event listener to the save button
    if (txtNombre.value !== "" && txtEmail.value !== "" && txtPasswd.value !== "" && txtPasswdConfirm.value !== "") {
           // Check if passwords match
        if (txtPasswd.value === txtPasswdConfirm.value) {
            // Create a JSON object with the form data
            var datos = JSON.stringify({
                "name": txtNombre.value,
                "email": txtEmail.value,
                "passwd": txtPasswd.value
            });
              // Open a POST request to the server
            remoto.open("POST", url, true);
            remoto.setRequestHeader('Accept', 'application/json');
            remoto.setRequestHeader("Content-Type", "application/json");
             // Define a function to handle the response
            remoto.onreadystatechange = function (){
                if(remoto.readyState == 4) {   // Check if the request was successful (status code 201)
                    if(remoto.status == 201) {
                        alert("Petición completada con éxito."); // Alert and redirect on successful completion
                        window.location.href = "login.html";
                    } else {
                        alert("Hubo un error en la petición."); // Alert if there was an error in the request
                    } 
                } 
            };

             // Send the request with the JSON data
            remoto.send(datos);

        } else {
            // Alert if passwords don't match
            alert("Las contraseñas deben ser iguales.");
        }
    } else {
        // Alert if any field is empty
        alert("Todos los campos son obligatorios.");
    }
});
