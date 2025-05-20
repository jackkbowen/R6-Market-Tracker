import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import NavBar from './components/NavBar/NavBar.jsx'
import LandingPage from './components/LandingPage/LandingPage.jsx';
import Search from './components/Search/Search.jsx';
import NotFound from './components/NotFound.jsx';

function App() {
  return (
    <BrowserRouter>
    <NavBar/>
    <div className = "pt-20">
      <Routes>
          <Route path="/" element={<NavBar />} />
            <Route index element={<LandingPage />}  />
            <Route path="login" />
            <Route path="about" />
            <Route path="contact" />
            <Route path="search/:searchQuery" element={<Search />} />
            <Route path="*" element={<NotFound />} />
          
      </Routes>
    </div>
    </BrowserRouter>
  );

}

export default App
