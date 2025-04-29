import React, {useState} from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import { Navbar } from './components/Navbar.jsx'
import LoginModal from './pages/LoginModal.jsx'
import SignupModal from './pages/SignupModal.jsx'

function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const openLogin   = () => { setSignupOpen(false); setLoginOpen(true);}
  const closeLogin  = () => setLoginOpen(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const openSignup   = () =>  { setLoginOpen(false); setSignupOpen(true);}
  const closeSignup  = () => setSignupOpen(false);

  return (
    <BrowserRouter>
      <div className='w-full h-full bg-yellow-50'>
        <Navbar onLoginClick={openLogin} openSignupClick={openSignup}/>
        <LoginModal open={loginOpen} handleClose={closeLogin} openSignup={openSignup}/>
        <SignupModal open={signupOpen} handleClose={closeSignup} openLogin={openLogin}/>
        <Routes>
          {/* Everyone hits HomePage */}
          <Route path="/" element={<Home />} />

          {/* Public auth routes */}
          <Route path="/signup" element={<Signup />} />

          {/* Private dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
