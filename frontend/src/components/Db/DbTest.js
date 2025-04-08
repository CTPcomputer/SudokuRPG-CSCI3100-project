import React, { useState } from 'react';
import {LICENSE_KEY} from "../License/license.js";

const DbTest = () => {
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/test-db',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-License-Key': LICENSE_KEY
          },
        }
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setDbStatus(data);
    } catch (err) {
      setError('Failed to check database connection');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '500px',
      margin: '0 auto',
      backgroundColor: '#306230',
      color: '#00ff00',
      fontFamily: "'Press Start 2P', cursive",
      border: '2px solid #00ff00',
      borderRadius: '5px'
    }}>
      <h2 style={{ fontSize: '24px', textAlign: 'center' }}>Database Connection Test</h2>
      <button 
        onClick={checkConnection}
        style={{
          padding: '10px 20px',
          backgroundColor: '#00ff00',
          color: '#000000',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontFamily: "'Press Start 2P', cursive",
          fontSize: '16px',
          transition: 'all 0.2s',
          boxShadow: '0 4px 0 #0f380f',
        }}
        disabled={loading}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 0 #0f380f';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 0 #0f380f';
        }}
      >
        {loading ? 'Checking...' : 'Test Database Connection'}
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}

      {dbStatus && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #00ff00', borderRadius: '5px' }}>
          <h3 style={{ fontSize: '20px' }}>Connection Status:</h3>
          <p><strong>Status:</strong> {dbStatus.status}</p>
          <p><strong>Message:</strong> {dbStatus.message}</p>
          <p><strong>State:</strong> {dbStatus.state}</p>
        </div>
      )}
    </div>
  );
};

export default DbTest;