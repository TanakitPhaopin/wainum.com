import React, {useState} from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import { Navbar } from './components/Navbar.jsx'
import LoginModal from './pages/LoginModal.jsx'
import SignupModal from './pages/SignupModal.jsx'
import Search from './pages/Search.jsx'
import { ToastContainer, Slide } from 'react-toastify';
import Redirect from './pages/Redirect.jsx'
import Profile from './pages/teacher/Profile.jsx'
import Teacher from './pages/teacher/Teacher.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import { Subscription } from './pages/Subscription.jsx'
import Favourite from './pages/student/Favourite.jsx'
import Settings from './pages/Settings.jsx'
import ForgetPassword from './pages/ForgetPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'

function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const openLogin   = () => { setSignupOpen(false); setLoginOpen(true);}
  const closeLogin  = () => setLoginOpen(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const openSignup   = () =>  { setLoginOpen(false); setSignupOpen(true);}
  const closeSignup  = () => setSignupOpen(false);
  return (
    <BrowserRouter >
      <div className="min-h-screen flex flex-col">
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
        <div className="flex-grow flex justify-center p-4 w-full bg-gradient-to-b animated-background from-[#F0F9FA] via-[#A4D8E1] to-[#F0F9FA]">
          <LoginModal open={loginOpen} handleClose={closeLogin} openSignup={openSignup}/>
          <SignupModal open={signupOpen} handleClose={closeSignup} openLogin={openLogin}/>
          <div className='w-full md:w-11/12 xl:w-2/3 2xl:w-1/2'>
            <Routes>
              {/* Public auth routes */}
              <Route path="/" element={<Home openSignupClick={openSignup}/>} />
              <Route path='/search' element={<Search />} />
              <Route path='/terms-of-service' element={<TermsOfService />} />
              <Route path='/teacher/:id' element={<Teacher />} />
              <Route path="/forget-password" element={<ForgetPassword/>} />
              

              {/* Private - All */}
              <Route path="/redirect"
                element={
                  <ProtectedRoute>
                    <Redirect />
                  </ProtectedRoute>
                }
              />
              <Route path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="/reset-password"
                element={
                  <ProtectedRoute>
                    <ResetPassword />
                  </ProtectedRoute>
                }
              />
              {/* Private - Teacher */}
              <Route
                path="/teacher/profile"
                element={
                  <ProtectedRoute requiredRole={'ครูสอนว่ายน้ำ'}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute requiredRole={'ครูสอนว่ายน้ำ'}>
                    <Subscription />
                  </ProtectedRoute>
                }
              />
              {/* Private - Student */}
              <Route
                path="/student/favorites"
                element={
                  <ProtectedRoute requiredRole={'นักเรียน'}>
                    <Favourite />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
        <footer className='bg-white w-full p-4 sm:p-8 text-center text-black'>
          <div className='flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center'>
            <p className='text-gray-600'>© {new Date().getFullYear()} ว่ายน้ำ.com สงวนลิขสิทธิ์</p>
            <div className='flex flex-col gap-2 sm:flex-row sm:justify-center sm:space-x-6'>
              <Link to="/terms-of-service" className='hover:underline'>
                ข้อตกลงและเงื่อนไขการใช้งาน
              </Link>
              <Link to="/contact" className=' hover:underline'>
                ติดต่อเรา
              </Link>
              <Link to="/faq" className='hover:underline'>
                คำถามที่พบบ่อย
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
