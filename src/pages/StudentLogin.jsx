import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../assets/stud.webp';
import { auth } from '../lib/firebase';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginMessage('');

    const formData = Object.fromEntries(new FormData(event.currentTarget));
    setIsSubmitting(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/student/dashboard', { state: { uid: userCredential.user.uid } });
    } catch (error) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
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
        to="/auth" 
        aria-label="Back to account options" 
        title="Back to account options" 
        className="fixed left-6 top-6 z-50 inline-flex rounded-full p-3 bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white hover:text-indigo-700 transition-colors shadow-md"
      >
        <FiArrowLeft className="w-5 h-5" />
      </Link>

      {/* Left Half: Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${loginImage})` }}
        />
        {/* Subtle overlay to blend the image tone slightly */}
        <div className="absolute inset-0 bg-indigo-900/10" />
      </div>

      {/* Right Half: Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative py-24 px-6 lg:px-16">
        
        {/* Ambient Background Blur */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-400/10 rounded-full blur-[100px]" />
        </div>

        {/* Clean Login Form */}
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Student Login</h1>
            <p className="text-slate-600 font-medium text-base mt-3">Access your individual dashboard</p>
          </div>

        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-800 ml-1">Email Address</label>
            <input 
              name="email"
              type="email" 
              placeholder="Enter your email" 
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm font-medium"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-800 ml-1">Password</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••" 
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm font-medium"
            />
          </div>

          {loginMessage && <p role="alert" className="text-sm font-semibold text-red-700">{loginMessage}</p>}

          <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-full bg-indigo-700 text-white font-bold hover:bg-indigo-800 transition-all shadow-md hover:shadow-lg mt-4 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="flex justify-end items-center px-1">
          <a href="#" className="text-sm font-bold text-indigo-700 hover:text-indigo-800 transition-colors">Forgot Password?</a>
        </div>

        <p className="text-center mt-12 text-sm text-slate-600 font-medium">
          Not registered yet? <Link to="/student/register" className="text-indigo-700 font-bold hover:underline">Register Here</Link>
        </p>
      </div>

      </div>
    </main>
  );
};

export default StudentLogin;
