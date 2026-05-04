import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, UserCircle } from 'lucide-react';
import apiFetch from '../api';

const Header = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const notificationRef = useRef(null);

  useEffect(() => {
    apiFetch('/enrollments').then(({ data }) => {
      if (data && data.success) {
        const sorted = data.enrollments.sort((a, b) => new Date(b.EnrolledAt) - new Date(a.EnrolledAt));
        setRecentEnrollments(sorted.slice(0, 5));
      }
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
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
          

        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="position-relative" ref={notificationRef}>
            <button 
              className="btn btn-light rounded-circle p-2 position-relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} className="text-muted" />
              {recentEnrollments.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
              )}
            </button>

            {showNotifications && (
              <div 
                className="position-absolute bg-white shadow rounded-4 border top-100 mt-2 p-0 overflow-hidden end-0" 
                style={{ width: '320px', zIndex: 1050 }}
              >
                <div className="px-4 py-3 border-bottom bg-light">
                  <h6 className="mb-0 fw-bold font-sans text-dark">New Enrollments</h6>
                </div>
                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {recentEnrollments.length > 0 ? (
                    recentEnrollments.map((e, idx) => (
                      <div key={idx} className="px-4 py-3 border-bottom text-sm font-sans bg-white" style={{ cursor: 'pointer' }}>
                        <div className="d-flex align-items-start gap-3">
                          <div className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white bg-dark flex-shrink-0" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                            {e.StudentName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-medium text-dark lh-sm mb-1" style={{ fontSize: '0.9rem' }}>
                              {e.StudentName} <span className="text-muted fw-normal">enrolled in</span> <span className="text-primary fw-semibold">{e.CourseName}</span>
                            </div>
                            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                              {new Date(e.EnrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-muted font-sans small">
                      <p className="mb-0">No new enrollments</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
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
