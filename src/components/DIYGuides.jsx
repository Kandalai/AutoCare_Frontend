import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const guidesData = [
  {
    id: "air-filter",
    title: "Engine Air Filter Replacement",
    category: "Filters & Intake",
    difficulty: "Beginner",
    difficultyColor: "#10b981",
    time: "10 mins",
    savings: "₹450 - ₹700",
    tools: ["None / Flathead Screwdriver (some cars)"],
    safety: "Ensure engine is switched off and cool before unlatching the airbox.",
    description: "A clogged air filter starves your engine of oxygen, hurting fuel economy and horsepower. Replacing it takes under 10 minutes and requires zero mechanical experience.",
    steps: [
      "Open your vehicle's hood and locate the black plastic air filter box (usually near the front or side of the engine).",
      "Unclip the 3-4 metal or plastic retaining latches around the perimeter of the airbox lid.",
      "Lift the airbox cover slightly to expose the old pleated air filter.",
      "Pull the old filter out and check the bottom of the airbox for leaves or debris. Wipe clean with a dry cloth.",
      "Drop the new filter in, ensuring the rubber sealing gasket seats flush and points in the same airflow direction.",
      "Lower the lid back on and firmly snap all retaining clips shut. You are done!"
    ]
  },
  {
    id: "cabin-filter",
    title: "Cabin AC Air Filter Replacement",
    category: "Filters & Intake",
    difficulty: "Beginner",
    difficultyColor: "#10b981",
    time: "15 mins",
    savings: "₹500 - ₹850",
    tools: ["Hands / Small Flathead Screwdriver"],
    safety: "No major safety risks. Wear a dust mask if you have allergies when removing old dusty filters.",
    description: "Cleans the air inside your car's AC. If your AC smells musty or airflow is weak, your cabin filter is clogged. Service centers often charge ₹800+ for a 5-minute job you can do yourself behind the glovebox.",
    steps: [
      "Open your passenger-side glove compartment and empty its contents.",
      "Press the two inward release tabs on the sides of the glovebox (or unscrew the damper arm on the right side) to let it drop down.",
      "Behind the lowered glovebox, find the horizontal cabin filter cover latch.",
      "Pinch the side clips to remove the faceplate and slide out the old filter tray.",
      "Note the airflow arrow marked on the old filter (typically pointing downwards towards the blower motor).",
      "Insert the new filter with the arrow matching the correct airflow direction, snap the faceplate closed, and pop the glovebox back into position."
    ]
  },
  {
    id: "battery-service",
    title: "Battery Terminal Cleaning & Replacement",
    category: "Electrical",
    difficulty: "Beginner",
    difficultyColor: "#10b981",
    time: "20 mins",
    savings: "₹600 - ₹1,200",
    tools: ["10mm Wrench", "Wire Brush", "Baking Soda + Water Solution", "Gloves"],
    safety: "⚠️ CRITICAL: ALWAYS disconnect the Negative (-) terminal first, and reconnect it LAST to prevent short circuits and electrical sparks.",
    description: "Corrosion (white/blue powdery buildup) prevents your starter motor from receiving full voltage. Cleaning or replacing your battery yourself saves high technician labor rates.",
    steps: [
      "Turn off ignition, remove keys from car, and put on safety glasses and rubber gloves.",
      "Loosen the nut on the NEGATIVE (-) black terminal cable clamp using a 10mm wrench. Gently wiggle and remove the clamp, tucking it away from the post.",
      "Loosen and remove the POSITIVE (+) red terminal cable clamp.",
      "If cleaning: scrub the terminals and cable ends with a wire brush dipped in baking soda solution to neutralize acid. Wipe dry with paper towels.",
      "If replacing: unbolt the battery tie-down bracket, lift the heavy battery straight up, and drop the new battery in.",
      "Apply a thin layer of petroleum jelly or dielectric grease to prevent future corrosion.",
      "Reattach POSITIVE (+) terminal first and tighten clamp securely. Reattach NEGATIVE (-) terminal last and verify tight fit."
    ]
  },
  {
    id: "oil-change",
    title: "DIY Engine Oil & Oil Filter Change",
    category: "Fluids & Engine",
    difficulty: "Intermediate",
    difficultyColor: "#f59e0b",
    time: "45 mins",
    savings: "₹1,200 - ₹2,000",
    tools: ["Jack & Jack Stands", "Oil Drain Pan", "Socket Set (14mm/17mm)", "Oil Filter Wrench", "Funnel"],
    safety: "⚠️ NEVER get under a car supported only by a hydraulic jack! Always use certified jack stands on level ground with wheel chocks.",
    description: "The quintessential DIY car enthusiast ritual! Fresh synthetic oil and a new OEM filter keep your engine running smoothly for hundreds of thousands of kilometers.",
    steps: [
      "Run the engine for 3-5 minutes so oil warms up slightly (makes draining faster), then shut off and engage handbrake firmly.",
      "Safely elevate the front of the vehicle using a jack and lock it onto solid jack stands.",
      "Slide the drain pan underneath the oil pan drain plug. Use the appropriate socket wrench to loosen the drain bolt counter-clockwise.",
      "Carefully remove the plug by hand (watch out for warm oil) and allow the old dark oil to drain completely for 10-15 minutes.",
      "Replace the copper/aluminum crush washer on the drain plug, thread it in by hand, and torque it snugly (approx 30-35 Nm).",
      "Position the pan under the oil filter. Unscrew old filter with filter wrench. Lubricate the rubber gasket of the NEW filter with clean oil.",
      "Spin new filter on by hand until the gasket contacts the housing, then tighten an additional 3/4 turn (never overtighten with a wrench!).",
      "Lower the car, open the engine oil cap, and pour the manufacturer-specified quantity and viscosity (e.g., 5W-30 synthetic) using a clean funnel.",
      "Check dipstick level, start engine for 30 seconds to pressurize filter, shut off, and recheck dipstick. Verify zero leaks under vehicle!"
    ]
  },
  {
    id: "coolant-flush",
    title: "Coolant / Radiator Inspection & Top-Up",
    category: "Fluids & Engine",
    difficulty: "Beginner",
    difficultyColor: "#10b981",
    time: "15 mins",
    savings: "₹400 - ₹800",
    tools: ["Funnel", "Pre-mixed 50/50 OAT Coolant", "Flashlight"],
    safety: "⚠️ NEVER EVER open a radiator cap or expansion tank while the engine is hot! Superheated coolant under pressure can cause severe burns.",
    description: "Prevents overheating during Indian summer traffic and prevents internal radiator corrosion. Checking and maintaining the coolant expansion tank is simple and essential.",
    steps: [
      "Park vehicle on flat ground and let engine cool completely for at least 45 minutes.",
      "Locate the translucent plastic coolant expansion tank with MIN and MAX indicator lines.",
      "Inspect the fluid level: it should sit comfortably between the MIN and MAX markers.",
      "If low, unscrew the expansion tank pressure cap slowly with a towel over the cap.",
      "Use a funnel to pour recommended manufacturer-spec coolant (usually pink/red OAT or green ethylene glycol—never mix incompatible coolants!).",
      "Stop pouring right at the MAX line (coolant needs thermal expansion room). Tighten the cap until it clicks shut."
    ]
  },
  {
    id: "spark-plugs",
    title: "Spark Plug Inspection & Replacement",
    category: "Ignition & Electrical",
    difficulty: "Intermediate",
    difficultyColor: "#f59e0b",
    time: "40 mins",
    savings: "₹1,000 - ₹1,800",
    tools: ["Spark Plug Socket (5/8\" or 14mm with rubber boot)", "Ratchet + Extension Bar", "Torque Wrench", "Gap Gauge"],
    safety: "Work on a completely cold engine to prevent stripping delicate aluminum cylinder head threads.",
    description: "Worn spark plugs cause engine misfires, rough idle, and sluggish acceleration. Modern iridium plugs last 80,000 km, and swapping them gives immediate throttle responsiveness.",
    steps: [
      "Disconnect the negative battery terminal and remove any plastic engine decorative cover.",
      "Unplug the electrical harness connector from the individual ignition coil atop cylinder #1.",
      "Remove the 10mm bolt securing the ignition coil and pull the coil boot straight up and out.",
      "Lower your spark plug socket with extension into the cylinder spark plug well. Turn counter-clockwise to break the plug loose.",
      "Inspect the old plug tip: light tan/grey is healthy; heavy black soot indicates rich fuel; oily buildup indicates valve seal wear.",
      "Check gap on new spark plug per manual spec. Thread new plug in gently BY HAND using the socket extension to prevent cross-threading.",
      "Torque to manufacturer spec (typically 18-22 Nm). Reinsert ignition coil boot, secure bolt, reconnect harness, and repeat for remaining cylinders."
    ]
  },
  {
    id: "brake-inspection",
    title: "Brake Pad Wear Inspection & Measurement",
    category: "Brakes & Suspension",
    difficulty: "Intermediate",
    difficultyColor: "#f59e0b",
    time: "30 mins",
    savings: "₹800 - ₹1,500",
    tools: ["Lug Wrench", "Jack & Jack Stands", "Brake Lining Gauge or Vernier Caliper"],
    safety: "⚠️ Jack stands mandatory. Never breathe in brake dust—use dedicated brake parts cleaner spray, never compressed air.",
    description: "Brake pads are your car's most vital safety feature. Learn how to inspect remaining pad friction thickness through the caliper inspection window to know when replacement is actually needed.",
    steps: [
      "Loosen wheel lug nuts 1/2 turn while the car is on the ground, then raise car and secure on jack stands.",
      "Remove lug nuts and take off the front wheel to access the brake disc and caliper assembly.",
      "Look through the caliper inspection hole or view from the side to see the friction material pressed against the brake rotor.",
      "Measure the friction pad thickness: New pads have ~10mm-12mm. Safe range is 4mm-10mm. If less than 3mm, replacement is urgent!",
      "Inspect the rotor face for deep circular grooves, lips on outer edge, or blue discoloration from overheating.",
      "Reinstall wheel, hand-tighten lugs in a star pattern, lower vehicle to ground, and torque lug nuts to spec (usually 100-110 Nm)."
    ]
  }
];

