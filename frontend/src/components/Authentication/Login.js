import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LICENSE_KEY } from '../License/license.js';
import Modal from './Modal'; // Import Modal

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState({ isOpen: false, message: '', type: 'success' });

  const login = (email, password) => {
    fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-License-Key': LICENSE_KEY,
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'error') {
          setModal({ isOpen: true, message: data.message, type: 'error' });
        } else {
          localStorage.setItem('user', JSON.stringify(data.user));
          setModal({ isOpen: true, message: data.message, type: 'success' , navigateTo: '/home' });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setModal({ isOpen: true, message: 'An error occurred. Please try again.', type: 'error' });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    login(email, password);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        padding: '20px',
        background: '#0f380f',
        color: '#00ff00',
        boxSizing: 'border-box',
        margin: 0,
        overflow: 'hidden',
        fontFamily: "'Press Start 2P', cursive",
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(2rem, 8vw, 4rem)',
          marginBottom: '2rem',
          color: '#00ff00',
          textShadow: '2px 2px 0 #8bac0f, -2px -2px 0 #8bac0f, 2px -2px 0 #8bac0f, -2px 2px 0 #8bac0f',
          letterSpacing: '2px',
          lineHeight: '1.2',
          textAlign: 'center',
        }}
      >
        Sudoku RPG Adventure
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: 'clamp(200px, 80%, 400px)',
          maxWidth: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <label
            htmlFor="email"
            style={{
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              color: '#00ff00',
            }}
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: 'clamp(8px, 2vw, 12px)',
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              background: '#306230',
              color: '#00ff00',
              border: '2px solid #00ff00',
              borderRadius: '0',
              fontFamily: "'Press Start 2P', cursive",
              outline: 'none',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <label
            htmlFor="password"
            style={{
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              color: '#00ff00',
            }}
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: 'clamp(8px, 2vw, 12px)',
              fontSize: 'clamp(0.8rem, 2vw, 1rem)',
              background: '#306230',
              color: '#00ff00',
              border: '2px solid #00ff00',
              borderRadius: '0',
              fontFamily: "'Press Start 2P', cursive",
              outline: 'none',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: 'clamp(10px, 3vw, 20px) clamp(20px, 5vw, 40px)',
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            background: '#306230',
            color: '#00ff00',
            border: '2px solid #00ff00',
            borderRadius: '0',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 0 #0f380f',
            fontFamily: "'Press Start 2P', cursive",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 0 #006600';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 0 #006600';
          }}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => navigate('/signup')}
          style={{
            padding: 'clamp(10px, 3vw, 20px) clamp(20px, 5vw, 40px)',
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            background: '#306230',
            color: '#00ff00',
            border: '2px solid #00ff00',
            borderRadius: '0',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 0 #0f380f',
            fontFamily: "'Press Start 2P', cursive",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 0 #006600';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 0 #006600';
          }}
        >
          Signup
        </button>
      </form>

      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, isOpen: false })}
        navigateTo={modal.navigateTo} // Pass navigateTo prop to Modal
      />
    </div>
  );
};

export default Login;