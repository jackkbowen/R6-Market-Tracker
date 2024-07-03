import { useState } from 'react'
import 'bulma/css/bulma.min.css';


function NavBar() {
  return ( 
    <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="">
          <img src="/src\assets\siegeLogo.jpeg"  alt="Siege Logo" />
        </a>
        <p class="is-size-3 has-text-left has-text-centered is-family-monospace">Siege Market Tracker</p>
          
        <a class="navbar-burger" role="button" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>     
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item" href="">Home</a>
          <a class="navbar-item" href="">About</a>
          <a class="navbar-item" href="">Contact</a>
        </div>
      </div>
   </nav>
    
  );
}

export default NavBar
