import React from 'react';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, message, type, onClose, navigateTo }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.7)', // Semi-transparent overlay
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-in',
      }}
    >
      <div
        style={{
          background: '#0f380f', // Game Boy background
          border: '4px solid #00ff00', // Neon green border
          padding: 'clamp(20px, 5vw, 30px)',
          width: 'clamp(200px, 80%, 400px)',
          maxWidth: '90%',
          color: '#00ff00',
          fontFamily: "'Press Start 2P', cursive",
          textAlign: 'center',
          boxShadow: '0 8px 0 #006600, 0 12px 0 rgba(0, 0, 0, 0.5)',
          borderRadius: '0',
          position: 'relative',
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        <h3
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            marginBottom: '1rem',
            color: type === 'error' ? '#ff4444' : '#00ff00', // Red for error, green for success
            textShadow:
              '2px 2px 0 #8bac0f, -2px -2px 0 #8bac0f, 2px -2px 0 #8bac0f, -2px 2px 0 #8bac0f',
          }}
        >
          {type === 'error' ? 'Error!' : 'Success!'}
        </h3>
        <p
          style={{
            fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            marginBottom: '2rem',
            lineHeight: '1.5',
          }}
        >
          {message}
        </p>
        <button
          onClick={handleClose}
          style={{
            padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)',
            fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            background: '#306230',
            color: '#00ff00',
            border: '2px solid #00ff00',
            borderRadius: '0',
            cursor: 'pointer',
            fontFamily: "'Press Start 2P', cursive",
            transition: 'all 0.2s',
            boxShadow: '0 4px 0 #006600',
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
          OK
        </button>
      </div>
    </div>
  );
};

// CSS Animations (add to your global CSS or a <style> tag in index.html)
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

// Inject styles (alternatively, add to your CSS file)
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Modal;