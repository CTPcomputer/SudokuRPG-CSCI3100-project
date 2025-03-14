import React from 'react';
import { useNavigate } from 'react-router-dom';

const Instructions = () => {
  const navigate = useNavigate();

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
        border: '2px solid #00ff00'
      }}>
        <h1 style={{ marginBottom: '30px', color: '#00ff00' }}>How to Play</h1>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#00ff00', marginBottom: '15px' }}>Game Overview</h2>
          <p>Sudoku RPG Adventure combines classic Sudoku puzzles with RPG elements. Battle bosses by solving Sudoku puzzles!</p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#00ff00', marginBottom: '15px' }}>Controls</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>1. Use arrow keys to move your character</li>
            <li style={{ marginBottom: '10px' }}>2. Approach boss characters to initiate battles</li>
            <li style={{ marginBottom: '10px' }}>3. Click cells and use number buttons to fill the Sudoku grid</li>
            <li style={{ marginBottom: '10px' }}>4. Complete the Sudoku puzzle within the time limit to win</li>
          </ul>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#00ff00', marginBottom: '15px' }}>Sudoku Rules</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>1. Fill each row with numbers 1-9</li>
            <li style={{ marginBottom: '10px' }}>2. Fill each column with numbers 1-9</li>
            <li style={{ marginBottom: '10px' }}>3. Fill each 3x3 box with numbers 1-9</li>
            <li style={{ marginBottom: '10px' }}>X. No repeating numbers in rows, columns, or boxes</li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '15px 30px',
            fontSize: '1.2rem',
            background: '#306230', // Button background
            color: '#00ff00',
            border: '2px solid #00ff00',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            fontFamily: "'Press Start 2P', cursive", // Game Boy style font
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default Instructions;