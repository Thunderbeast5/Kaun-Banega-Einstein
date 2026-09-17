import React, { useState, useRef } from 'react';
import { 
  FiSearch, 
  FiCalendar, 
  FiDownload, 
  FiAward, 
  FiArrowLeft,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle
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

  // Trigger browser print dialog tailored for A4 Landscape
  const handleDownload = () => {
    const printContent = certificateRef.current;
    const windowPrint = window.open('', '', 'width=1100,height=800');
    windowPrint.document.write(`
      <html>
        <head>
          <title>KBE Certificate - ${studentData?.name || 'Student'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: A4 landscape; margin: 0; }
            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          </style>
        </head>
        <body class="bg-white flex justify-center items-center h-screen">
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    windowPrint.document.close();
    windowPrint.focus();
    
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
    }, 500);
  };

  return (
    <>
      <Navbar forceDarkText={true} />
      <main className="relative min-h-screen bg-slate-50 overflow-hidden py-24 z-0 font-sans flex items-center">
      
      {/* Ambient Background Blurs */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-[40rem] h-[40rem] bg-blue-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-cyan-400/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-12">
        
        {/* ========================================================= */}
        {/* VIEW 1: SEARCH FORM                                       */}
        {/* ========================================================= */}
        {status !== 'success' && (
          <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Download Certificate
              </h1>
              <p className="text-slate-600 font-medium">
                Enter your application details to securely access and download your official KBE 2026 certificate.
              </p>
            </div>

            <div className="group relative rounded-[2rem] border border-white/60 shadow-xl overflow-hidden bg-blue-200">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
              
              <div className="relative z-10 p-8 sm:p-10">
                <form onSubmit={handleSearch} className="flex flex-col gap-6">
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-800 ml-1">Application / Roll Number</label>
                    <div className="relative">
                      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="text" 
                        name="id"
                        value={formData.id}
                        onChange={handleInput}
                        placeholder="e.g. KBE-26-0123" 
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm font-medium uppercase"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-800 ml-1">Date of Birth</label>
                    <div className="relative">
                      <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input 
                        type="date" 
                        name="dob"
                        value={formData.dob}
                        onChange={handleInput}
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm font-medium"
                      />
                    </div>
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 mt-2">
                      <FiAlertCircle className="w-5 h-5 shrink-0" />
                      <p className="text-sm font-bold">Invalid credentials. Please check your ID and Date of Birth.</p>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full mt-4 py-4 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {status === 'loading' ? (
                      <>
                        {/* <FiLoader className="w-5 h-5 animate-spin" /> */}
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        {/* <FiCheckCircle className="w-5 h-5" /> */}
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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
            <GenerateCertificate studentData={studentData} onBack={() => setStatus('idle')} />
          </div>
        )}

      </div>
      </main>
    </>
  );
};

export default CertificatePortal;