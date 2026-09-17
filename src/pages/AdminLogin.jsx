import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FiArrowLeft, FiShield } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../assets/login.webp';
import { auth, firestore } from '../lib/firebase';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginMessage('');

    const formData = Object.fromEntries(new FormData(event.currentTarget));
    setIsSubmitting(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.adminEmail,
        formData.password,
      );

      // Verify the user is an admin
      const adminDoc = await getDoc(
        doc(firestore, 'admins', userCredential.user.uid),
      );

      if (!adminDoc.exists()) {
        await auth.signOut();
        setLoginMessage('Access denied. You are not an authorized admin.');
        setIsSubmitting(false);
        return;
      }

      navigate('/admin/dashboard');
    } catch (error) {
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password'
      ) {
        setLoginMessage('The email or password is incorrect.');
      } else {
        setLoginMessage(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen flex bg-slate-50 overflow-hidden z-0">

      {/* Back Button */}
      <Link
        to="/"
        aria-label="Back to home"
        title="Back to home"
        className="fixed left-6 top-6 z-50 inline-flex rounded-full p-3 bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white hover:text-blue-700 transition-colors shadow-md"
      >
        <FiArrowLeft className="w-5 h-5" />
      </Link>

      {/* Left Half: Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${loginImage})` }}
        />
        <div className="absolute inset-0 bg-blue-900/10" />
      </div>

      {/* Right Half: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative py-24 px-6 lg:px-16">

        {/* Ambient Background Blur */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-400/10 rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-md">
          {/* Admin badge */}
          {/* <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold">
              <FiShield className="w-4 h-4" />
              <span>Admin Portal</span>
            </div>
          </div> */}

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Admin Login
            </h1>
            <p className="text-slate-600 font-medium text-base mt-3">
              Authorized personnel only
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-800 ml-1">
                Admin Email
              </label>
              <input
                id="admin-email"
                name="adminEmail"
                type="email"
                placeholder="Enter admin email"
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm font-medium"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-800 ml-1">
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm font-medium"
              />
            </div>

            {loginMessage && (
              <p role="alert" className="text-sm font-semibold text-red-700">
                {loginMessage}
              </p>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 transition-all shadow-md hover:shadow-lg mt-4 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Verifying...' : 'Login to Admin Portal'}
            </button>
          </form>

          <p className="text-center mt-12 text-xs text-slate-400 font-medium">
            This portal is restricted to KBE administrators only.
          </p>
        </div>
      </div>
    </main>
  );
};

export default AdminLogin;
