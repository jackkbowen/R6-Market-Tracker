import React, { useEffect, useState } from 'react';
import logo from '../../assets/SMlogoNoBG.png'

import Footer from '../Footer/Footer';


const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState('');



  return ( 
    <>
    <nav className="bg-Mossy1 fixed w-full shadow-lg shadow-grey-800 z-20 top-0 left-0">
      <div className="max-w-screen-xl flex items-center justify-start mx-auto p-4">
        <a href="http://localhost:5173/" className="flex items-center space-x-3">
          <img 
            src={logo}
            className="w-12 h-12"
            alt="Peripha Logo" 
          />
          <span className="self-center text-2xl font-semibold text-white">Siege Market Analyst</span>
        </a>
        {/*   SEARCH BAR - Landing page has a search bar, so not really needed. 
        <form className="flex justify-center flex-grow px-20">
          <input 
          type="text" 
          placeholder='Search...'
          className="bg-gray-700 px-4 py-2 rounded-md focus:outline-none w-full text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          />
          
        </form>
        */}
      </div>
    </nav>
    </>

    


    /*
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
      <div class="navbar-menu is-active">
        <div class="navbar-end">
          <div class="navbar-item" href="">
            Home
          </div>
          <a class="navbar-item" href="">About</a>
          <a class="navbar-item" href="">Contact</a>
        </div>
      </div>
   </nav>
   */
    
  );
}

export default NavBar
