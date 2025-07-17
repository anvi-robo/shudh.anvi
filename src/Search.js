import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import icon from "./images/icon.png";

const divisionsByDivision = {
  "Division 6 (SR Nagar)": ['Armoor', 'Bodhan', 'Nizamabad Urban', 'Nizamabad Rural'],
  "Division 9 (Kukatpally)": ['Karimnagar Urban', 'Choppadandi', 'Manakondur'],
  "Division 15 (Durgam Cheruvu)": ['1-Charminar', '2-Vinay Nagar', '11-L.B.Nagar','Secunderabad', 'Malkajgiri', 'KPHB', 'Kondapur'],
  "Division 17 (Hafeezpet)": ['Chanda Nagar', 'Warangal West', 'Hanamkonda'],
  "Division 18 (manikonda)": ['Warangal East', 'Warangal West', 'Hanamkonda'],
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
    if (!selectedArea) return;

    try {
      let url = `https://sewage-bot-poc.onrender.com/api/data?division=${selectedDivision}`;
      if (selectedArea) url += `&area=${selectedArea}`;
      const res = await axios.get(url);
      setDevices(res.data);
    } catch (err) {
      console.error("Error fetching devices:", err);
    }
  };

  const handleDeviceClick = (device) => {
    navigate(`/dashboard/${device.device_id}/${selectedDivision}`);
  };

  const filteredDevices = devices.filter((device) => {
    if (sortOption === 'all') return true;
    return sortOption === 'active'
      ? device.status === 'active'
      : device.status !== 'active';
  });

  const totalBots = new Set(devices.map(d => d.device_id)).size;
  const totalWaste = devices.reduce(
    (sum, device) => sum + (device.wasteCollectedKg || 0),
    0
  );

  return (
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
            {/* District */}
            <div style={{ display: 'flex', alignItems:'center', gap: '2.25rem' }}>
              <label style={{ fontWeight: '700', marginBottom: '0.3rem', color: '#374151' }}>Division</label>
              <select
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
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
            </div>

            {/* Division */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ fontWeight: '700', marginBottom: '0.3rem', color: '#374151' }}>Section</label>
              <select
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
      {devices.length > 0 && (
        <div style={{ marginTop: '2.5rem', maxWidth: '90rem', marginLeft: 'auto', marginRight: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>
              Showing Bots for {selectedDivision}{selectedArea && ` > ${selectedArea}`}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {[...new Map(filteredDevices.map(device => [device.device_id, device])).values()]
              .map((device) => (
                <div
                  key={device.device_id}
                  onClick={() => handleDeviceClick(device)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                >
                  <img src={icon} alt="device" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>{device.device_id}</div>
                    {device.status === 'active' && (
                      <span style={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: '500' }}>ACTIVE</span>
                    )}
                  </div>
                </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredDevices.length === 0 && (
            <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '2.5rem' }}>
              No bots found for this location.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DivisionSelection;
