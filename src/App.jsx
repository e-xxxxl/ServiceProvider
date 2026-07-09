import { useState } from 'react'
import { BrowserRouter, Routes, Route , Router} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx"
import Hero from './components/Herosection/Hero.jsx';

import { AuthProvider } from './context/AuthContext';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import EmailVerification from './components/auth/EmailVerification';
// import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     
      
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero/>} />
        {/* Define other routes here */}
        <Route path="/directory" element={<div className="p-20 text-center">Directory Page</div>} />
      </Routes>


       <AuthProvider>
      
        <div className="min-h-screen bg-gray-50">
        
          <Routes>
            {/* Public Routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            
            {/* Protected Routes */}
            {/* <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            /> */}
            
           
          </Routes>
        </div>
     
    </AuthProvider>
    
    </>
  )
}

export default App
