import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../services/auth-header";
import API_BASE_URL from "../services/api-url";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalVehicles: 0, totalBookings: 0 });
  const [users, setUsers] = useState([]);
  const [mechanicForm, setMechanicForm] = useState({ username: "", email: "", password: "" });
  const [mechanicMessage, setMechanicMessage] = useState("");

  useEffect(() => {
    // Fetch stats
    axios.get(`${API_BASE_URL}/admin/stats`, { headers: authHeader() })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));

    // Fetch users
    axios.get(`${API_BASE_URL}/admin/users`, { headers: authHeader() })
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const createMechanic = async (event) => {
    event.preventDefault();
    setMechanicMessage("");
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/mechanics`, mechanicForm, { headers: authHeader() });
      setUsers((current) => [...current, response.data]);
      setMechanicForm({ username: "", email: "", password: "" });
      setMechanicMessage("Mechanic account created.");
    } catch (error) {
      setMechanicMessage(error.response?.data?.message || "Could not create mechanic account.");
    }
  };

  return (
    <div className="container">
      <h2>Admin Control Panel</h2>

      <div className="form-container" style={{maxWidth: 'none', margin: '0 0 30px', padding: '24px'}}>
        <h3>Create mechanic account</h3>
        <form onSubmit={createMechanic}>
          <div>
            <label>Username</label>
            <input required minLength="3" maxLength="20" value={mechanicForm.username} onChange={(e) => setMechanicForm({...mechanicForm, username: e.target.value})} />
          </div>
          <div>
            <label>Email</label>
            <input type="email" required maxLength="50" value={mechanicForm.email} onChange={(e) => setMechanicForm({...mechanicForm, email: e.target.value})} />
          </div>
          <div>
            <label>Temporary password (at least 12 characters)</label>
            <input type="password" required minLength="12" maxLength="40" value={mechanicForm.password} onChange={(e) => setMechanicForm({...mechanicForm, password: e.target.value})} />
          </div>
          <button type="submit">Create mechanic</button>
          {mechanicMessage && <p role="status" style={{marginTop: '12px'}}>{mechanicMessage}</p>}
        </form>
      </div>
      
      <div className="features-section" style={{marginBottom: '40px'}}>
        <div className="feature-card" style={{textAlign: 'center', backgroundColor: '#eff6ff'}}>
          <h1 style={{fontSize: '3rem', margin: 0, color: '#2563eb'}}>{stats.totalUsers}</h1>
          <p>Total Registered Users</p>
        </div>
        <div className="feature-card" style={{textAlign: 'center', backgroundColor: '#f0fdf4'}}>
          <h1 style={{fontSize: '3rem', margin: 0, color: '#16a34a'}}>{stats.totalVehicles}</h1>
          <p>Total Platform Vehicles</p>
        </div>
        <div className="feature-card" style={{textAlign: 'center', backgroundColor: '#fef2f2'}}>
          <h1 style={{fontSize: '3rem', margin: 0, color: '#dc2626'}}>{stats.totalBookings}</h1>
          <p>Total Service Bookings</p>
        </div>
      </div>

      <h3>User Directory</h3>
      <table style={{width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
        <thead>
          <tr style={{backgroundColor: '#f3f4f6', textAlign: 'left'}}>
            <th style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>ID</th>
            <th style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>Username</th>
            <th style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>Email</th>
            <th style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{u.id}</td>
              <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}><strong>{u.username}</strong></td>
              <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{u.email}</td>
              <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
