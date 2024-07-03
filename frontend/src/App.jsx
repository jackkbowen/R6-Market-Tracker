import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import NavBar from './NavBar.jsx'
import 'bulma/css/bulma.min.css';
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  
  return (

  <BrowserRouter>
  <NavBar/>
  <div className = "pt-20">
    <Routes>
      <Route path="/">
        <Route index />
        <Route path="login" />
      </Route>
    </Routes>
  </div>
  </BrowserRouter>
    
  );

}

export default App
