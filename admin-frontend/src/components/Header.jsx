import React from 'react';
import { Menu, Search, Bell, UserCircle } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm sticky-top z-1" style={{ height: '70px' }}>
      <div className="container-fluid h-100 d-flex align-items-center justify-content-between px-4">
        
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-light d-md-none p-2 rounded-circle" 
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>
          
          <div className="position-relative d-none d-md-block">
            <span className="position-absolute top-50 translate-middle-y ms-3 text-muted">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              className="form-control rounded-pill bg-light border-0 ps-5 py-2 font-sans" 
              placeholder="Search..." 
              style={{ width: '300px', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-light rounded-circle p-2 position-relative">
            <Bell size={20} className="text-muted" />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
          </button>
          
          <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-3 py-1 cursor-pointer">
            <UserCircle size={24} className="text-secondary" />
            <span className="font-sans fw-medium small d-none d-sm-block text-dark">Admin User</span>
          </div>
        </div>
        
      </div>
    </header>
  );
};

export default Header;
