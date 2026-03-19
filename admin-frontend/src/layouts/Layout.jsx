import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex bg-light vh-100 overflow-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div 
        className="flex-grow-1 d-flex flex-column transition-all w-100"
        style={{ 
          marginLeft: '0', 
          '@media (min-width: 768px)': { marginLeft: '250px' } 
        }}
      >
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-grow-1 overflow-auto p-4 p-md-5">
            <div className="container-fluid max-w-7xl mx-auto" style={{ maxWidth: '1400px' }}>
                <Outlet />
            </div>
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          main, header {
            margin-left: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
