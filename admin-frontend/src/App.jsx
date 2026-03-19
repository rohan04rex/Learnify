import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { AuthProvider } from './AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout & Pages
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Students from './pages/Students';

const Settings = () => <div className="p-4 text-center text-muted"><h4>Settings Section (Coming Soon)</h4></div>;
const NotFound = () => <div className="d-flex align-items-center justify-content-center vh-100 bg-light"><h2>404 - Page Not Found</h2></div>;

function App() {
  return (
    <AuthProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="students" element={<Students />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
