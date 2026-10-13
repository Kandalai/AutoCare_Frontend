import React, { useState, useEffect } from "react";
import BookingService from "../services/booking.service";
import VehicleService from "../services/vehicle.service";
import AuthService from "../services/auth.service";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [myVehicles, setMyVehicles] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  
  // Form State
  const [vehicleId, setVehicleId] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [mechanicId, setMechanicId] = useState("");
  const [message, setMessage] = useState("");

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      fetchBookings();
      if (currentUser.role === 'ROLE_CUSTOMER') {
        VehicleService.getVehicles().then((res) => setMyVehicles(res.data));
        BookingService.getMechanics().then((res) => setMechanics(res.data));
      }
    }
  }, []);

  const fetchBookings = () => {
    if (!currentUser) return;
    if (currentUser.role === 'ROLE_CUSTOMER') {
      BookingService.getMyBookings().then((res) => setBookings(res.data));
    } else if (currentUser.role === 'ROLE_MECHANIC' || currentUser.role === 'ROLE_ADMIN') {
      BookingService.getMyBookings().then((res) => setBookings(res.data));
      BookingService.getAllBookings().then((res) => setAllBookings(res.data));
    }
  };

  const handleCreateBooking = (e) => {
    e.preventDefault();
    const finalMechanicId = mechanicId === "" ? null : mechanicId;
    BookingService.createBooking(vehicleId, serviceType, bookingDate, finalMechanicId).then(
      (res) => {
        setMessage(res.data.message);
        setVehicleId("");
        setServiceType("");
        setBookingDate("");
        setMechanicId("");
        fetchBookings(); // refresh list
      },
      (error) => {
        setMessage(error.response?.data?.message || "Failed to book service");
      }
    );
  };

  const handleAccept = (id) => {
    BookingService.acceptBooking(id).then(() => fetchBookings());
  };

  const handleStatusChange = (id, status) => {
    BookingService.updateStatus(id, status).then(() => fetchBookings());
  };

  if (!currentUser) return <div>Please login.</div>;

  return (
    <div className="container">
      <h2 style={{marginBottom: '30px'}}>Service Bookings</h2>
      
      {currentUser.role === 'ROLE_CUSTOMER' && (
        <div style={{display: 'flex', gap: '30px', flexWrap: 'wrap'}}>
          
          {/* Create Booking Form */}
          <div className="form-container" style={{flex: '1', minWidth: '300px', margin: 0}}>
            <h3>Request a Service</h3>
            <form onSubmit={handleCreateBooking}>
              <div>
                <label>Select Vehicle</label>
                <select required value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
                  <option value="">-- Choose your car --</option>
                  {myVehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label>Service Required</label>
                <select required value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                  <option value="">-- Choose Service --</option>
                  <option value="General Service & Oil Change">General Service & Oil Change</option>
                  <option value="Brake Inspection & Repair">Brake Inspection & Repair</option>
                  <option value="Engine Diagnostics">Engine Diagnostics</option>
                  <option value="Tyre Rotation & Alignment">Tyre Rotation & Alignment</option>
                  <option value="Washing & Detailing">Washing & Detailing</option>
                  <option value="Other / Unsure (Check Notes)">Other / Unsure</option>
                </select>
              </div>

              <div>
                <label>Preferred Date</label>
                <input type="date" required value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
              </div>

              <div>
                <label>Select Mechanic (Optional)</label>
                <select value={mechanicId} onChange={(e) => setMechanicId(e.target.value)}>
                  <option value="">-- Let AutoCare AI Auto-Assign --</option>
                  {mechanics.map(m => (
                    <option key={m.id} value={m.id}>{m.username} (Certified Mechanic)</option>
                  ))}
                </select>
              </div>

              <button type="submit">Book Now</button>
              {message && <div style={{marginTop: '15px', color: '#16a34a', fontWeight: 'bold'}}>{message}</div>}
            </form>
          </div>

          {/* List of Bookings */}
          <div style={{flex: '2', minWidth: '400px'}}>
            <h3>My Booking History</h3>
            {(!bookings || bookings.length === 0) ? (
              <div style={{padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px'}}>You have no service bookings yet.</div>
            ) : (
              bookings.map(b => (
                <div key={b.id} className="vehicle-card" style={{marginBottom: '15px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px', marginBottom: '10px'}}>
                    <h4 style={{margin: 0}}>{b.serviceType}</h4>
                    <span style={{
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      backgroundColor: b.status === 'PENDING' ? '#fef3c7' : b.status === 'IN_PROGRESS' ? '#dbeafe' : '#d1fae5',
                      color: b.status === 'PENDING' ? '#d97706' : b.status === 'IN_PROGRESS' ? '#2563eb' : '#059669'
                    }}>
                      {b.status}
                    </span>
                  </div>
                  <p><strong>Vehicle:</strong> {b.vehicle.make} {b.vehicle.model}</p>
                  <p><strong>Date:</strong> {b.bookingDate}</p>
                  <p><strong>Mechanic:</strong> {b.mechanic ? b.mechanic.username : <span style={{color: '#9ca3af', fontStyle: 'italic'}}>Waiting for assignment...</span>}</p>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* MECHANIC VIEW */}
      {(currentUser.role === 'ROLE_MECHANIC' || currentUser.role === 'ROLE_ADMIN') && (
        <div style={{display: 'flex', gap: '30px', flexWrap: 'wrap'}}>
          
          <div style={{flex: '1', minWidth: '350px'}}>
            <h3>Available Jobs (Pending)</h3>
            {(!allBookings || allBookings.filter(b => b.status === 'PENDING').length === 0) && <p>No pending jobs right now.</p>}
            {(allBookings || []).filter(b => b.status === 'PENDING').map(b => (
              <div key={b.id} className="vehicle-card" style={{marginBottom: '15px'}}>
                <h4 style={{color: '#d97706', marginTop: 0}}>{b.serviceType}</h4>
                <p><strong>Customer:</strong> {b.customer.username}</p>
                <p><strong>Vehicle:</strong> {b.vehicle.make} {b.vehicle.model} ({b.vehicle.year})</p>
                <p><strong>Date requested:</strong> {b.bookingDate}</p>
                <button className="btn-primary" style={{marginTop: '10px', width: '100%'}} onClick={() => handleAccept(b.id)}>Accept Job</button>
              </div>
            ))}
          </div>

          <div style={{flex: '1', minWidth: '350px'}}>
            <h3>My Assigned Jobs</h3>
            {(!bookings || bookings.length === 0) && <p>You haven't accepted any jobs yet.</p>}
            {(bookings || []).map(b => (
              <div key={b.id} className="vehicle-card" style={{marginBottom: '15px', borderLeft: '4px solid #2563eb'}}>
                <h4 style={{marginTop: 0, color: '#2563eb'}}>{b.serviceType}</h4>
                <p><strong>Customer:</strong> {b.customer.username}</p>
                <p><strong>Vehicle:</strong> {b.vehicle.make} {b.vehicle.model} ({b.vehicle.licensePlate})</p>
                
                <div style={{marginTop: '15px'}}>
                  <label style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Update Job Status:</label>
                  <select 
                    value={b.status} 
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    style={{width: '100%', marginTop: '5px', padding: '8px'}}
                  >
                    <option value="ACCEPTED">Accepted</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
