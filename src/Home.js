import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cm from './images/cm.png';
import commissioner from './images/hmwssbcopy.png';
import logo from './images/gov_logo.png';
import rising from './images/no1.png';
import MapComponent from './mapComponent';

export default function Home() {
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search');
  };

  const styles = {
    headerContainer: {
      position: 'relative',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#0074cc',
      padding: '1.5rem 2rem',
      color: 'white',
    },
    leftLogos: {
      display: 'flex',
      gap: '1.2rem',
      alignItems: 'center',
    },
    photo: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    commissionerWide: {
      height: '100px',
      width: '400px',
      objectFit: 'contain',
      backgroundColor: 'white',
      padding: '5px',
      borderRadius: '10px',
    },
    projectText: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
    },
    profileIcon: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      cursor: 'pointer',
      backgroundColor: '#fff',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: '#0074cc',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr',
      gap: '1rem',
      padding: '1rem',
    },
    twoColumn: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: '1rem',
      gridColumn: '1 / span 3',
    },
    box: {
      backgroundColor: '#fff',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      textAlign: 'center',
    },
    button: {
      padding: '0.5rem 1rem',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '0.5rem',
    },
  };

  return (
    <div>
      <div style={styles.headerContainer}>
        <div style={styles.profileIcon}>👤</div>
        <div style={styles.header}>
          {/* Left: CM + Logo */}
          <div style={styles.leftLogos}>
            <img src={logo} alt="Logo" style={styles.photo} />
            <img src={cm} alt="CM" style={styles.photo} />
          </div>

          {/* Middle: Commissioner Image */}
          <img src={commissioner} alt="Commissioner" style={styles.commissionerWide} />

          {/* Right: Project Title */}
          <div style={styles.projectText}>Project SHUDH</div>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.twoColumn}>
          <div style={styles.box}>
            <img src={rising} alt="Rising Telangana" style={{ width: '100%' }} />
          </div>
          <div style={styles.box}>
            <MapComponent /> {/* ✅ Embedded Map Here */}
          </div>
        </div>

        <div style={styles.box}>
          <h3>Manhole Prevent</h3>
        </div>
        <div style={styles.box}>
          <h3>Waste Collected</h3>
          <p>240kg</p>
        </div>
        <div style={styles.box}>
          <h3>Search for Bots</h3>
          <button style={styles.button} onClick={handleSearchClick}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
