// src/components/dashboard/Layout.js
import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('employee') || '{}');

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header
        user={user}
        onLogout={handleLogout}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      {/* Main viewport canvas layout section wrapper */}
      <main
        onClick={closeSidebar}
        style={{
          padding: '24px',
          flexGrow: 1,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
