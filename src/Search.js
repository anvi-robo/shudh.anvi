import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import icon from "./images/icon.png";
import hmwssbLogo from './images/hmwssbcopy.png';


// Use short division names as keys
const divisionsByDivision = {
  "SR Nagar": ['Borabanda', 'Somajiguda', 'Yellareddyguda', 'Jubille Hills', 'Vengalroanagar', 'Fathenagar'],
  "Kukatpally": ['Karimnagar Urban', 'Choppadandi', 'Manakondur'],
  "Durgam Cheruvu": ['Nallagandla', 'Madhapur', 'Kondapur', 'Gachibowli'],
  "Hafeezpet": ['Chandanagar', 'Warangal West', 'Hanamkonda'],
  "Manikonda": ['Jalpally', 'Thukkuguda', 'Kismathpur', 'Manikonda', 'Shamshabad'],
};

// Mapping for display names
const displayDivisionNames = {
  "SR Nagar": "Division 6 (SR Nagar)",
  "Kukatpally": "Division 9 (Kukatpally)",
  "Durgam Cheruvu": "Division 15 (Durgam Cheruvu)",
  "Hafeezpet": "Division 17 (Hafeezpet)",
  "Manikonda": "Division 18 (Manikonda)",
};

const telanganaDivision = Object.keys(divisionsByDivision);

