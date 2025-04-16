import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LICENSE_KEY } from '../License/license.js';
import Modal from './Modal';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState({ isOpen: false, message: '', type: 'success' });

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-License-Key': LICENSE_KEY,
          },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (data.status === 'error') {
          setModal({ isOpen: true, message: data.message, type: 'error', navigateTo: '/login' });
        } else {
          setModal({
            isOpen: true,
            message: 'Email verified successfully! You can now log in.',
            type: 'success',
            navigateTo: '/login',
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setModal({
          isOpen: true,
          message: 'An error occurred. Please try again.',
          type: 'error',
          navigateTo: '/login',
        });
      }
    };

    verifyEmail();
  }, [token]);

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
      <h2
        style={{
          fontSize: 'clamp(1.5rem, 6vw, 3rem)',
          marginBottom: '2rem',
          color: '#00ff00',
          textShadow:
            '2px 2px 0 #8bac0f, -2px -2px 0 #8bac0f, 2px -2px 0 #8bac0f, -2px 2px 0 #8bac0f',
          letterSpacing: '2px',
          lineHeight: '1.2',
          textAlign: 'center',
        }}
      >
        Verifying Email...
      </h2>

      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, isOpen: false })}
        navigateTo={modal.navigateTo}
      />
    </div>
  );
};

export default VerifyEmail;