import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import DbTest from '../Db/DbTest';

const HomePage = () => {
const navigate = useNavigate();

  useEffect(() => {
    let currentuser = localStorage.getItem('user');
    if (currentuser === null) {
      navigate('/login');
    }
  }, []);

return (
<div style={{
     display: 'flex',
     flexDirection: 'column',
     alignItems: 'center',
     justifyContent: 'center',
     height: '100vh',
     width: '100vw',
     padding: '20px',
     background: '#0f380f', // Game Boy Color background
     color: '#0f370f',
     boxSizing: 'border-box',
     margin: 0,
     overflow: 'hidden',
     fontFamily: "'Press Start 2P', cursive" // Game Boy style font
   }}>
     <h1 style={{
       fontSize: 'clamp(2rem, 8vw, 4rem)',
       marginBottom: '2rem',
       color: '#00ff00',
       textShadow: '2px 2px 0 #8bac0f, -2px -2px 0 #8bac0f, 2px -2px 0 #8bac0f, -2px 2px 0 #8bac0f',
       letterSpacing: '2px',
       lineHeight: '1.2',
       textAlign: 'center'
}}>
Sudoku RPG Adventure
</h1>

  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: 'clamp(200px, 80%, 400px)',
    maxWidth: '100%'
  }}>
    <button
      onClick={() => navigate('/game')}
      style={{
        padding: 'clamp(10px, 3vw, 20px) clamp(20px, 5vw, 40px)',
        fontSize: 'clamp(1rem, 3vw, 1.5rem)',
        background: '#306230', // Button background
        color: '#00ff00',
        border: '2px solid #00ff00',
        borderRadius: '0',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 4px 0 #0f380f',
        fontFamily: "'Press Start 2P', cursive",
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 0 #006600';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 0 #006600';
      }}
    >
      Start Game
    </button>

    <button
      onClick={() => navigate('/instructions')}
      style={{
        padding: 'clamp(10px, 3vw, 20px) clamp(20px, 5vw, 40px)',
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              background: '#306230', // Button background
              color: '#00ff00',
              border: '2px solid #00ff00',
              borderRadius: '0',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 0 #0f380f',
              fontFamily: "'Press Start 2P', cursive",
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 0 #006600';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 0 #006600';
      }}
    >
      How to Play
    </button>

    <button
      onClick={() => navigate('/settings')}
      style={{
        padding: 'clamp(10px, 3vw, 20px) clamp(20px, 5vw, 40px)',
        fontSize: 'clamp(1rem, 3vw, 1.5rem)',
        background: '#306230', // Button background
        color: '#00ff00',
        border: '2px solid #00ff00',
        borderRadius: '0',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 4px 0 #0f380f',
        fontFamily: "'Press Start 2P', cursive",
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 0 #006600';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 0 #006600';
      }}
    >
      Settings
    </button>

    <button
      onClick={() => {
        // Perform logout logic here
        localStorage.removeItem('user');
        navigate('/login');
      }}
      style={{
        padding: 'clamp(10px, 3vw, 20px) clamp(20px, 5vw, 40px)',
        fontSize: 'clamp(1rem, 3vw, 1.5rem)',
        background: '#306230', // Button background
        color: '#00ff00',
        border: '2px solid #00ff00',
        borderRadius: '0',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 4px 0 #0f380f',
        fontFamily: "'Press Start 2P', cursive",
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 0 #006600';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 0 #006600';
      }}
    >
      Logout
    </button>
  </div>

  <div style={{
    marginTop: '3rem',
    textAlign: 'center',
    color: '#00ff00',
    fontFamily: "'Courier New', monospace",
    fontSize: 'clamp(0.6rem, 2vw, 0.9rem)',
  }}>
    <DbTest />
    <p>Version 1.0.0</p>
    <p>CSCI3100 Project</p>
  </div>
</div>
);
};

export default HomePage;