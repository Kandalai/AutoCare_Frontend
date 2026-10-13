import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import AddVehicle from "./components/AddVehicle";
import Bookings from "./components/Bookings";
import Home from "./components/Home";
import AdminDashboard from "./components/AdminDashboard";
import AIAssistant from "./components/AIAssistant";
import DIYGuides from "./components/DIYGuides";
import './App.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <BrowserRouter>
      <div>
        <nav className="navbar">
          <Link to={"/"} className="navbar-brand">
            AutoCare AI
          </Link>
          <div className="navbar-nav">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <Link to={"/dashboard"} className="nav-link">
                    Garage
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/diy-guides"} className="nav-link">
                    🛠️ DIY Guides
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/bookings"} className="nav-link">
                    Service Bookings
                  </Link>
                </li>
                
                {/* AI Assistant for everyone logged in */}
                <li className="nav-item">
                  <Link to={"/ai-assistant"} className="nav-link">
                    AI Assistant
                  </Link>
                </li>

                {/* Admin Only Route */}
                {currentUser.role === 'ROLE_ADMIN' && (
                  <li className="nav-item">
                    <Link to={"/admin"} className="nav-link">
                      Admin Panel
                    </Link>
                  </li>
                )}

                <li className="nav-item">
                  <Link to={"/profile"} className="nav-link">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={logOut}>
                    LogOut
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </div>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-vehicle" element={<AddVehicle />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/admin" element={currentUser?.role === 'ROLE_ADMIN' ? <AdminDashboard /> : <Home />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/diy-guides" element={<DIYGuides />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
