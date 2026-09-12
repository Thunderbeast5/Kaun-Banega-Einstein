import React from 'react';
import { signOut } from 'firebase/auth';
import { FiGrid, FiUserPlus, FiFileText, FiInfo, FiLogOut ,FiCalendar , FiUsers} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';

const DashboardSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'home', label: 'Dashboard Home', icon: <FiGrid className="w-5 h-5" /> },
    { id: 'register', label: 'Register Students', icon: <FiUserPlus className="w-5 h-5" /> },
    { id: 'view-students', label: 'View Students', icon: <FiUsers className="w-5 h-5"/> },
    { id: 'tickets', label: 'Hall Tickets', icon: <FiFileText className="w-5 h-5" /> },
    { id: 'schedule', label: 'Schedule', icon: <FiCalendar className="w-5 h-5"/> },
    { id: 'details', label: 'School Details', icon: <FiInfo className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-white/60 backdrop-blur-md border-r border-slate-200 hidden md:flex flex-col py-8 px-4 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-700 text-white shadow-md translate-x-1' 
                  : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={async () => {
          await signOut(auth);
          navigate('/');
        }}
        className="mt-auto flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
      >
        <FiLogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default DashboardSidebar;