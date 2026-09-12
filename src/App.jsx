import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthSelection from './pages/AuthSelection';
import SchoolLogin from './pages/SchoolLogin';
import SchoolRegistration from './pages/SchoolRegisteration';
import SchoolDashboard from './pages/SchoolDashboard';
import { auth } from './lib/firebase';

function ProtectedRoute({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-slate-50" aria-label="Checking authentication" />;
  }

  return currentUser ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthSelection />} />
        <Route path="/login" element={<SchoolLogin />} />
        <Route path="/register" element={<SchoolRegistration />} />
        <Route path="/dashboard" element={<ProtectedRoute><SchoolDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}