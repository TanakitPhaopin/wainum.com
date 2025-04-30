import React, {useState} from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import { Navbar } from './components/Navbar.jsx'
import LoginModal from './pages/LoginModal.jsx'
import SignupModal from './pages/SignupModal.jsx'
import Search from './pages/Search.jsx'
import { ToastContainer, Slide } from 'react-toastify';

function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const openLogin   = () => { setSignupOpen(false); setLoginOpen(true);}
  const closeLogin  = () => setLoginOpen(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const openSignup   = () =>  { setLoginOpen(false); setSignupOpen(true);}
  const closeSignup  = () => setSignupOpen(false);

  return (
    <BrowserRouter>
      <Navbar onLoginClick={openLogin} openSignupClick={openSignup}/>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
      <div className='p-4 w-full min-h-screen bg-gradient-to-b from-[#F0F9FA] via-[#A4D8E1] to-[#F0F9FA]'>
        <LoginModal open={loginOpen} handleClose={closeLogin} openSignup={openSignup}/>
        <SignupModal open={signupOpen} handleClose={closeSignup} openLogin={openLogin}/>
        <Routes>
          {/* Everyone hits HomePage */}
          <Route path="/" element={<Home />} />

          {/* Public auth routes */}
          <Route path='/search' element={<Search />} />

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
