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
import VenueAppealForm from './pages/VenueAppealForm';
import VenueAppeals from './pages/VenueAppeals';
import Booking from './pages/Booking';
import Payments from './pages/Payments';
import './styles.css';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isPublicPage = location.pathname === '/' || location.pathname === '/public' || location.pathname === '/courts' || location.pathname === '/events' || location.pathname === '/booking';
  const isOwnerPage = location.pathname.startsWith('/owner/');

  return (
    <div className={isLoginPage ? 'login-page' : 'app-container'}>
      {!isLoginPage && (isPublicPage ? <PublicSidebar /> : isOwnerPage ? <OwnerSidebar /> : <Sidebar />)}
      <div className={isLoginPage ? 'login-content' : 'main-content'}>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<PublicDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/public" element={<PublicDashboard />} />
          <Route path="/courts" element={<Courts />} />
          <Route path="/events" element={<Events />} />
          <Route path="/booking" element={<Booking />} />

          {/* Admin Routes (Protected) */}
          <Route path="/dashboard" element={<RequireAuth role="admin"><Dashboard /></RequireAuth>} />
          <Route path="/admin/courts" element={<RequireAuth role="admin"><Courts /></RequireAuth>} />
          <Route path="/admin/events" element={<RequireAuth role="admin"><Events /></RequireAuth>} />
          <Route path="/applications" element={<RequireAuth role="admin"><Applications /></RequireAuth>} />
          <Route path="/venue-appeals" element={<RequireAuth role="admin"><VenueAppeals /></RequireAuth>} />
          <Route path="/payments" element={<RequireAuth role="admin"><Payments /></RequireAuth>} />
          <Route path="/reports" element={<RequireAuth role="admin"><Reports /></RequireAuth>} />
          <Route path="/users" element={<RequireAuth role="admin"><Users /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth role="admin"><Settings /></RequireAuth>} />

          {/* Owner Routes (Protected) */}
          <Route path="/owner/dashboard" element={<RequireAuth role="owner"><OwnerDashboard /></RequireAuth>} />
          <Route path="/owner/courts" element={<RequireAuth role="owner"><Courts /></RequireAuth>} />
          <Route path="/owner/events" element={<RequireAuth role="owner"><Events /></RequireAuth>} />
          <Route path="/owner/venue-appeal" element={<RequireAuth role="owner"><VenueAppealForm /></RequireAuth>} />
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