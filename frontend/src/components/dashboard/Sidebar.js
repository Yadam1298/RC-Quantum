// src/components/dashboard/Sidebar.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard/all-employees', label: 'All Employees', icon: '👥' },
    {
      path: '/dashboard/attendance',
      label: ' Attendance Dashboard',
      icon: '📅',
    },
  ];

  return (
    <>
      {/* Global CSS Transition Engines across all devices */}
      <style>{`
        .sidebar-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 260px;
          height: 100vh;
          background-color: #0f172a;
          color: #e2e8f0;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 400;
          box-shadow: 4px 0 12px rgba(0,0,0,0.2);
          overflow-y: auto;
          transform: ${isOpen ? 'translateX(0)' : 'translateX(-100%)'};
        }
        .sidebar-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(1px);
          z-index: 350;
          display: ${isOpen ? 'block' : 'none'};
        }
      `}</style>

      {/* Background Overlay layer */}
      <div className="sidebar-overlay" onClick={closeSidebar} />

      {/* Main Sidebar Panel */}
      <div className="sidebar-container" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ color: '#60a5fa', margin: 0, fontWeight: '600' }}>
            Admin Panel
          </h3>

          {/* Persistent Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeSidebar();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#1e293b')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            ✕
          </button>
        </div>

        <div style={{ paddingTop: '10px' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(item.path);
                  closeSidebar(); // Autocloses drawer panel layout upon transition action
                }}
                style={{
                  padding: '14px 20px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#1e40af' : 'transparent',
                  color: isActive ? '#fff' : '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '15px',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor = '#1e293b';
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
