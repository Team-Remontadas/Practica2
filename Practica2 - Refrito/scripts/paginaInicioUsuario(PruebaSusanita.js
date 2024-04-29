window.onload = function() {
 // Crear una instancia de XMLHttpRequest
    var remoto = new XMLHttpRequest();

    // Definir la URL de la solicitud GET al endpoint del API
    var url = 'http://localhost:5001/enterprise';

    // Abrir una conexión GET con la URL del API
    remoto.open('GET', url, true);

    // Definir la función que se ejecutará cuando la solicitud se complete
    remoto.onload = function() {
        // Verificar si la solicitud fue exitosa (código de estado 200)
        if (remoto.status === 200) {
            // Parsear la respuesta JSON
            var response = JSON.parse(remoto.responseText);
            
            // Verificar si hay datos de empresas en la respuesta
            if (response.hasOwnProperty('enterprises')) {
                // Obtener la lista de empresas
                var enterpriseList = response.enterprises;

                // Crear una lista para almacenar los JSON de empresas
                var listaEmpresas = [];

                // Agregar cada objeto JSON de empresa a la lista
                enterpriseList.forEach(function(empresa) {
                    listaEmpresas.push(empresa);
                });

                // Convertir la lista de empresas a formato JSON
                var listaEmpresasJSON = JSON.stringify(listaEmpresas);

                // Guardar la lista de JSON de empresas en localStorage
                //localStorage.setItem('listaEmpresas', listaEmpresasJSON);

                for (var i = 0; i < listaEmpresas.length; i++) { 
                    if (nombreEmpresa === listaEmpresas[i].name && securityId === listaEmpresas[i].security) {
                        var token_empresa = listaEmpresas[i].token;
                        localStorage.setItem('empresa', token_empresa);
                        alert("Loggin Succesful!");
                        window.location.href = "paginaInicioEmpresa.html";
                    }

                }
                
            } else {
                alert('No se encontraron datos de empresas.');
            }
        } else {
            alert('Hubo un error al realizar la solicitud. Código de estado: ' + remoto.status);
        }
}
};


var contenedor = document.getElementById("contenedor");

// Paso 2: Itera sobre los elementos del bucle
for (var i = 0; i < 5; i++) { // Por ejemplo, crear 5 divs
    // Paso 3: Crea un nuevo elemento div
    var nuevoDiv = document.createElement("div");
    
    // Paso 4: Personaliza el div según sea necesario
    nuevoDiv.textContent = "Div " + (i + 1); // Contenido del div
    
    // Añade clases, estilos u otros atributos según sea necesario
    nuevoDiv.className = "miDiv"; // Agrega una clase para estilizar con CSS
    
    // Paso 5: Agrega el div creado al elemento contenedor
    contenedor.appendChild(nuevoDiv);
}

