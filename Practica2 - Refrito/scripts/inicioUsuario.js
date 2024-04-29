window.onload = function() {
    //localStorage.clear();
    
      // Define the token to use
    var token = localStorage.getItem('usuario');
     // Create a new XMLHttpRequest object
    var peticion = new XMLHttpRequest();
    var url2 = "http://localhost:5001/" + token + "/me";     // Construct the URL to fetch user data

    peticion.open("GET", url2, true);    // Open a GET request to the specified URL
    // Set request headers
    peticion.setRequestHeader('Accept', 'application/json');
    peticion.setRequestHeader("Content-Type", "application/json");
    // Define a function to handle the response
    peticion.onreadystatechange = function () {
        if (peticion.readyState == 4) {
            // Parse the response JSON
            var respuesta_api = JSON.parse(peticion.responseText);
            var nombre = respuesta_api.name;   // Get the user's name from the response

            var mensaje = "¡Bienvenido a nuestra página, " + nombre + "!";    // Construct a welcome message


            document.getElementById("message").innerText = mensaje;   // Set the welcome message in the HTML element with id="message"
        }
    }
    // Send the request
    peticion.send();


    //Enterprise Data 

    // List of enterprises
    var lista_empresas = []

    // XMLHttpRequest to fetch enterprise data
    var solicitud = new XMLHttpRequest();
    var url = "http://localhost:5001/enterprise"
    solicitud.open("GET", url, true);
    solicitud.setRequestHeader('Accept', 'application/json');
    solicitud.setRequestHeader("Content-Type", "application/json");
    // Function to handle response
    solicitud.onreadystatechange = function(){
        if (solicitud.readyState == 4){
            if (solicitud.status == 200){
                // Parsing response JSON
                var respuesta = JSON.parse(solicitud.responseText);
                var empresas = respuesta.enterprises;
                 //Loop to store enterprise data in a list
                for (var i = 0; i < empresas.length; i++ ) {
                    var idEmpresa = respuesta.enterprises[i].token;
                    var nameEnterprise = respuesta.enterprises[i].name; // va recorriendo la empresa

                     // Creating an object for each enterprise and pushing it to the list
                    var empresita = {
                        "idEmpresa": idEmpresa,
                        "nameEnterprise": nameEnterprise 
                    }

                    lista_empresas.push(empresita);

                }//cierra 
                
            }//cierra if
        }
    }
    // Sending the request
    solicitud.send();

    
    // XMLHttpRequest to fetch all jobs
    var solicitud2 = new XMLHttpRequest();
    var url2 = "http://localhost:5001/job"
    solicitud2.open("GET", url2, true);
    solicitud2.setRequestHeader('Accept', 'application/json');
    solicitud2.setRequestHeader("Content-Type", "application/json");

    var lista_jobs = [];  // List to store job data

    // Function to handle response
    solicitud2.onreadystatechange = function() {
        if (solicitud2.readyState == 4) {
            if (solicitud2.status == 200) {    
                var respuesta2 = JSON.parse(solicitud2.responseText);   // Parsing response JSON
                var jobs = respuesta2.jobs;
                var salida = "";

                // Loop through the jobs

                for (var j = 0; j < jobs.length; j++) {
                    var id_enterprise = jobs[j].enterprise;
                    var titleJob = jobs[j].titlejob;
                    var descripcion = jobs[j].description;
                    var hiringtype = jobs[j].hiringtype;
                    var job_id = jobs[j].job_id;
                    var reqs = jobs[j].requirements;


                    // Find the name of the enterprise associated with the job
                    var nombreEmpresa = "";
                    for (var x = 0; x < lista_empresas.length; x++) {
                        var idEmp = lista_empresas[x].idEmpresa;
                        if (idEmp === id_enterprise) {
                            nombreEmpresa = lista_empresas[x].nameEnterprise;
                            break; 
                        }//ciera if
                    }//cierra for

                    // Construct HTML for each job
                    salida += '<div class="job">';
                    salida += '<p class="Main_title">Empresa</p>';
                    salida +='<p class="title">' + nombreEmpresa + '</p>';
                    salida +='<p class="Main_title">Puesto de trabajo</p>';
                    salida +='<p class="title">' + titleJob + '</p>';
                    salida +='<p class="Main_title">Descripcion</p>';
                    salida +='<p class="desc">' +  descripcion+ '</p>';
                    salida +='<p class="Main_title">Duracion del contrato</p>';
                    salida +='<p class="title">' + hiringtype + '</p>';
                    salida +='<p class="Main_title">Requerimientos</p>';
                    salida +='<p class="title">' + reqs + '</p>';
                    salida +='<button class="btnAplicar" onclick="aplicar()">Aplicar</button>';
                    salida +='</div>';


                }//cierra for
                
                document.getElementById("jobs_registrados").innerHTML = salida;  // Set the generated HTML to display job information

            }//cierra status

        }//cierra solicitud


    }//cierra solicitud
    // Sending the request
    solicitud2.send();

}
// Function to redirect to user profile page
function perfil() {
    window.location.href = "perfil_interested.html";
}
// Function to handle application button click event
function aplicar() {
    alert("Usted ha aplicado exitosamente!");
    alert("Por favor no nos llame, nosotros lo llamamos");
}