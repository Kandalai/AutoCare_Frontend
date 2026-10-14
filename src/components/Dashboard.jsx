import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VehicleService from "../services/vehicle.service";
import BookingService from "../services/booking.service";
import AuthService from "../services/auth.service";

// Smart Maintenance Predictor Logic
const getMaintenanceStatus = (mileage, interval) => {
  const distanceToNext = interval - (mileage % interval);
  if (distanceToNext <= 1000) return { status: '🔴 Due', color: '#ef4444', text: `Due in ${distanceToNext} km`, percentage: 95 };
  if (distanceToNext <= 3000) return { status: '🟡 Soon', color: '#f59e0b', text: `Due in ${distanceToNext} km`, percentage: 80 };
  return { status: '🟢 Good', color: '#10b981', text: `Due at ${mileage + distanceToNext} km`, percentage: Math.floor((mileage % interval) / interval * 100) };
};

// High-Performance 0ms Local Asset Map for 100% Offline & Instant Loading

const LOCAL_CAR_MAP = {
  virtus: "/cars/virtus.png",
  slavia: "/cars/slavia.png",
  "innova crysta": "/cars/innova.jpg",
  innova: "/cars/innova.jpg",
  gloster: "/cars/gloster.jpg",
};

const getCarImage = (vehicle, resolvedImage) => {
  if (!vehicle) return "/cars/default.jpg";

  // Uploaded photos and exact make/model lookups take precedence over generic art.
  if (vehicle.imageUrl && /^data:image\//i.test(vehicle.imageUrl)) {
    return vehicle.imageUrl;
  }
  if (resolvedImage) return resolvedImage;

  const model = (vehicle.model || "").toLowerCase().trim();
  const make = (vehicle.make || "").toLowerCase().trim();

  // Match the specific model first
  for (const [name, path] of Object.entries(LOCAL_CAR_MAP)) {
    if (model.includes(name)) {
      return path;
    }
  }

  return "/cars/default.jpg";
};


