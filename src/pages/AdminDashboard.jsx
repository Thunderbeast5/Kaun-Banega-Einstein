import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

import AdminHeader from '../components/Admin/AdminHeader';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminOverview from '../components/Admin/AdminOverview';
import AdminApprovals from '../components/Admin/AdminApprovals';
import AdminControls from '../components/Admin/AdminControls';
import AdminTickets from '../components/Admin/AdminTickets';
import AdminResults from '../components/Admin/AdminResults';
import AdminBroadcast from '../components/Admin/AdminBroadcast';
import AdminDashboardSkeleton from '../components/Admin/skeletons/AdminDashboardSkeleton';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Handle auth verification here
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview setActiveTab={setActiveTab} />;
      case 'registrations':
        return <AdminApprovals />;
      case 'controls':
        return <AdminControls />;
    case 'tickets':
        return <AdminTickets />;
    case 'results':
        return <AdminResults />;
      case 'broadcast':
        return <AdminBroadcast />;
      default:
        return <AdminOverview />;
    }
  };

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-manrope overflow-hidden z-0">
      
      {/* Top Header */}
      <AdminHeader />

      <div className="flex-1 flex overflow-hidden relative z-0">
        
        {/* Ambient Background Blurs for Dashboard Body */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-10 right-10 w-[40rem] h-[40rem] bg-blue-400/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-[40rem] h-[40rem] bg-cyan-400/10 rounded-full blur-[100px]" />
        </div>

        {/* Left Sidebar */}
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

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

export default AdminDashboard;