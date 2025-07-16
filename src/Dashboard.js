import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Dashboard() {
  const { DevName, district } = useParams();
  const { state } = useLocation();
  const [deviceOps, setDeviceOps] = useState([]);
  const [loading, setLoading] = useState(true);
  const sortedOps = [...deviceOps].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const [selectedOperationIndex, setSelectedOperationIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);


  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const res = await axios.get(`https://sewage-bot-poc.onrender.com/api/data?district=${district}`);
        const allOps = res.data || [];
        const filtered = allOps.filter(op => op.device_id === DevName);
        setDeviceOps(filtered);
      } catch (err) {
        console.error("Error fetching device operations:", err);
      } finally {
        setLoading(false);
      }
    };
     fetchDeviceData();
  }, [DevName, district]);
  
  if (loading) return <div>Loading...</div>;
  if (!deviceOps.length) return <div>No operations found for {DevName} in {district}</div>;

  const selectedOp = sortedOps[selectedOperationIndex];
  const [lat, lng] = selectedOp.location.split(',').map(Number);
  const formattedDate = new Date(selectedOp.timestamp).toLocaleDateString('en-GB');
  const formattedTime = new Date(selectedOp.timestamp).toLocaleTimeString();
  const totalWaste = deviceOps.reduce((sum, op) => sum + (op.waste_collected || 0), 0);

  const styles = {
    container: { padding: '4rem', fontFamily: 'Arial' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' },
    titleBlock: { display: 'flex', flexDirection: 'column', fontSize: '1.4rem', fontWeight: 'bold', color: '#0074cc' },
    metrics: { textAlign: 'right', fontSize: '1rem', color: '#333' },
    sectionRow: { display: 'flex', justifyContent: 'space-between', gap: '2rem' },
    leftSection: { flex: 2 },
    rightSection: { flex: 1, position: 'relative' },
    table: { width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' },
    thtd: { border: '1px solid #aaa', padding: '8px' },
    imgRow: { display: 'flex', justifyContent: 'space-evenly', marginBottom: '1rem' },
    imgBox: { textAlign: 'center' },
    image: { width: '150px', height: '100px', borderRadius: '8px', border: '1px solid #ccc', objectFit: 'cover' },
    mapWrapper: {
      position: 'relative',
      height: isFullscreen ? '70vh' : '200px',
      width: '100%',
      marginBottom: '1rem',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 0 8px rgba(0,0,0,0.1)',
      zIndex: 1,
    },
    fullscreenBtn: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      zIndex: 999,
      padding: '4px 10px',
      fontSize: '0.8rem',
      background: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    historyBox: {
      border: '1px solid #aaa',
      borderRadius: '6px',
      padding: '10px',
      maxHeight: '250px',
      overflowY: 'auto',
    },
    historyItem: {
      padding: '8px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    viewBtn: {
      background: '#007bff',
      color: 'white',
      border: 'none',
      padding: '5px 8px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });


  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleBlock}>
          <div>District: {decodeURIComponent(district)}</div>
          <div>Device: {DevName}</div>
        </div>
        <div style={styles.metrics}>
          <div><b>Waste Collected:</b> {totalWaste} kg</div>
          <div><b>No. of Operations:</b> {deviceOps.length}</div>
        </div>
      </div>

      <div style={styles.sectionRow}>
        {/* Left */}
        <div style={styles.leftSection}>
          <h3>Selected Operation Details</h3>
          <table style={styles.table}>
            <tbody>
              <tr><td style={styles.thtd}><b>Date</b></td><td style={styles.thtd}>{formattedDate}</td></tr>
              <tr><td style={styles.thtd}><b>Time</b></td><td style={styles.thtd}>{formattedTime}</td></tr>
              <tr><td style={styles.thtd}><b>Device</b></td><td style={styles.thtd}>{selectedOp.device_id}</td></tr>
              <tr><td style={styles.thtd}><b>Gas Level</b></td><td style={styles.thtd}>{selectedOp.gas_level}</td></tr>
              <tr><td style={styles.thtd}><b>Location</b></td><td style={styles.thtd}>{lat}, {lng}</td></tr>
            </tbody>
          </table>

          <div style={styles.imgRow}>
            <div style={styles.imgBox}><img src={selectedOp.before_path} alt="Before" style={styles.image} /><div>Before</div></div>
            <div style={styles.imgBox}><img src={selectedOp.after_path} alt="After" style={styles.image} /><div>After</div></div>
          </div>
        </div>

        {/* Right */}
        <div style={styles.rightSection}>
          {/* Map */}
          <div style={styles.mapWrapper}>
            <button style={styles.fullscreenBtn} onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
            <MapContainer center={[lat, lng]} zoom={17} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[lat, lng]} icon={markerIcon}>
                <Popup>
                  {DevName}<br />{formattedDate} {formattedTime}
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* Operation History */}
          <h4>Operation History</h4>
          <div style={styles.historyBox}>
            {sortedOps.map((op, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.historyItem,
                  backgroundColor: selectedOperationIndex === idx ? '#e0f7ff' : '#fff',
                }}
              >
                <span>{new Date(op.timestamp).toLocaleString()}</span>
                <button
                  style={{
                    ...styles.viewBtn,
                    backgroundColor: selectedOperationIndex === idx ? '#e0f7ff' : '#007bff',
                  }}
                  onClick={() => setSelectedOperationIndex(idx)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
