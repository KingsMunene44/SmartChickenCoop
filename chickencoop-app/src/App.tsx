// src/App.tsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './hooks/useAuth';
import { ReactNode } from 'react';
import AppRoutes from './routes/AppRoutes';
import useMQTTSubscriptions from './hooks/useMQTTSubscriptions';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/" />;
}

function App() {
  useMQTTSubscriptions(); // Auto-syncs MQTT → Zustand
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes for dashboard + all coop pages */}
        <Route path="/dashboard/*" element={
          <PrivateRoute><AppRoutes /></PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;