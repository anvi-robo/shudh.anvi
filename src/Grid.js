// Grid.js
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import sweage from './images/icon.png';

export default function Grid() {
  const { district } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { devices = [], operations = [] } = state || {};
  const [sortOption, setSortOption] = useState('all');

  const sorted = devices.filter(
    (id) => sortOption === 'all' || operations.some(op => op.device_id === id && (sortOption === 'active'))
  );

  const handleClick = (deviceId) => {
    const deviceOps = operations.filter(op => op.device_id === deviceId);
    navigate(`/dashboard/${deviceId}/${district}`, {
      state: { deviceOps }
    });
  };

  const styles = {
    container: {
      padding: '2rem',
      backgroundColor: '#f4f6f8',
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      gap: '1rem',
    },
    districtName: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#333',
    },
    metrics: {
      fontSize: '1.5rem',
      fontWeight: '500',
      color: '#333',
      textAlign: 'right',
    },
    sortSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    select: {
      padding: '0.5rem 1rem',
      fontSize: '1rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      justifyItems: 'center',
    },
    card: {
      width: '350px',
      height: '220px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      textAlign: 'center',
      cursor: 'pointer',
      overflow: 'hidden',
      padding: 0, 
      display: 'flex',
      flexDirection: 'column',
    },

    image: {
      width: '90%',
      height: '200px',
      objectFit: 'cover',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      display: 'block', 
    },

    cont:{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding:'4px',
    },

    label: {
      
      fontWeight: 'bold',
    },
    activeTag: {
      color: 'green',
      fontSize: '0.8rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.districtName}>{district}</div>
        <div style={styles.sortSection}>
          <label>Sort:</label>
          <select style={styles.select} value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="active">Sort by Active</option>
            <option value="inactive">Sort by Inactive</option>
            <option value="all">Show All</option>
          </select>
        </div>
        <div style={styles.metrics}>
          Bots Deployed: {devices.length} <br />
          Waste Collected: {operations.reduce((a, b) => a + (b.waste_collected || 0), 0)} KG
        </div>
      </div>

      <div style={styles.grid}>
        {sorted.map((deviceId, idx) => (
          <button key={idx} style={styles.card} onClick={() => handleClick(deviceId)}>
            <img src={sweage} alt="device" style={styles.image} />
            <div style={styles.cont}>
              <div style={styles.label}>{deviceId}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
