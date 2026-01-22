// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './shared/Sidebar';
import PublicSidebar from './shared/PublicSidebar';
import OwnerSidebar from './shared/OwnerSidebar';
import RequireAuth from './components/RequireAuth';
import Login from './pages/Login';
import PublicDashboard from './pages/PublicDashboard';
import Dashboard from './pages/Dashboard';
import Courts from './pages/Courts';
import Events from './pages/Events';
import Applications from './pages/Applications';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import OwnerDashboard from './pages/OwnerDashboard';
import DatabaseViewer from './pages/DatabaseViewer';
import Reservation from './pages/Reservation';
import PublicBooking from './pages/PublicBooking';
import CourtsPublic from './pages/CourtsPublic';
import EventsPublic from './pages/EventsPublic';
import CustomerSidebar from './shared/CustomerSidebar';
import './styles.css';

function App() {
  const location = useLocation();

  // Helper untuk cek role user dari localStorage
  const getUserRole = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr);
      return user.role;
    } catch (e) {
      return null;
    }
  };

  const role = getUserRole();
  const isLoginPage = location.pathname === '/login';
  const isPublicPage = location.pathname === '/' || location.pathname === '/public' || location.pathname === '/courts-public' || location.pathname === '/events-public' || location.pathname === '/contact' || location.pathname === '/booking';

  // Logika Sidebar:
  // 1. Jika Login Page -> Tidak ada sidebar
  // 2. Jika Public Page -> PublicSidebar
  // 3. Jika Role Customer -> CustomerSidebar
  // 4. Jika Role Owner -> OwnerSidebar
  // 5. Default (Admin) -> Sidebar (Admin Sidebar)

  let SidebarComponent;
  if (isLoginPage) {
    SidebarComponent = null;
  } else if (isPublicPage) {
    SidebarComponent = PublicSidebar;
  } else if (role === 'customer') {
    SidebarComponent = CustomerSidebar;
  } else if (role === 'owner') {
    SidebarComponent = OwnerSidebar;
  } else {
    SidebarComponent = Sidebar; // Default Admin
  }

  return (
    <div className={isLoginPage ? 'login-page' : 'app-container'}>
      {SidebarComponent && <SidebarComponent />}
      <div className={isLoginPage ? 'login-content' : 'main-content'}>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<PublicDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/public" element={<PublicDashboard />} />
          <Route path="/booking" element={<PublicBooking />} />
          <Route path="/courts-public" element={<CourtsPublic />} />
          <Route path="/events-public" element={<EventsPublic />} />

          {/* Customer Routes (Protected) */}
          <Route path="/reservation" element={<RequireAuth role="customer"><Reservation /></RequireAuth>} />

          {/* Admin Routes (Protected) */}
          <Route path="/dashboard" element={<RequireAuth role="admin"><Dashboard /></RequireAuth>} />
          <Route path="/courts" element={<RequireAuth role="admin"><Courts /></RequireAuth>} />
          <Route path="/events" element={<RequireAuth role="admin"><Events /></RequireAuth>} />
          <Route path="/applications" element={<RequireAuth role="admin"><Applications /></RequireAuth>} />
          <Route path="/reports" element={<RequireAuth role="admin"><Reports /></RequireAuth>} />
          <Route path="/users" element={<RequireAuth role="admin"><Users /></RequireAuth>} />
          <Route path="/database" element={<RequireAuth role="admin"><DatabaseViewer /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth role="admin"><Settings /></RequireAuth>} />

          {/* Owner Routes (Protected) */}
          <Route path="/owner/dashboard" element={<RequireAuth role="owner"><OwnerDashboard /></RequireAuth>} />
        </Routes>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;