import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to AutoCare AI</h1>
        <p className="subtitle">
          Your Intelligent Vehicle Maintenance & Service Management Platform
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem', marginRight: '15px' }}>
            Get Started
          </Link>
          <Link to="/login" className="btn-outline" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
            Login
          </Link>
        </div>
      </header>

      <section className="features-section">
        <div className="feature-card">
          <h3>🚗 Smart Garage</h3>
          <p>Keep track of all your vehicles, license plates, and mileage in one secure digital garage.</p>
        </div>
        <div className="feature-card">
          <h3>📅 Easy Booking</h3>
          <p>Book oil changes, brake inspections, and general services with just a few clicks.</p>
        </div>
        <div className="feature-card">
          <h3>🔧 Mechanic Portal</h3>
          <p>Dedicated dashboard for mechanics to manage jobs, update statuses, and track repairs.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
