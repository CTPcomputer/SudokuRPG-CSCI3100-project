import React, { useState, useEffect } from 'react';

// Import the font if not already in your project (e.g., via CSS or a link in index.html)
// Add this to your index.html: <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

const Leaderboard = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/rankings');
        const result = await response.json();
        if (result.status === 'success') {
          setRankings(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Error fetching rankings');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#306230',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00ff00',
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '1.2rem',
      }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#306230',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#00ff00',
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '1.2rem',
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh', // Full height of the viewport
      width: '100vw', // Full width of the viewport
      backgroundColor: '#306230', // Outer background color
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#0f380f', // Game Boy Color background
        color: '#00ff00', // Green text
        fontFamily: "'Press Start 2P', cursive", // Game Boy style font
        borderRadius: '5px',
        border: '2px solid #00ff00',
      }}>
        <h1 style={{ marginBottom: '30px', color: '#00ff00' }}>Leaderboard</h1>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px',
          color: '#00ff00',
        }}>
          <thead>
            <tr style={{ backgroundColor: '#306230' }}>
              <th style={{ border: '2px solid #00ff00', padding: '10px', textAlign: 'center' }}>Rank</th>
              <th style={{ border: '2px solid #00ff00', padding: '10px', textAlign: 'center' }}>Email</th>
              <th style={{ border: '2px solid #00ff00', padding: '10px', textAlign: 'center' }}>Total Time</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((entry, index) => (
              <tr key={entry.email}>
                <td style={{ border: '2px solid #00ff00', padding: '10px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '2px solid #00ff00', padding: '10px', textAlign: 'center' }}>{entry.email}</td>
                <td style={{ border: '2px solid #00ff00', padding: '10px', textAlign: 'center' }}>{formatTime(entry.totalTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;