const DivisionSelection = () => {
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [devices, setDevices] = useState([]);
  const [sortOption, setSortOption] = useState('all');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedDivision) return;

  const district = "Hyderabad"; // You can make this dynamic if needed

  try {
    let url = `https://sewage-bot-poc.onrender.com/api/data/location/${district}`;
    const res = await axios.get(url);

    // Filter on frontend
    const filtered = res.data.filter((device) => {
      const matchesDivision = selectedDivision ? device.division === displayDivisionNames[selectedDivision] : true;
      const matchesArea = selectedArea ? device.area.toLowerCase() === selectedArea.toLowerCase() : true;
      return matchesDivision && matchesArea;
    });

    setDevices(filtered);
  } catch (err) {
    console.error("Error fetching devices:", err);
  }
};


  const handleDeviceClick = (device) => {
    navigate(`/dashboard/${device.device_id}/${selectedDivision}`);
  };

  const filteredDevices = useMemo(() => {
  return devices.filter((device) => {
    if (sortOption === 'all') return true;
    return sortOption === 'active'
      ? device.status === 'active'
      : device.status !== 'active';
  });
}, [devices, sortOption]);

  const totalBots = new Set(devices.map(d => d.device_id)).size;
  const totalWaste = devices.reduce(
    (sum, device) => sum + (device.wasteCollectedKg || 0),
    0
  );

  return (
    <>
        <style>
        {`
          .focusable-select {
            padding: 0.5rem 0.75rem;
            border: 1px solid #ccc;
            border-radius: 0.375rem;
            width: 300px;
            min-width: 200px;
            color: #374151;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }

          .focusable-select:focus {
            border-color:rgb(21, 73, 187);
            border-radius: 0.5px;
            box-shadow: 0px 0px 2px 1px rgb(131, 165, 239);
            outline: none;
          }
        `}
      </style>
      {/* ✅ Header Bar */}
      <div style={{ backgroundColor: 'white', borderBottom: '2px solid #ccc' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0rem 2rem',
        }}>
          <img src={hmwssbLogo} alt="HMWSSB Logo" style={{ height: '60px' }} />
        </div>
        <div style={{ height: '25px', backgroundColor: '#075985' }}>
          <div style={{ display: 'flex', justifyContent: 'center' , fontWeight: '700', fontSize: '1.5rem', color: 'white' }}>
            SHUDH
          </div>
        </div>
      </div>

      <div style={{ minHeight: '100vh', backgroundColor: 'white', paddingTop: '2rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <form onSubmit={handleSubmit}
          style={{
            border: '1px solid #ccc',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '70rem',
            margin: '0 auto',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
            backgroundColor: 'white'
          }}
        >
          {/* Row 1: District, Division, View Bots */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '5.5rem', flexWrap: 'wrap', flex: 1 }}>
              {/* Division */}
              <div style={{ display: 'flex', alignItems:'center', gap: '2.25rem' }}>
                <label style={{ fontWeight: '700', marginBottom: '0.3rem', color: '#374151' }}>Division</label>
                <select
                  className="focusable-select"
                  value={selectedDivision}
                  onChange={(e) => {
                    setSelectedDivision(e.target.value);
                    setSelectedArea('');
                  }}
                  required
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #ccc',
                    borderRadius: '0.375rem',
                    width: '300px',
                    minWidth: '200px',
                    color: '#374151'
                  }}
                >
                  <option value="">----All----</option>
                  {telanganaDivision.map((division) => (
                    <option key={division} value={division}>
                      {displayDivisionNames[division]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label style={{ fontWeight: '700', marginBottom: '0.3rem', color: '#374151' }}>Section</label>
                <select
                  className="focusable-select"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  disabled={!selectedDivision}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #ccc',
                    borderRadius: '0.375rem',
                    width: '300px',
                    minWidth: '200px',
                    color: '#374151'
                  }}
                >
                  <option value="">----All----</option>
                  {selectedDivision &&
                    divisionsByDivision[selectedDivision]?.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                </select>
              </div>
            </div>

            {/* View Bots Button */}
            <div style={{ alignSelf: 'flex-start' }}>
              <button
                type="submit"
                disabled={!selectedDivision}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  backgroundColor: selectedDivision ? '#1D4ED8' : '#ccc',
                  color: 'white',
                  cursor: selectedDivision ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap'
                }}
              >
                View Bots
              </button>
            </div>
          </div>

          {/* Row 2: From Date + To Date */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '5.25rem',
            marginTop: '1.25rem'
          }}>
            {/* From Date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <label style={{ fontWeight: '700', marginBottom: '0.3rem', color: '#374151' }}>From Date</label>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '0.375rem',
                  width: '280px',
                  minWidth: '200px',
                  color: '#374151'
                }}
              />
            </div>

            {/* To Date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ fontWeight: '700', marginBottom: '0.3rem', color: '#374151' }}>To Date</label>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '0.375rem',
                  width: '280px',
                  minWidth: '200px',
                  color: '#374151'
                }}
              />
            </div>
          </div>
        </form>

        {/* Devices Section */}
        <div style={{ marginTop: '2.5rem', maxWidth: '90rem', marginLeft: 'auto', marginRight: 'auto' }}>
          {devices.length > 0 && (
            <>
              {/* Header */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>
                  Showing Bots for {displayDivisionNames[selectedDivision]}{selectedArea && ` > ${selectedArea}`}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '500', color: '#4b5563' }}>Sort:</label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    style={{ padding: '0.25rem 0.75rem', border: '1px solid #ccc', borderRadius: '0.375rem' }}
                  >
                    <option value="active">Sort by Active</option>
                    <option value="inactive">Sort by Inactive</option>
                    <option value="all">Show All</option>
                  </select>
                </div>

                <div style={{ textAlign: 'right', color: '#374151', fontWeight: '500' }}>
                  Bots Deployed: {totalBots}<br />
                  Waste Collected: {totalWaste} KG
                </div>
              </div>

              {/* Cards */}
              {filteredDevices.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 350px))', gap: '1rem' }}>
                  {[...new Map(filteredDevices.map(device => [device.device_id, device])).values()]
                    .map((device) => (
                      <div
                        key={device.device_id}
                        onClick={() => handleDeviceClick(device)}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          cursor: 'pointer',
                          overflow: 'hidden',
                        }}
                      >
                        <img src={icon} alt="device" style={{ width: '300px', height: '160px', objectFit: 'cover' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                          <div style={{ fontWeight: '600', color: '#1f2937' }}>{device.device_id}</div>
                          {device.status === 'active' && (
                            <span style={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: '500' }}>ACTIVE</span>
                          )}
                        </div>
                      </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '2.5rem' }}>
                  No bots found for selected filter: <strong>{sortOption}</strong>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DivisionSelection;


