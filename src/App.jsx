import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Everyone hits HomePage */}
        <Route path="/" element={<Home />} />

        {/* Public auth routes */}
        <Route path="/login"  element={<Login />} />
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
    </BrowserRouter>
  )
}

export default App
