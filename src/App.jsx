import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthSelection from './pages/AuthSelection';
import SchoolLogin from './pages/SchoolLogin';
import SchoolRegistration from './pages/SchoolRegisteration';
import SchoolDashboard from './pages/SchoolDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Results from './pages/Results'
import CertificatePortal from './pages/CertificatePortal';
import StudentRegistration from './pages/StudentRegistration';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import { auth, firestore } from './lib/firebase';

function ProtectedRoute({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsCheckingAuth(false);
        return;
      }
      try {
        const studentDoc = await getDoc(doc(firestore, 'individual_students', user.uid));
        if (studentDoc.exists()) {
          setRedirectPath('/student/dashboard');
        } else {
          const adminDoc = await getDoc(doc(firestore, 'admins', user.uid));
          if (adminDoc.exists()) {
            setRedirectPath('/admin');
          }
        }
      } catch (e) {
        console.error(e);
      }
      setCurrentUser(user);
      setIsCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!currentUser) return <Navigate to="/login" replace />;
  if (redirectPath) return <Navigate to={redirectPath} replace />;
  
  return children;
}

// Only lets through users whose UID exists in the Firestore 'admins' collection.
function AdminProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking'); // 'checking' | 'authorized' | 'unauthorized'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus('unauthorized');
        return;
      }
      try {
        const adminDoc = await getDoc(doc(firestore, 'admins', user.uid));
        setStatus(adminDoc.exists() ? 'authorized' : 'unauthorized');
      } catch {
        setStatus('unauthorized');
      }
    });
    return unsubscribe;
  }, []);

  if (status === 'checking') {
    return <div className="min-h-screen bg-slate-50" aria-label="Verifying admin access" />;
  }

  return status === 'authorized' ? children : <Navigate to="/admin/login" replace />;
}

// Only lets through individual students
function StudentProtectedRoute({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsCheckingAuth(false);
        return;
      }
      try {
        const studentDoc = await getDoc(doc(firestore, 'individual_students', user.uid));
        if (!studentDoc.exists()) {
          const adminDoc = await getDoc(doc(firestore, 'admins', user.uid));
          if (adminDoc.exists()) {
            setRedirectPath('/admin');
          } else {
            setRedirectPath('/dashboard');
          }
        }
      } catch (e) {
        console.error(e);
      }
      setCurrentUser(user);
      setIsCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!currentUser) return <Navigate to="/student/login" replace />;
  if (redirectPath) return <Navigate to={redirectPath} replace />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthSelection />} />
        <Route path="/login" element={<SchoolLogin />} />
        <Route path="/register" element={<SchoolRegistration />} />
        <Route path="/student/register" element={<StudentRegistration />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/results" element={<Results />} />
        <Route path="/certificate" element={<CertificatePortal />} />
        <Route path="/dashboard" element={<ProtectedRoute><SchoolDashboard /></ProtectedRoute>} />
        <Route path="/student/dashboard" element={<StudentProtectedRoute><StudentDashboard /></StudentProtectedRoute>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}