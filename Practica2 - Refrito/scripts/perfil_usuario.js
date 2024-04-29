window.onload = function() {
      // Retrieve the user token from localStorage
    var token = localStorage.getItem('usuario');

    var solicitud = new XMLHttpRequest(); // Create a new XMLHttpRequest object for certifications
    solicitud.open("GET", "http://localhost:5001/" + token + "/certification", true);
    solicitud.setRequestHeader("Content-Type", "application/json");
     // Define a function to handle the response for certifications
    solicitud.onreadystatechange = function () {
        if (solicitud.readyState === 4) {
            if (solicitud.status === 200) {
                // Parse the response JSON
                var response = JSON.parse(solicitud.responseText);
                var certifications = response.data;

                var output = "";
                // Loop through each certification and construct HTML output
                for (var i = 0; i < certifications.length; i++) {
                    output += '<div class="certificaciones">'; 
                    output += '<p>identificacion: ' + certifications[i].identifiacion + '</p>';
                    output += '<p>nombre: ' + certifications[i].nombre + '</p>';
                    output += '<p>celular: ' + certifications[i].celular + '</p>';
                    output += '<p>correo: ' + certifications[i].correo + '</p>';
                    output += '</div>';
                    output += '<hr />';
                }
                 // Display the certifications in the HTML element with id "Datos"
                document.getElementById("Datos").innerHTML  = output;
            } else {
                console.error('Error:', solicitud.status);
            }
        }
    };

    solicitud.send(); // Send the request to fetch user certifications

    
      // Create a new XMLHttpRequest object for user information
     var peticion = new XMLHttpRequest();
     var url2 = "http://localhost:5001/" + token + "/me";
     // Open a GET request to fetch user information
     peticion.open("GET", url2, true);
     peticion.setRequestHeader('Accept', 'application/json');
     peticion.setRequestHeader("Content-Type", "application/json");
     // Define a function to handle the response for user information
     peticion.onreadystatechange = function (){
         if (peticion.readyState == 4) {
             if (peticion.status == 200) {
                 // Parse the response JSON
                 var respuesta_api = JSON.parse(peticion.responseText);
                 var nombre = respuesta_api.name;

                  // Display user information in <p> tags
                 document.getElementById("user_name").innerText = nombre;
             } else {
                 alert("Hubo un error en la petición.");
             }
         }
     };
 
     // Send the request to fetch user informationd
     peticion.send();

};

// Function to redirect to add certification page
function RegistrarCertificacion(){
    window.location.href = "addCertification.html";
}
// Function to redirect to edit user information page
function editarUsuario(){
    window.location.href = "editUserInfo.html";
}
