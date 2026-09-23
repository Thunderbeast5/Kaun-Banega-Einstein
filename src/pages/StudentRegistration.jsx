import { useState } from 'react';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FiArrowLeft, FiCheckCircle, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../lib/firebase';

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegistration = async (event) => {
    event.preventDefault();
    setSubmitMessage('');

    const formData = Object.fromEntries(new FormData(event.currentTarget));

    if (formData.password !== formData.confirmPassword) {
      setSubmitMessage('Password and confirm password must match.');
      return;
    }

    setIsSubmitting(true);
    let createdUser;
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      createdUser = userCredential.user;

      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      const appNumber = `IND-26-${randomDigits}`;

      const studentReference = doc(firestore, 'individual_students', createdUser.uid);

      await setDoc(studentReference, {
        name: formData.studentName,
        standard: formData.standard,
        school: formData.schoolName, // Using 'school' to match HallTicket.jsx
        phone: formData.phone,
        email: formData.email,
        applicationNumber: appNumber,
        createdAt: serverTimestamp(),
      });

      navigate('/student/dashboard', { state: { uid: createdUser.uid } });
    } catch (error) {
      if (createdUser) {
        await deleteUser(createdUser).catch(() => undefined);
      }

      if (error.code === 'auth/email-already-in-use') {
        setSubmitMessage('This email is already registered.');
      } else {
        setSubmitMessage(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-50 overflow-hidden py-24 z-0">
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-400/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-purple-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <Link to="/auth" aria-label="Back to account options" title="Back to account options" className="fixed left-6 top-6 z-50 inline-flex rounded-full p-3 text-slate-700 hover:bg-white hover:text-indigo-700 transition-colors shadow-sm">
          <FiArrowLeft className="w-5 h-5" />
        </Link>

        
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Student Registration</h1>
          <p className="text-slate-600 font-medium">Register independently to participate in KBE.</p>
        </div>

        <form onSubmit={handleRegistration} className="space-y-8">
          
          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-indigo-100 overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-8 md:p-10">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-white/40 pb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField name="studentName" label="Full Name" type="text" placeholder="Your full name" required />
                
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm font-bold text-slate-800 ml-1">Standard</label>
                  <select name="standard" required className="w-full bg-white/60 border border-white rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-sm font-medium">
                    <option value="">Select standard</option>
                    <option value="9th Grade">9th Grade</option>
                    <option value="10th Grade">10th Grade</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <InputField name="schoolName" label="School Name" type="text" placeholder="Name of your school" required />
                </div>
                
                <InputField name="phone" label="Mobile Number" type="tel" placeholder="+91" required />
                <InputField name="email" label="Email Address" type="email" placeholder="your@email.com" required />
              </div>
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-indigo-50 overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-8 md:p-10">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-white/40 pb-4">Account Security</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <InputField name="password" label="Password" type="password" placeholder="Create a strong password" required />
                <InputField name="confirmPassword" label="Confirm Password" type="password" placeholder="Repeat password" required />
              </div>

              <div className="bg-white/60 border border-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                
                <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-10 py-4 rounded-full bg-indigo-700 text-white font-bold hover:bg-indigo-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60">
                  <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
                  <FiCheckCircle className="w-5 h-5" />
                </button>
              </div>
              {submitMessage && <p role="alert" className="mt-4 text-center text-sm font-semibold text-red-700">{submitMessage}</p>}

            </div>
          </div>

        </form>
      </div>
    </main>
  );
};

const InputField = ({ label, type, placeholder, required = false, ...inputProps }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm font-bold text-slate-800 ml-1">{label}</label>
    <input 
      type={type} 
      placeholder={placeholder} 
      required={required}
      {...inputProps}
      className="w-full bg-white/60 border border-white rounded-xl px-4 py-3 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-sm font-medium"
    />
  </div>
);

export default StudentRegistration;
