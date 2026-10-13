import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VehicleService from "../services/vehicle.service";

// Static data for Indian Car Market
const indianCarsData = {
  "Maruti Suzuki": ["Swift", "Baleno", "Alto", "Wagon R", "Dzire", "Brezza", "Ertiga", "Grand Vitara", "Fronx", "Jimny"],
  "Tata": ["Nexon", "Punch", "Harrier", "Safari", "Tiago", "Altroz", "Tigor", "Curvv"],
  "Mahindra": ["Thar", "XUV700", "Scorpio-N", "Scorpio Classic", "Bolero", "XUV300", "XUV400 EV"],
  "Hyundai": ["Creta", "Venue", "i20", "Grand i10 Nios", "Verna", "Tucson", "Aura", "Exter"],
  "Kia": ["Seltos", "Sonet", "Carens", "EV6"],
  "Toyota": ["Innova Crysta", "Innova Hycross", "Fortuner", "Glanza", "Urban Cruiser Hyryder", "Camry"],
  "Honda": ["City", "Amaze", "Elevate"],
  "MG": ["Hector", "Astor", "Gloster", "Comet EV", "ZSEV"],
  "Skoda": ["Slavia", "Kushaq", "Kodiaq", "Superb"],
  "Volkswagen": ["Virtus", "Taigun", "Tiguan"],
  "Renault": ["Kwid", "Kiger", "Triber"],
  "Nissan": ["Magnite", "X-Trail"],
  "Jeep": ["Compass", "Meridian", "Wrangler"]
};

const findVehicleImage = async (make, model) => {
  try {
    const title = encodeURIComponent(`${make} ${model}`.replaceAll(" ", "_"));
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
    if (!response.ok) return "";
    const data = await response.json();
    return data.thumbnail?.source || "";
  } catch {
    return "";
  }
};

const AddVehicle = () => {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [mileage, setMileage] = useState("");
  const [color, setColor] = useState("");
  const [vin, setVin] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Load makes on component mount
  useEffect(() => {
    setMakes(Object.keys(indianCarsData).sort());
  }, []);

  // Update models when make changes
  useEffect(() => {
    if (make && indianCarsData[make]) {
      setModels(indianCarsData[make].sort());
    } else {
      setModels([]);
    }
  }, [make]);

  const [customEntry, setCustomEntry] = useState(false);
  const [customMake, setCustomMake] = useState("");
  const [customModel, setCustomModel] = useState("");

  const handleAddVehicle = (e) => {
    e.preventDefault();
    
    const finalMake = customEntry ? customMake.trim() : make;
    const finalModel = customEntry ? customModel.trim() : model;

    if (!finalMake || !finalModel) {
      setMessage("Please specify both car make and model.");
      return;
    }

    const parsedYear = parseInt(year) || new Date().getFullYear();
    const parsedMileage = parseInt(mileage) || 0;
    const saveVehicle = async () => {
      const selectedCarImage = imageUrl || await findVehicleImage(finalMake, finalModel);
      return VehicleService.addVehicle(finalMake, finalModel, parsedYear, licensePlate.trim(), parsedMileage, color.trim(), vin.trim(), selectedCarImage);
    };

    saveVehicle().then(
      () => {
        navigate("/dashboard");
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          setMessage("Your session has expired. Please log out and log in again from the top menu.");
        } else {
          const resMessage =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
          setMessage(resMessage);
        }
      }
    );
  };

  return (
    <div className="form-container">
      <h2>Add New Vehicle</h2>
      
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '15px'}}>
        <button 
          type="button" 
          onClick={() => setCustomEntry(!customEntry)}
          style={{
            background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer',
            fontSize: '0.85rem', textDecoration: 'underline', padding: 0, margin: 0, width: 'auto'
          }}
        >
          {customEntry ? "← Choose from popular brand list" : "+ Car not in list? Type manually"}
        </button>
      </div>

      <form onSubmit={handleAddVehicle}>
        
        {!customEntry ? (
          <>
            <div>
              <label>Car Make</label>
              <select required value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }}>
                <option value="">-- Select Brand --</option>
                {makes.map((m, idx) => (
                  <option key={idx} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label>Car Model</label>
              <select required value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
                <option value="">-- Select Model --</option>
                {models.map((m, idx) => (
                  <option key={idx} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <>
            <div>
              <label>Car Make / Brand</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Audi, BMW, Honda" 
                value={customMake} 
                onChange={(e) => setCustomMake(e.target.value)} 
              />
            </div>

            <div>
              <label>Car Model</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. A4, 3 Series, City" 
                value={customModel} 
                onChange={(e) => setCustomModel(e.target.value)} 
              />
            </div>
          </>
        )}

        <div>
          <label>Year</label>
          <input type="number" required min="1900" max={new Date().getFullYear() + 1} value={year} onChange={(e) => setYear(e.target.value)} />
        </div>

        <div>
          <label>Color</label>
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>

        <div>
          <label>Vehicle photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImageError("");
              if (!file) { setImageUrl(""); return; }
              if (file.size > 700 * 1024) {
                setImageError("Choose an image smaller than 700 KB.");
                e.target.value = "";
                setImageUrl("");
                return;
              }
              const reader = new FileReader();
              reader.onload = () => setImageUrl(typeof reader.result === "string" ? reader.result : "");
              reader.onerror = () => setImageError("This image could not be loaded. Please choose another.");
              reader.readAsDataURL(file);
            }}
          />
          <small style={{color: '#94a3b8', fontSize: '0.8rem'}}>Add a photo to see it in your garage. Maximum size: 700 KB.</small>
          {imageError && <p role="alert" style={{color: '#fca5a5', fontSize: '0.85rem'}}>{imageError}</p>}
          {imageUrl && <img src={imageUrl} alt="Vehicle preview" style={{display: 'block', width: '100%', maxHeight: '180px', objectFit: 'contain', marginTop: '10px', borderRadius: '8px'}} />}
        </div>

        <div>
          <label>VIN (Vehicle Identification Number)</label>
          <input type="text" maxLength="17" placeholder="17-character VIN" value={vin} onChange={(e) => setVin(e.target.value)} />
          <small style={{color: '#94a3b8', fontSize: '0.8rem'}}>The unique 17-character serial number found on the registration/dashboard.</small>
        </div>

        <div>
          <label>License Plate</label>
          <input type="text" required placeholder="e.g. MH 01 AB 1234" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} />
        </div>

        <div>
          <label>Current Mileage (KMs)</label>
          <input type="number" required min="0" value={mileage} onChange={(e) => setMileage(e.target.value)} />
        </div>

        <button type="submit">Save Vehicle</button>
      </form>
      
      {message && (
        <div className="alert alert-danger" role="alert" style={{marginTop: '15px'}}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AddVehicle;
