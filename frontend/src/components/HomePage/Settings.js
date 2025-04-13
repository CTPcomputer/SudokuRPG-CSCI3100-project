import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Game Boy style colors
const colors = {
  background: '#0f380f',
  header: '#8bac0f',
  text: '#8bac0f',
  inputBackground: '#306230',
  buttonBackground: '#306230',
  buttonHover: '#306230',
  buttonCancel: '#306230',
  fullscreenBackground: '#306230',
};

const Settings = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('normal');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLimit, setTimeLimit] = useState(300);

  // Check login status
  useEffect(() => {
    let currentuser = localStorage.getItem('user');
    if (currentuser === null) {
      navigate('/login');
    }
  }, [navigate]);

  // Set fullscreen background color
  useEffect(() => {
    document.body.style.backgroundColor = colors.fullscreenBackground;
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Load saved sound setting on mount
  useEffect(() => {
    const savedSound = localStorage.getItem('sound');
    if (savedSound !== null) {
      setSoundEnabled(JSON.parse(savedSound));
    }
  }, []);

  // Handle Save & Return
  const handleSave = () => {
    localStorage.setItem('sound', JSON.stringify(soundEnabled));
    console.log('Sound setting saved:', soundEnabled);
    navigate('/home');
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: colors.background,
      color: colors.text,
      fontFamily: '"Press Start 2P", cursive',
      fontSize: '16px',
      borderRadius: '10px',
    }}>
      <h1 style={{ marginBottom: '30px', color: colors.header }}>Settings</h1>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: colors.header, marginBottom: '15px' }}>Game Settings</h2>
        


        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              style={{ marginRight: '10px', width: '20px', height: '20px' }}
            />
            Enable Sound Effects
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '15px 30px',
            fontSize: '1.2rem',
            background: colors.buttonBackground,
            color: colors.text,
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            fontFamily: 'inherit',
          }}
          onMouseOver={e => e.currentTarget.style.background = colors.buttonHover}
          onMouseOut={e => e.currentTarget.style.background = colors.buttonBackground}
        >
          Save & Return
        </button>

        <button
          onClick={() => navigate('/home')}
          style={{
            padding: '15px 30px',
            fontSize: '1.2rem',
            background: colors.buttonCancel,
            color: colors.text,
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            fontFamily: 'inherit',
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Settings;