const VehicleThumbnail = ({ vehicle, isSelected, onClick }) => {
  const imgSrc = getCarImage(vehicle, vehicle.resolvedImage);

  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
        padding: '10px', borderRadius: '12px',
        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
        border: isSelected ? '1px solid #3b82f6' : '1px solid transparent',
        transition: 'all 0.2s',
        minWidth: '100px'
      }}
    >
      <div style={{width: '80px', height: '50px', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px', backgroundColor: '#1e293b'}}>
        <img 
          src={imgSrc} 
          alt={`${vehicle.make} ${vehicle.model}`}
          loading="eager"
          style={{width: '100%', height: '100%', objectFit: 'cover'}} 
          onError={(e) => { e.target.src = "/cars/default.jpg"; }}
        />
      </div>
      <span style={{color: isSelected ? '#fff' : '#94a3b8', fontSize: '0.8rem', fontWeight: isSelected ? 'bold' : 'normal', textAlign: 'center'}}>
        {vehicle.make} {vehicle.model}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [vehicleImages, setVehicleImages] = useState({});
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      const fetchCall = (currentUser.role === 'ROLE_MECHANIC' || currentUser.role === 'ROLE_ADMIN') 
        ? VehicleService.getAllVehicles() 
        : VehicleService.getVehicles();
        
      fetchCall.then(
        (response) => {
          const loadedVehicles = response.data || [];
          setVehicles(loadedVehicles);
          if (response.data && response.data.length > 0) {
            setSelectedVehicle(response.data[0]);
          }
          loadedVehicles.forEach(async (vehicle) => {
            try {
              const title = encodeURIComponent(`${vehicle.make} ${vehicle.model}`.replaceAll(" ", "_"));
              const imageResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
              if (!imageResponse.ok) return;
              const summary = await imageResponse.json();
              if (summary.thumbnail?.source) {
                setVehicleImages((current) => ({ ...current, [vehicle.id]: summary.thumbnail.source }));
              }
            } catch {
              // Keep the local fallback when the lookup is unavailable.
            }
          });
        },
        (error) => {
          if (error.response && error.response.status === 401) {
            setMessage("Your login session has expired. Please Log Out from the top-right menu and Log In again.");
          } else {
            setMessage(error.response?.data?.message || error.toString());
          }
        }
      );

      // Fetch bookings for service history
      if (currentUser.role === 'ROLE_CUSTOMER') {
        BookingService.getMyBookings().then(
          (response) => setAllBookings(response.data || []),
          (error) => console.log("Failed to fetch bookings", error)
        );
      }
    }
  }, []);

  const handleDelete = (id) => {
    VehicleService.deleteVehicle(id).then(() => {
      const newVehicles = vehicles.filter((v) => v.id !== id);
      setVehicles(newVehicles);
      if (selectedVehicle?.id === id) setSelectedVehicle(newVehicles.length > 0 ? newVehicles[0] : null);
    });
  };

  if (!currentUser) return <div style={{padding: '40px', textAlign: 'center'}}>Please log in to view your dashboard.</div>;

  const isMechanic = currentUser.role === 'ROLE_MECHANIC' || currentUser.role === 'ROLE_ADMIN';

  // Mechanic view remains a simple grid
  if (isMechanic) {
    return (
      <div className="container" style={{padding: '20px'}}>
        <h2>Platform Vehicles Directory</h2>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px'}}>
          {vehicles.map(v => (
            <div key={v.id} style={{padding: '15px', backgroundColor: cardBg, color: textColor, borderRadius: '8px', border: '1px solid #334155', minWidth: '250px'}}>
              <h4 style={{color: textColor}}>{v.make} {v.model}</h4>
              <p style={{color: mutedText}}>User ID: {v.userId || 'N/A'}</p>
              <p style={{color: mutedText}}>Plate: {v.licensePlate}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- CUSTOMER ADVANCED UI (Dark Mode) ---
  const darkBg = "#0b1120"; // Dark navy background
  const cardBg = "#151e32";
  const textColor = "#f8fafc";
  const mutedText = "#94a3b8";

  if (vehicles.length === 0) {
    return (
      <div style={{minHeight: '80vh', backgroundColor: darkBg, color: textColor, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        {message ? (
          <div style={{backgroundColor: '#7f1d1d', color: '#fecaca', padding: '16px 24px', borderRadius: '10px', marginBottom: '20px', maxWidth: '600px', textAlign: 'center'}}>
            ⚠️ {message}
          </div>
        ) : (
          <>
            <h2>Welcome to your Garage</h2>
            <p style={{color: mutedText, marginBottom: '20px'}}>You don't have any vehicles registered yet.</p>
          </>
        )}
        <div style={{display: 'flex', gap: '15px'}}>
          <Link to="/add-vehicle" style={{backgroundColor: '#3b82f6', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'}}>
            + Add Vehicle
          </Link>
          {message && message.includes("expired") && (
            <Link to="/login" style={{backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'}}>
              Log In Again
            </Link>
          )}
        </div>
      </div>
    );
  }

  const v = selectedVehicle ? { ...selectedVehicle, resolvedImage: vehicleImages[selectedVehicle.id] } : null;
  if (!v) return null;

  const oilChange = getMaintenanceStatus(v.mileage, 10000);
  const brakeInspection = getMaintenanceStatus(v.mileage, 15000);
  const generalService = getMaintenanceStatus(v.mileage, 20000);
  const airFilter = getMaintenanceStatus(v.mileage, 25000);
  
  const allStatus = [oilChange, brakeInspection, generalService, airFilter];
  // Find the most urgent one
  allStatus.sort((a, b) => parseInt(a.text.replace(/[^0-9]/g, '')) - parseInt(b.text.replace(/[^0-9]/g, '')));
  const mostUrgent = allStatus[0];

  return (
    <div style={{minHeight: '100vh', backgroundColor: darkBg, color: textColor, fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: '50px', width: '100%', margin: 0}}>
      
      {/* HEADER & TOP NAV */}
      <div style={{padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid rgba(255,255,255,0.05)`}}>
        <div>
          <h2 style={{margin: '0 0 15px 0', fontSize: '1.2rem', fontWeight: '600'}}>Your vehicle selection</h2>
          <div style={{display: 'flex', gap: '15px', overflowX: 'auto'}}>
            {vehicles.map(veh => (
              <VehicleThumbnail 
                key={veh.id} 
                vehicle={{ ...veh, resolvedImage: vehicleImages[veh.id] }} 
                isSelected={veh.id === v.id} 
                onClick={() => setSelectedVehicle(veh)} 
              />
            ))}
          </div>
        </div>
        <div style={{display: 'flex', gap: '15px'}}>
          <Link to="/add-vehicle" style={{backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center'}}>
            + Add Vehicle
          </Link>
          <Link to="/bookings" style={{backgroundColor: '#fff', color: '#000', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center'}}>
            Book service
          </Link>
        </div>
      </div>

      <div style={{padding: '30px 40px', display: 'flex', gap: '30px', flexWrap: 'wrap'}}>
        
        {/* LEFT COLUMN: HERO CAR IMAGE */}
        <div style={{flex: '2', minWidth: '400px', backgroundColor: cardBg, borderRadius: '24px', position: 'relative', overflow: 'hidden', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'}}>
          
          <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'}} />
          
          <img src={getCarImage(v, vehicleImages[v.id])} 
               alt={`${v.make} ${v.model}`} 
               loading="eager"
               style={{width: '90%', maxHeight: '300px', objectFit: 'contain', zIndex: 1, filter: 'drop-shadow(0px 20px 20px rgba(0,0,0,0.5))'}} 
               onError={(e) => { e.target.src = "/cars/default.jpg"; }} />
          
          <div style={{position: 'absolute', bottom: '40px', right: '40px', zIndex: 2, textAlign: 'right'}}>
            <h1 style={{fontSize: '2.5rem', margin: '0', fontWeight: '800', letterSpacing: '-0.5px'}}>{v.make} {v.model}</h1>
            <div style={{display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 15px', borderRadius: '20px', fontSize: '0.85rem', marginTop: '10px', backdropFilter: 'blur(5px)'}}>
              General information
            </div>
          </div>
          
          <div style={{position: 'absolute', top: '40px', left: '40px', zIndex: 2}}>
             <p style={{margin: 0, color: mutedText, fontSize: '0.9rem'}}>Current Mileage</p>
             <h3 style={{margin: '5px 0 0 0', fontSize: '1.5rem'}}>{v.mileage.toLocaleString()} KMs</h3>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS & UPCOMING MAINTENANCE */}
        <div style={{flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
          
          {/* Top Stats Row */}
          <div style={{display: 'flex', gap: '20px'}}>
            <div style={{flex: 1, backgroundColor: cardBg, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: mutedText, fontSize: '0.85rem', marginBottom: '10px'}}>
                <span style={{fontSize: '1.2rem'}}>📅</span> Last service date
              </div>
              <h3 style={{margin: 0, fontSize: '1.2rem', fontWeight: '600'}}>
                {allBookings.filter(b => b.vehicle.id === v.id && b.status === 'COMPLETED').length > 0 
                  ? allBookings.filter(b => b.vehicle.id === v.id && b.status === 'COMPLETED').sort((a,b) => new Date(b.bookingDate) - new Date(a.bookingDate))[0].bookingDate 
                  : `${v.year} Purchase`}
              </h3>
            </div>
            <div style={{flex: 1, backgroundColor: cardBg, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: mutedText, fontSize: '0.85rem', marginBottom: '10px'}}>
                <span style={{fontSize: '1.2rem'}}>🔧</span> Total Services
              </div>
              <h3 style={{margin: 0, fontSize: '1.2rem', fontWeight: '600'}}>
                {allBookings.filter(b => b.vehicle.id === v.id && b.status === 'COMPLETED').length}
              </h3>
            </div>
          </div>

          {/* Upcoming Maintenance Alert */}
          <div style={{flex: 1, backgroundColor: cardBg, borderRadius: '16px', padding: '30px', display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: mutedText, fontSize: '0.9rem', marginBottom: '20px'}}>
              <span style={{fontSize: '1.2rem'}}>📋</span> Upcoming maintenance
            </div>
            
            <div style={{backgroundColor: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px'}}>
              <div style={{backgroundColor: '#3b82f6', color: '#fff', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>
                ⚠️
              </div>
              <h3 style={{margin: 0, fontSize: '1.2rem', color: '#fff'}}>Urgent Action Required</h3>
            </div>
            
            <p style={{color: mutedText, fontSize: '0.85rem', lineHeight: '1.6', marginTop: '20px', marginBottom: '30px'}}>
              Based on your vehicle's current mileage ({v.mileage} KMs), your next major service interval is approaching quickly. Keeping up with maintenance extends vehicle lifespan and safety.
            </p>

            <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', marginTop: 'auto', alignItems: 'center', flexWrap: 'wrap', gap: '10px'}}>
              <div>
                <p style={{margin: '0 0 5px 0', color: mutedText, fontSize: '0.8rem'}}>Most Urgent</p>
                <h4 style={{margin: 0, fontSize: '0.95rem', color: mostUrgent.color}}>{mostUrgent.status}</h4>
              </div>
              <div>
                <p style={{margin: '0 0 5px 0', color: mutedText, fontSize: '0.8rem'}}>Provider</p>
                <h4 style={{margin: 0, fontSize: '0.95rem'}}>AutoCare AI</h4>
              </div>
              <div>
                <p style={{margin: '0 0 5px 0', color: mutedText, fontSize: '0.8rem'}}>Distance</p>
                <h4 style={{margin: 0, fontSize: '0.95rem'}}>{mostUrgent.text.replace('Due in ', '').replace('Due at ', '')}</h4>
              </div>
              <div style={{width: '100%', marginTop: '10px'}}>
                <Link to="/diy-guides" style={{display: 'block', textAlign: 'center', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem'}}>
                  🛠️ View Step-by-Step DIY Guide
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: SERVICE HISTORY & HEALTH INDICATORS */}
      <div style={{padding: '0 40px', display: 'flex', gap: '30px', flexWrap: 'wrap'}}>
        
        {/* Service History Table */}
        <div style={{flex: '1.5', minWidth: '400px', backgroundColor: cardBg, borderRadius: '16px', padding: '30px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px'}}>
            <h3 style={{margin: 0, fontSize: '1.2rem'}}>Service & Mod History</h3>
            <Link to="/bookings" style={{backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'none'}}>
              + Request Service
            </Link>
          </div>
          
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', color: mutedText}}>
            <thead>
              <tr style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                <th style={{textAlign: 'left', paddingBottom: '15px', fontWeight: 'normal'}}>Date</th>
                <th style={{textAlign: 'left', paddingBottom: '15px', fontWeight: 'normal'}}>Service Type</th>
                <th style={{textAlign: 'left', paddingBottom: '15px', fontWeight: 'normal'}}>Provider</th>
                <th style={{textAlign: 'right', paddingBottom: '15px', fontWeight: 'normal'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.filter(b => b.vehicle.id === v.id).length === 0 ? (
                <tr>
                  <td colSpan="4" style={{padding: '40px 0', textAlign: 'center'}}>No past service records found.</td>
                </tr>
              ) : (
                allBookings.filter(b => b.vehicle.id === v.id).map(b => (
                  <tr key={b.id} style={{borderBottom: '1px solid rgba(255,255,255,0.02)'}}>
                    <td style={{padding: '15px 0'}}>{b.bookingDate}</td>
                    <td style={{padding: '15px 0', color: '#fff'}}>{b.serviceType}</td>
                    <td style={{padding: '15px 0'}}>{b.mechanic ? b.mechanic.username : 'AutoCare Hub'}</td>
                    <td style={{padding: '15px 0', textAlign: 'right', color: b.status === 'COMPLETED' ? '#10b981' : '#f59e0b'}}>{b.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Health Indicators */}
        <div style={{flex: '1', minWidth: '300px', backgroundColor: cardBg, borderRadius: '16px', padding: '30px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h3 style={{margin: 0, fontSize: '1.2rem'}}>Component Health</h3>
            <Link to="/diy-guides" style={{fontSize: '0.8rem', color: '#60a5fa', textDecoration: 'none'}}>All Guides →</Link>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            
            {/* Health Box 1 */}
            <div style={{backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)'}}>
              <h4 style={{margin: '0 0 10px 0', fontSize: '0.9rem', color: mutedText, textAlign: 'center'}}>Engine Oil</h4>
              <div style={{width: '60px', height: '60px', borderRadius: '50%', border: `4px solid ${oilChange.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: '10px'}}>
                💧
              </div>
              <div style={{width: '100%', fontSize: '0.75rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                  <span style={{color: mutedText}}>Wear:</span>
                  <span style={{color: oilChange.color}}>{oilChange.percentage}%</span>
                </div>
              </div>
              <Link to="/diy-guides" style={{marginTop: '10px', fontSize: '0.75rem', color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold'}}>
                🛠️ DIY Guide →
              </Link>
            </div>

            {/* Health Box 2 */}
            <div style={{backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)'}}>
              <h4 style={{margin: '0 0 10px 0', fontSize: '0.9rem', color: mutedText, textAlign: 'center'}}>Brake Pads</h4>
              <div style={{width: '60px', height: '60px', borderRadius: '50%', border: `4px solid ${brakeInspection.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: '10px'}}>
                🛑
              </div>
              <div style={{width: '100%', fontSize: '0.75rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                  <span style={{color: mutedText}}>Pads wear:</span>
                  <span style={{color: brakeInspection.color}}>{brakeInspection.percentage}%</span>
                </div>
              </div>
              <Link to="/diy-guides" style={{marginTop: '10px', fontSize: '0.75rem', color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold'}}>
                🛠️ DIY Guide →
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
