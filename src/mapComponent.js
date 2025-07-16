import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import geojson from "./data/telangana.json";

// Icons
const greenIcon = new L.Icon({ iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png", iconSize: [25, 41], iconAnchor: [12, 41] });
const yellowIcon = new L.Icon({ iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png", iconSize: [25, 41], iconAnchor: [12, 41] });
const redIcon = new L.Icon({ iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", iconSize: [25, 41], iconAnchor: [12, 41] });

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const getStatusIcon = (timestamp) => {
  const now = new Date();
  const last = new Date(timestamp);
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  if (diffDays <= 5) return greenIcon;
  if (diffDays <= 7) return yellowIcon;
  return redIcon;
};

export default function ManholeMap() {
  const [operationData, setOperationData] = useState([]);
  const [selectedOps, setSelectedOps] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchOps = async () => {
      try {
        const res = await axios.get("https://sewage-bot-poc.onrender.com/api/data");
        setOperationData(res.data);
      } catch (e) {
        console.error("Error loading operation data", e);
      }
    };
    fetchOps();
  }, []);

  const findMatchingOps = (lat, lon) => {
    return operationData.filter(op => {
      const [olat, olon] = op.location.split(",").map(coord => parseFloat(coord.trim()));
      return Math.abs(olat - lat) < 0.0005 && Math.abs(olon - lon) < 0.0005;
    });
  };

  const currentOp = selectedOps[selectedIndex];

  return (
    <>
      <MapContainer center={[17.403, 78.4746]} zoom={17} style={{ height: "350px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {geojson.features.map((feature, i) => {
          const [lon, lat] = feature.geometry.coordinates;
          const matches = findMatchingOps(lat, lon);
          const latest = matches.length
            ? matches.reduce((a, b) => new Date(a.timestamp) > new Date(b.timestamp) ? a : b)
            : null;

          return (
            <Marker
              key={i}
              position={[lat, lon]}
              icon={latest ? getStatusIcon(latest.timestamp) : redIcon}
              eventHandlers={{
                click: () => {
                  setSelectedOps(matches);
                  setSelectedLocation({ lat, lon });
                  setSelectedIndex(0);
                }
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                {latest ? `Last Cleaned: ${formatDate(latest.timestamp)}` : `No Data Found`}
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      {selectedLocation && (
        <div style={modalStyles}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#0074cc" }}>
            <h2>Manhole @ {selectedLocation.lat.toFixed(5)}, {selectedLocation.lon.toFixed(5)}</h2>
            <button onClick={() => setSelectedLocation(null)} style={closeBtn}>❌</button>
          </div>

          {selectedOps.length > 0 ? (
            <>
              <div style={{ display: "flex", height: "100%", gap: "20px" }}>
                {/* Left Side */}
                <div style={{ flex: 2, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3>Selected Operation Details</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ccc" }}>
                      <thead>
                        <tr>
                          <th style={cellHeader}>Field</th>
                          <th style={cellHeader}>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td style={cellStyle}>Date</td><td style={cellStyle}>{formatDate(currentOp.timestamp)}</td></tr>
                        <tr><td style={cellStyle}>Device</td><td style={cellStyle}>{currentOp.device_id}</td></tr>
                        <tr><td style={cellStyle}>Gas Toxicity</td><td style={cellStyle}>{currentOp.gas_level}</td></tr>
                        <tr><td style={cellStyle}>Waste Collected</td><td style={cellStyle}>0 Kg</td></tr>
                        <tr><td style={cellStyle}>Time Worked</td><td style={cellStyle}>0 min</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-around", marginTop: "10px", marginBottom: "10px" }}>
                    <div>
                      <img src={`https://sewage-bot-poc.onrender.com/${currentOp.before_path}`} alt="before" width="150" />
                      <p style={{ textAlign: "center" }}>Before</p>
                    </div>
                    <div>
                      <img src={`https://sewage-bot-poc.onrender.com/${currentOp.after_path}`} alt="after" width="150" />
                      <p style={{ textAlign: "center" }}>After</p>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ color: "#0074cc" }}>
                    <p><b>Total Waste Collected:</b> {selectedOps.reduce((sum, op) => sum + op.wasteCollectedKg, 0).toFixed(1)} Kg</p>
                    <p><b>No. of Times Operated:</b> {selectedOps.length}</p>
                  </div>

                  <div style={operationList}>
                    <h4>Operation History</h4>
                    {selectedOps.map((op, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          padding: "10px",
                          marginBottom: "8px",
                          background: selectedIndex === idx ? "#e0f7ff" : "#fff"
                        }}
                      >
                        <p><b>{formatDate(op.timestamp)}</b></p>
                        <button onClick={() => setSelectedIndex(idx)} style={viewMoreBtn}>View More</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>No operation data found for this location.</p>
          )}
        </div>
      )}
    </>
  );
}

// Styles
const cellStyle = {
  border: "1px solid #ddd",
  padding: "6px 12px",
  textAlign: "left",
  fontSize: "14px"
};

const cellHeader = {
  ...cellStyle,
  backgroundColor: "#f2f2f2",
  fontWeight: "bold"
};

const modalStyles = {
  position: "fixed",
  top: "10%",
  left: "10%",
  width: "80%",
  height: "70%",
  background: "#fff",
  padding: "20px",
  zIndex: 1000,
  borderRadius: "15px",
  boxShadow: "0 0 20px rgba(0,0,0,0.3)",
  overflowY: "auto"
};

const closeBtn = {
  background: "crimson",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "5px 10px",
  cursor: "pointer"
};

const viewMoreBtn = {
  padding: "5px 10px",
  background: "#007BFF",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const operationList = {
  overflowY: "auto",
  maxHeight: "calc(100% - 100px)",
  borderTop: "1px solid #ccc",
  paddingTop: "10px",
  paddingRight: "10px"
};
