import React from 'react'
import './App.css'
// import AppRouter from './routes/AppRouter'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useLocation } from 'react-router-dom'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProblemList from './pages/ProblemList';
import Problem from './pages/Problem'
import Home from './pages/Home';
import Compiler from './pages/Compiler'
import EmailVerify from './pages/EmailVerify'
import Submission from './pages/Submission'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/problemset" element={<ProblemList />} />
        <Route path ='/problemset/:slug' element ={<Problem/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/compiler" element={<Compiler/>}/>
        <Route path="/email-verify" element={<EmailVerify/>}/>
        <Route path="/submission/:slug" element={<Submission />} />
      </Routes>
      
    </div>
  )
}

export default App
