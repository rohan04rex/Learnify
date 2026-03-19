import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Courses', path: '/courses', icon: <BookOpen size={20} /> },
    { name: 'Students', path: '/students', icon: <Users size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-md-none z-2"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar sidebar */}
      <aside 
        className={`bg-white shadow-sm vh-100 position-fixed top-0 start-0 z-3 transition-transform d-flex flex-column ${isOpen ? 'translate-middle-x-0' : '-translate-middle-x'}`}
        style={{ width: '250px', transform: !isOpen ? 'translateX(-100%)' : 'translateX(0)', transition: 'transform 0.3s ease-in-out' }}
      >
        <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
          <h4 className="fw-bold mb-0 text-dark font-sans">Learnify Admin</h4>
          <button className="btn btn-sm d-md-none" onClick={toggleSidebar}>
            &times;
          </button>
        </div>

        <div className="p-3 flex-grow-1 overflow-auto">
          <ul className="nav flex-column gap-2 font-sans">
            {navItems.map((item) => (
              <li className="nav-item" key={item.name}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    `nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none ${isActive ? 'bg-dark text-white fw-medium' : 'text-muted hover-bg-light'}`
                  }
                  style={({ isActive }) => !isActive ? { ':hover': { backgroundColor: '#f3f4f6' } } : {}}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-3 border-top mt-auto">
             <button 
                onClick={logout}
                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill font-sans fw-medium"
             >
                 <LogOut size={18} />
                 Sign Out
             </button>
        </div>
      </aside>

      {/* CSS for sidebar toggling on medium screens */}
      <style>{`
        @media (min-width: 768px) {
          aside {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
