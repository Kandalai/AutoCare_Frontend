import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../services/auth-header";
import API_BASE_URL from "../services/api-url";
import VehicleService from "../services/vehicle.service";
import { Link, useLocation } from "react-router-dom";

const AIAssistant = () => {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([
    { 
      sender: 'ai', 
      text: '🏎️ Welcome to AutoCare AI Assistant! Ask me any maintenance, symptom diagnosis, or DIY repair question. I will triage whether it is a driveway DIY fix or requires a certified mechanic!', 
      requiresMechanic: false,
      diyRating: '🟢 DIY Diagnostic Mode',
      estimatedSavings: null
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  useEffect(() => {
    VehicleService.getVehicles().then(
      (response) => {
        setVehicles(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedVehicleId(response.data[0].id.toString());
        }
      },
      (error) => console.log(error)
    );

    // If navigated with prefill from DIY Guides
    if (location.state && location.state.prefillQuery) {
      setQuery(location.state.prefillQuery);
    }
  }, [location.state]);

  const handleAsk = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    const newChat = [...chat, { sender: 'user', text: userText }];
    setChat(newChat);
    setQuery("");
    setLoading(true);

    let vehicleContext = null;
    if (selectedVehicleId) {
      const selected = vehicles.find(v => v.id.toString() === selectedVehicleId);
      if (selected) {
        vehicleContext = {
          make: selected.make,
          model: selected.model,
          mileage: selected.mileage
        };
      }
    }

    axios.post(`${API_BASE_URL}/ai/ask`, { query: userText, vehicleContext }, { headers: authHeader() })
      .then(res => {
        setChat([
          ...newChat, 
          { 
            sender: 'ai', 
            text: res.data.answer, 
            requiresMechanic: res.data.requiresMechanic,
            diyRating: res.data.diyRating,
            estimatedSavings: res.data.estimatedSavings
          }
        ]);
        setLoading(false);
      })
      .catch(err => {
        const errorText = err.response?.status === 401 
          ? "Your session has expired. Please log out from the top menu and log back in."
          : "Error connecting to AI service. Please ensure the backend server is running.";
        setChat([...newChat, { sender: 'ai', text: errorText }]);
        setLoading(false);
      });
  };

  const darkBg = "#0b1120";
  const cardBg = "#151e32";
  const textColor = "#f8fafc";
  const mutedText = "#94a3b8";

  return (
    <div style={{ minHeight: '100vh', backgroundColor: darkBg, color: textColor, padding: '30px 40px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>🤖 AutoCare Enthusiast AI Advisor</h2>
          <p style={{ color: mutedText, margin: '5px 0 0 0', fontSize: '0.9rem' }}>
            Context-aware automotive intelligence & DIY vs. Pro Repair Triage
          </p>
        </div>

        <Link 
          to="/diy-guides" 
          style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '10px 18px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}
        >
          🛠️ Browse Interactive DIY Guides
        </Link>
      </div>

      <div style={{ backgroundColor: cardBg, borderRadius: '16px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', height: '650px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.06)' }}>
        
        {vehicles.length > 0 && (
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#94a3b8' }}>🚗 Telemetry Linked To:</span>
            <select 
              value={selectedVehicleId} 
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0b1120', color: '#fff', fontSize: '0.9rem', width: 'auto' }}
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.make} {v.model} ({v.mileage.toLocaleString()} km)</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {chat.map((msg, idx) => (
            <div key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
              <div style={{
                display: 'inline-block',
                padding: '16px 20px',
                borderRadius: '16px',
                backgroundColor: msg.sender === 'user' ? '#2563eb' : 'rgba(255,255,255,0.04)',
                color: '#f8fafc',
                maxWidth: '85%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                textAlign: 'left'
              }}>
                {msg.sender === 'ai' && msg.diyRating && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '3px 10px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.08)', color: '#60a5fa' }}>
                      {msg.diyRating}
                    </span>
                    {msg.estimatedSavings && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '3px 10px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                        💰 DIY Savings: {msg.estimatedSavings}
                      </span>
                    )}
                  </div>
                )}

                <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '0.95rem' }}>{msg.text}</div>
                
                {msg.requiresMechanic && (
                  <div style={{ marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <span style={{ fontWeight: '600', color: '#f87171', fontSize: '0.85rem' }}>⚠️ High Risk / Special Tools Required</span>
                    <Link to="/bookings" style={{
                      backgroundColor: '#dc2626', 
                      color: 'white', 
                      padding: '8px 16px', 
                      borderRadius: '8px', 
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '0.85rem'
                    }}>
                      Book Certified Mechanic
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <div style={{ textAlign: 'left' }}><span style={{ padding: '10px 18px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', color: mutedText, fontSize: '0.9rem' }}>🔍 Analyzing telemetry and RAG manuals...</span></div>}
        </div>

        <form onSubmit={handleAsk} style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            style={{ flex: 1, padding: '14px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0b1120', color: '#fff', fontSize: '0.95rem' }} 
            placeholder="Ask anything: e.g. 'How do I do an oil change?', 'What service is due?'" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
          />
          <button type="submit" disabled={loading} style={{ width: '110px', margin: 0, backgroundColor: '#2563eb', fontWeight: 'bold' }}>
            {loading ? "..." : "Send"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AIAssistant;
