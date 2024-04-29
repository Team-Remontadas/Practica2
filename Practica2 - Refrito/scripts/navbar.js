class Menu extends HTMLElement{
    constructor(){
        super();
        this.innerHTML =  `<nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="index.html">Team Remontadas</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarColor01">
            
            <ul class="navbar-nav ms-auto"> <!-- Aquí se usa ms-auto para alinear a la derecha -->
              <li class="nav-item">
                <a class="nav-link" href="#">Contacto</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Developers</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>`
    }
}

customElements.define('menu-component', Menu);