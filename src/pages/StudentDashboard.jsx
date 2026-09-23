import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../lib/firebase';
import HallTicket from '../components/HallTicket';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        navigate('/student/login');
        return;
      }

      try {
        // Fetch student details
        const studentDoc = await getDoc(doc(firestore, 'individual_students', user.uid));
        if (studentDoc.exists()) {
          const data = studentDoc.data();
          setStudentData(data);
        }

        // Check if hall tickets are published
        const settingsDoc = await getDoc(doc(firestore, 'settings', 'individual_controls'));
        if (settingsDoc.exists()) {
          setIsPublished(settingsDoc.data().hallTicketPublished === true);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <p className="text-slate-600 font-bold">Could not load your profile.</p>
        <button onClick={handleLogout} className="text-indigo-700 font-bold hover:underline">Log Out</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-manrope">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
            <FiUser className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Welcome, {studentData.name}</h1>
            <p className="text-xs font-medium text-slate-500">{studentData.applicationNumber}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-bold text-sm transition-colors bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-full"
        >
          <FiLogOut className="w-4 h-4" />
          Log Out
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-10 right-10 w-[40rem] h-[40rem] bg-indigo-400/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-[40rem] h-[40rem] bg-purple-400/10 rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-7xl mx-auto">
          {isPublished ? (
            <HallTicket studentData={studentData} />
          ) : (
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-10 text-center max-w-2xl mx-auto mt-10">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiUser className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Hall Ticket Not Available</h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                Your registration is complete, but hall tickets have not yet been published by the administration. Please check back later.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
