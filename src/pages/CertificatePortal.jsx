import React, { useState, useRef } from 'react';
import { 
  FiSearch, 
  FiCalendar, 
  FiAlertCircle,
  FiLoader,
  FiCheckCircle
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import GenerateCertificate from '../components/GenerateCertificate';
import { collectionGroup, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

const CertificatePortal = () => {
  const [formData, setFormData] = useState({ id: '', dob: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [studentData, setStudentData] = useState(null);
  const certificateRef = useRef();

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const q = query(
        collectionGroup(firestore, 'roster'),
        where('applicationNumber', '==', formData.id.trim().toUpperCase()),
        where('dob', '==', formData.dob)
      );
      
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const studentDoc = snapshot.docs[0].data();
        setStudentData({
          name: studentDoc.name,
          school: studentDoc.schoolName,
          rank: studentDoc.rank || 'Participant',
          score: studentDoc.score || 'N/A',
          applicationNumber: studentDoc.applicationNumber
        });
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Error fetching student:", error);
      setStatus('error');
    }
  };

  return (
    <>
      <Navbar forceDarkText={true} />
      {/* Adjusted padding for mobile (py-16) to desktop (py-24) */}
      <main className="relative min-h-screen bg-slate-50 overflow-hidden py-16 lg:py-24 z-0 font-sans flex items-center">
        
        {/* Ambient Background Blurs */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-10 left-10 w-[20rem] md:w-[30rem] lg:w-[40rem] h-[20rem] md:h-[30rem] lg:h-[40rem] bg-blue-400/20 rounded-full blur-[80px] lg:blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-[15rem] md:w-[25rem] lg:w-[30rem] h-[15rem] md:h-[25rem] lg:h-[30rem] bg-cyan-400/20 rounded-full blur-[80px] lg:blur-[100px]" />
        </div>

        {/* Responsive horizontal padding */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* ========================================================= */}
          {/* VIEW 1: SEARCH FORM                                       */}
          {/* ========================================================= */}
          {status !== 'success' && (
            <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
              <div className="text-center mb-8 md:mb-10">
                {/* Scaled typography for mobile */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                  Download Certificate
                </h1>
                <p className="text-sm md:text-base text-slate-600 font-medium px-2">
                  Enter your application details to securely access and download your official KBE 2026 certificate.
                </p>
              </div>

              <div className="group relative rounded-[1.5rem] md:rounded-[2rem] border border-white/60 shadow-xl overflow-hidden bg-blue-200">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
                
                {/* Scaled internal padding */}
                <div className="relative z-10 p-6 sm:p-8 md:p-10">
                  <form onSubmit={handleSearch} className="flex flex-col gap-5 md:gap-6">
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-xs sm:text-sm font-bold text-slate-800 ml-1">Application / Roll Number</label>
                      <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="text" 
                          name="id"
                          value={formData.id}
                          onChange={handleInput}
                          placeholder="e.g. KBE-26-0123" 
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm font-medium uppercase"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs sm:text-sm font-bold text-slate-800 ml-1">Date of Birth</label>
                      <div className="relative">
                        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="date" 
                          name="dob"
                          value={formData.dob}
                          onChange={handleInput}
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm font-medium"
                        />
                      </div>
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 mt-2">
                        <FiAlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-xs sm:text-sm font-bold">Invalid credentials. Please check your ID and Date of Birth.</p>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="w-full mt-2 sm:mt-4 py-3.5 sm:py-4 rounded-full bg-blue-700 text-white text-sm sm:text-base font-bold hover:bg-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {status === 'loading' ? (
                        <>
                          <FiLoader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Access Certificate</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: CERTIFICATE PREVIEW & DOWNLOAD                    */}
          {/* ========================================================= */}
          {status === 'success' && studentData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full flex flex-col items-center">
            <div className="w-full pb-6">
              <GenerateCertificate 
                studentData={studentData} 
                onBack={() => setStatus('idle')} 
              />
            </div>
          </div>
        )}

        </div>
      </main>
    </>
  );
};

export default CertificatePortal;