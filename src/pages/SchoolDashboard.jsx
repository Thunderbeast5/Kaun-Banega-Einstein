import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import DashboardSidebar from '../components/Dashboard/DashboardSidebar';
import DashboardHome from '../components/Dashboard/DashboardHome';
import RegisterStudents from '../components/Dashboard/RegisterStudents';
import HallTickets from '../components/Dashboard/HallTickets';
import SchoolDetails from '../components/Dashboard/SchoolDetails';
import DashboardSchedule from '../components/Dashboard/DashboardSchedule';
import ViewStudents from '../components/Dashboard/ViewStudents';
import DashboardLayoutSkeleton from '../components/Dashboard/skeletons/DashboardLayoutSkeleton';
import { auth, firestore } from '../lib/firebase';

const SchoolDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const schoolQuery = query(
          collection(firestore, 'schools'),
          where('authUid', '==', user.uid),
        );
        const schoolSnapshot = await getDocs(schoolQuery);

        if (!schoolSnapshot.empty && isMounted) {
          const school = schoolSnapshot.docs[0].data();
          setSchoolInfo({
            ...school,
            name: school.schoolName,
            udise: school.udiseNumber,
          });
        } else if (isMounted) {
          setDashboardError('Your school profile could not be found.');
        }
      } catch (error) {
        if (isMounted) setDashboardError(error.message || 'Could not load school data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome schoolInfo={schoolInfo} />;
      case 'register':
        return <RegisterStudents schoolInfo={schoolInfo} />;
      case 'tickets':
        return <HallTickets />;
      case 'details':
        return <SchoolDetails schoolInfo={schoolInfo} />;
      case 'schedule':
        return <DashboardSchedule />;
      case 'view-students':
        return <ViewStudents schoolInfo={schoolInfo} />;
      default:
        return <DashboardHome />;
    }
  };

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (dashboardError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 text-center">
        <p className="max-w-md text-sm font-semibold text-red-700" role="alert">
          {dashboardError}
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-manrope overflow-hidden">
      {/* Top Header */}
      <DashboardHeader schoolInfo={schoolInfo} />

      <div className="flex-1 flex overflow-hidden relative z-0">
        {/* Ambient Background Blurs for the whole dashboard body */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-10 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-[100px]" />
        </div>

        {/* Left Sidebar */}
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto pb-20">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SchoolDashboard;