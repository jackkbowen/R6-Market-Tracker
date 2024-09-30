import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar/NavBar.jsx'
import 'bulma/css/bulma.min.css';
import './App.css'

function App() {
  return (
  <BrowserRouter>
      <NavBar/>
      <div className = "pt-20">
          <Routes>
          <Route path="/">
              <Route index />
              <Route path="login" />
              <Route path="about" />
              <Route path="contact" />
            
          </Route>
          </Routes>
      </div>
  </BrowserRouter>
  );

}

export default App