const DIYGuides = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeGuide, setActiveGuide] = useState(guidesData[0]);
  const [completedSteps, setCompletedSteps] = useState({});
  const navigate = useNavigate();

  const categories = ["All", "Filters & Intake", "Fluids & Engine", "Electrical", "Brakes & Suspension"];

  const filteredGuides = selectedCategory === "All" 
    ? guidesData 
    : guidesData.filter(g => g.category === selectedCategory);

  const toggleStep = (guideId, stepIndex) => {
    const key = `${guideId}-${stepIndex}`;
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAskAIAboutGuide = (guide) => {
    navigate("/ai-assistant", { 
      state: { prefillQuery: `Can you walk me through replacing my ${guide.title.toLowerCase()} step-by-step? What tools and safety precautions do I need for my car?` } 
    });
  };

  const darkBg = "#0b1120";
  const cardBg = "#151e32";
  const textColor = "#f8fafc";
  const mutedText = "#94a3b8";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: darkBg, color: textColor, fontFamily: "Inter, system-ui, sans-serif", padding: "30px 40px" }}>
      
      {/* Top Header Banner */}
      <div style={{ marginBottom: "30px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <div style={{ display: "inline-block", backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "10px" }}>
            🛠️ AutoCare Enthusiast Workshop
          </div>
          <h1 style={{ fontSize: "2.2rem", margin: 0, fontWeight: "800" }}>DIY Maintenance & Repair Guides</h1>
          <p style={{ color: mutedText, marginTop: "8px", maxWidth: "650px", fontSize: "0.95rem" }}>
            Master your machine. Learn how to perform essential maintenance yourself in your garage, understand component wear, and save thousands of rupees in labor fees.
          </p>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <button 
            onClick={() => handleAskAIAboutGuide(activeGuide)}
            style={{ backgroundColor: "#2563eb", color: "#fff", padding: "12px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <span>🤖</span> Ask AI Diagnostic Helper
          </button>
          <Link 
            to="/bookings" 
            style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#fff", padding: "12px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "0.9rem", display: "flex", alignItems: "center" }}
          >
            Too complex? Book Pro Mechanic
          </Link>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", overflowX: "auto", paddingBottom: "10px" }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 18px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.85rem",
              backgroundColor: selectedCategory === cat ? "#3b82f6" : "rgba(255,255,255,0.05)",
              color: selectedCategory === cat ? "#fff" : mutedText,
              transition: "all 0.2s"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Two-Column Workshop Layout */}
      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        
        {/* Left Column: Guides List */}
        <div style={{ flex: "1", minWidth: "320px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <h3 style={{ fontSize: "1.1rem", margin: "0 0 10px 0", color: mutedText }}>Select a Repair Guide ({filteredGuides.length})</h3>
          
          {filteredGuides.map(guide => {
            const isSelected = activeGuide.id === guide.id;
            return (
              <div
                key={guide.id}
                onClick={() => setActiveGuide(guide)}
                style={{
                  backgroundColor: isSelected ? "rgba(59, 130, 246, 0.12)" : cardBg,
                  border: isSelected ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "14px",
                  padding: "18px 20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: mutedText, textTransform: "uppercase", letterSpacing: "0.5px" }}>{guide.category}</span>
                  <span style={{ backgroundColor: "rgba(255,255,255,0.06)", color: guide.difficultyColor, padding: "3px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold" }}>
                    {guide.difficulty}
                  </span>
                </div>
                
                <h4 style={{ margin: 0, fontSize: "1.1rem", color: isSelected ? "#60a5fa" : textColor }}>{guide.title}</h4>
                
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: mutedText, marginTop: "5px" }}>
                  <span>⏱️ {guide.time}</span>
                  <span style={{ color: "#10b981", fontWeight: "600" }}>💰 Save {guide.savings}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Interactive Guide Inspection Card */}
        <div style={{ flex: "2", minWidth: "480px", backgroundColor: cardBg, borderRadius: "20px", padding: "35px", border: "1px solid rgba(255,255,255,0.05)" }}>
          
          {/* Guide Title & Quick Badges */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "25px", marginBottom: "25px" }}>
            <div>
              <span style={{ color: "#60a5fa", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase" }}>{activeGuide.category}</span>
              <h2 style={{ fontSize: "1.8rem", margin: "5px 0 10px 0" }}>{activeGuide.title}</h2>
              <p style={{ color: mutedText, margin: 0, fontSize: "0.95rem", lineHeight: "1.6", maxWidth: "700px" }}>
                {activeGuide.description}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ backgroundColor: "rgba(255,255,255,0.04)", padding: "10px 16px", borderRadius: "10px", textAlign: "center" }}>
                <span style={{ fontSize: "0.75rem", color: mutedText, display: "block" }}>DIFFICULTY</span>
                <strong style={{ color: activeGuide.difficultyColor, fontSize: "0.95rem" }}>{activeGuide.difficulty}</strong>
              </div>
              <div style={{ backgroundColor: "rgba(255,255,255,0.04)", padding: "10px 16px", borderRadius: "10px", textAlign: "center" }}>
                <span style={{ fontSize: "0.75rem", color: mutedText, display: "block" }}>TIME</span>
                <strong style={{ color: textColor, fontSize: "0.95rem" }}>{activeGuide.time}</strong>
              </div>
              <div style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "10px 16px", borderRadius: "10px", textAlign: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "#10b981", display: "block" }}>DIY SAVINGS</span>
                <strong style={{ color: "#10b981", fontSize: "0.95rem" }}>{activeGuide.savings}</strong>
              </div>
            </div>
          </div>

          {/* Tools Required Section */}
          <div style={{ marginBottom: "25px", backgroundColor: "rgba(255,255,255,0.02)", padding: "18px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.04)" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "0.95rem", color: "#cbd5e1" }}>🧰 Tools & Supplies Needed:</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {activeGuide.tools.map((tool, idx) => (
                <span key={idx} style={{ backgroundColor: "rgba(255,255,255,0.06)", padding: "5px 12px", borderRadius: "8px", fontSize: "0.85rem", color: "#e2e8f0" }}>
                  ✓ {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Critical Safety Notice */}
          <div style={{ marginBottom: "30px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)", padding: "16px 20px", borderRadius: "12px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.3rem" }}>⚠️</span>
            <div>
              <strong style={{ color: "#f87171", fontSize: "0.9rem", display: "block", marginBottom: "4px" }}>SAFETY FIRST</strong>
              <p style={{ margin: 0, color: "#fca5a5", fontSize: "0.85rem", lineHeight: "1.5" }}>
                {activeGuide.safety}
              </p>
            </div>
          </div>

          {/* Step-by-Step Interactive Checklist */}
          <div>
            <h3 style={{ fontSize: "1.2rem", margin: "0 0 15px 0" }}>Step-by-Step Procedure</h3>
            <p style={{ color: mutedText, fontSize: "0.85rem", marginBottom: "20px" }}>
              Check off each milestone as you complete it on your car:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {activeGuide.steps.map((step, idx) => {
                const stepKey = `${activeGuide.id}-${idx}`;
                const isChecked = !!completedSteps[stepKey];
                return (
                  <div 
                    key={idx}
                    onClick={() => toggleStep(activeGuide.id, idx)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "15px",
                      padding: "16px 18px",
                      borderRadius: "12px",
                      backgroundColor: isChecked ? "rgba(16, 185, 129, 0.08)" : "rgba(255,255,255,0.03)",
                      border: isChecked ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{
                      width: "24px", height: "24px", borderRadius: "6px",
                      border: isChecked ? "none" : "2px solid rgba(255,255,255,0.2)",
                      backgroundColor: isChecked ? "#10b981" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: "bold", fontSize: "0.85rem", flexShrink: 0, marginTop: "2px"
                    }}>
                      {isChecked ? "✓" : idx + 1}
                    </div>

                    <p style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      color: isChecked ? "#94a3b8" : textColor,
                      textDecoration: isChecked ? "line-through" : "none"
                    }}>
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Call to Action */}
          <div style={{ marginTop: "35px", paddingTop: "25px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
            <span style={{ color: mutedText, fontSize: "0.85rem" }}>
              Completed {Object.keys(completedSteps).filter(k => k.startsWith(activeGuide.id) && completedSteps[k]).length} of {activeGuide.steps.length} steps
            </span>

            <button
              onClick={() => handleAskAIAboutGuide(activeGuide)}
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                color: "#60a5fa",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.85rem"
              }}
            >
              💬 Stuck? Ask AI Advisor about {activeGuide.title}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DIYGuides;
