window.onload = function() {
     // Gets all the images from the carousel and stores them in a variable
    let imagenes = document.querySelectorAll('.banner-img');
      // Initializes the index of the current image to 0 (the first image)
    let imagenActiva = 0;

     // Function that handles changing the active image in the carousel
    function cambiarImagen() {
         // First, hides the currently visible image
        imagenes[imagenActiva].style.display = 'none';
        // Changes the index to the next image in the list
        imagenActiva = (imagenActiva + 1) % imagenes.length; // The % operator helps to loop back to 0 if the index exceeds the number of images
        // Shows the new active image
        imagenes[imagenActiva].style.display = 'block';
    }

     // Changes the image every 3000 milliseconds (3 seconds)
    setInterval(cambiarImagen, 3000);
};
