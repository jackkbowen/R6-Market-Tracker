import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import NavBar from './components/NavBar/NavBar.jsx'
import LandingPage from './components/LandingPage/LandingPage.jsx';

function App() {
  return (
    <BrowserRouter>
    <NavBar/>
    <div className = "pt-20">
        <Routes>
            <Route index element={<LandingPage />}  />
            <Route path="/login" />
            <Route path="/about" />
            <Route path="/contact" />
            
        </Routes>
      </div>
    </BrowserRouter>
  );

}

export default App
