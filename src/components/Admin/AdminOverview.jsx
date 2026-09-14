import React, { useEffect, useState } from 'react';
import { collection, getCountFromServer, getDocs } from 'firebase/firestore';
import { FiDatabase, FiUsers, FiMapPin, FiShield, FiFileText, FiRadio } from 'react-icons/fi';
import { firestore } from '../../lib/firebase';
import AdminOverviewSkeleton from './skeletons/AdminOverviewSkeleton';

const AdminOverview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const schoolsSnapshot = await getDocs(collection(firestore, 'schools'));
        const schoolDocs = schoolsSnapshot.docs;

        let totalStudents = 0;
        const regions = new Set();

        await Promise.all(
          schoolDocs.map(async (schoolDoc) => {
            const schoolData = schoolDoc.data();
            const udise = String(schoolData.udiseNumber || schoolDoc.id);

            if (schoolData.district) {
              regions.add(String(schoolData.district));
            }

            const rosterRef = collection(firestore, 'students', udise, 'roster');
            const studentCountSnapshot = await getCountFromServer(rosterRef);
            totalStudents += studentCountSnapshot.data().count || 0;
          }),
        );

        if (!isMounted) return;

        setStats([
          { title: 'Total Schools', value: String(schoolDocs.length), icon: <FiDatabase className="w-6 h-6 text-blue-700" />, theme: 'bg-blue-200' },
          { title: 'Total Students', value: totalStudents.toLocaleString('en-IN'), icon: <FiUsers className="w-6 h-6 text-blue-700" />, theme: 'bg-white' },
          { title: 'Active Regions', value: '3 / 3', icon: <FiMapPin className="w-6 h-6 text-blue-700" />, theme: 'bg-white' },
        ]);
      } catch (error) {
        console.error('Failed to load admin overview stats:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <AdminOverviewSkeleton />;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Global Overview</h2>
          <p className="text-slate-600 font-medium">Monitor real registrations and examination metrics from Firestore.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm">
            <FiFileText className="w-4 h-4" />
            <span>Export Master Data</span>
          </button>
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md">
            <FiRadio className="w-4 h-4" />
            <span>Broadcast Update</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className={`relative rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden ${stat.theme}`}>
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-6 flex items-center justify-between min-h-[132px]">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-600 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-extrabold text-slate-900 break-words">{stat.value}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/80 border border-white shadow-sm flex items-center justify-center flex-shrink-0 ml-4">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminOverview;