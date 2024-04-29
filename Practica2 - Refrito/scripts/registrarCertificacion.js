// Listen for the DOMContentLoaded event to ensure all elements are loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", function () { 
    var submitBtn = document.getElementById("btnGuardar"); // Get the submit button element by its ID

    submitBtn.addEventListener("click", function (event) {    // Add a click event listener to the submit button

        event.preventDefault();  // Prevent the default form submission behavior

        // Get the values of the form fields
        var categoria = document.getElementById("txtCategoria").value;
        var centroEstudios = document.getElementById("txtCentroEstudios").value;
        var descripcion = document.getElementById("txtDescripcion").value;
        var anho = document.getElementById("anho").value;
        var token = localStorage.getItem("usuario");

        // Check for empty fields
        if (categoria.trim() === "" || centroEstudios.trim() === "" || descripcion.trim() === "" || anho.trim() === "") {
            alert("Por favor, rellena todos los campos.");
            return; // Stop execution if any field is empty
        }

        // Create an object with the form data
        var datos = {
            "identifiacion": descripcion,
            "nombre": categoria,
            "celular": centroEstudios,
            "correo": anho,
            "token": token
        };

         // Convert the object to JSON format
        var data = JSON.stringify(datos);
        var url = "http://localhost:5001/" + token + "/certification";
        var remoto = new XMLHttpRequest();

        remoto.open("POST", url); // Open a POST request to the API endpoint
        remoto.setRequestHeader("Content-Type", "application/json");  // Set the Content-Type header for the POST request

        remoto.onreadystatechange = function () {   // Define a function to handle the response from the server
            if (remoto.readyState === XMLHttpRequest.DONE) {
                if (remoto.status === 201) {     
                    alert("Certificación registrada exitosamente!"); // Alert the user about successful certification registration
                    window.location.href = "perfil_interested.html"; // Redirect the user to the interested user's profile page
                } else {
                    alert("Error al registrar la certificación. Inténtalo de nuevo.");    // Alert the user about an error in certification registration
                }
            }
        };
        remoto.send(data);  // Send the data to the server
    });
});