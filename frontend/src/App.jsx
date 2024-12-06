import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import NavBar from './components/NavBar/NavBar.jsx'
import LandingPage from './components/LandingPage/LandingPage.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import Search from './components/Search/Search.jsx';

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
            <Route path="*" element={<ErrorPage />} />
          
      </Routes>
    </div>
    </BrowserRouter>
  );

}

export default App
