// src/components/dashboard/Header.js
import React from 'react';

const Header = ({ user, onLogout, toggleSidebar, isMobile }) => {
  return (
    <header
      style={{
        backgroundColor: '#1e2937',
        color: 'white',
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow:
          '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 200,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Stops immediate click event bubbling down to main Layout closing handler
            toggleSidebar();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: isMobile ? '15px' : '24px',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#374151')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
        >
          ☰
        </button>
        <h2
          style={{
            margin: 0,
            fontSize: isMobile ? '13px' : '20px',
            fontWeight: '600',
            letterSpacing: '-0.5px',
          }}
        >
          RC Quantum
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ textAlign: 'right', display: 'block' }}>
          <div
            style={{ fontWeight: '600', fontSize: isMobile ? '10px' : '14px' }}
          >
            {user?.name || 'User'}
          </div>
          <div
            style={{
              fontSize: isMobile ? '9px' : '12px',
              color: '#94a3b8',
              fontWeight: '500',
              marginTop: '2px',
            }}
          >
            {user?.role ? user.role.toUpperCase() : 'EMPLOYEE'}
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: isMobile ? '4px 8px' : '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: 2,
            cursor: 'pointer',
            fontSize: isMobile ? '9px' : '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#dc2626')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#ef4444')
          }
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
