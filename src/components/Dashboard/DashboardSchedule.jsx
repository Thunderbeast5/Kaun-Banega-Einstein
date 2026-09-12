import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import DashboardScheduleSkeleton from './skeletons/DashboardScheduleSkeleton';

const DashboardSchedule = ({ loading: externalLoading }) => {
  const [loading, setLoading] = useState(externalLoading ?? true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <DashboardScheduleSkeleton />;
  const timelineEvents = [
    {
      date: 'Sep 01, 2026',
      status: 'completed',
      title: 'Platform Registration Opens',
      description: 'Schools can begin registering their 9th and 10th-grade students on the KBE portal.',
    },
    {
      date: 'Oct 15, 2026',
      status: 'upcoming', // active next milestone
      title: 'Registration Deadline',
      description: 'Final day to add students to the roster. Portal locks at 11:59 PM.',
    },
    {
      date: 'Oct 22, 2026',
      status: 'pending',
      title: 'Hall Tickets Generated',
      description: 'Admit cards will be available for bulk download and printing in the dashboard.',
    },
    {
      date: 'Nov 05, 2026',
      status: 'pending',
      title: 'School Level Examination',
      description: 'Offline written examination conducted simultaneously across all registered schools.',
    },
    {
      date: 'Nov 20, 2026',
      status: 'pending',
      title: 'Results & Finalists Declared',
      description: 'Top students are announced and invited to the central Final Level.',
    },
    {
      date: 'Dec 10, 2026',
      status: 'pending',
      title: 'Final Level & Rocket Launch',
      description: 'Centralized practical and written finals. Ultimate winners selected for the ISRO trip.',
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Schedule & Timeline</h2>
        <p className="text-slate-600 font-medium">Track important dates and upcoming examination milestones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Timeline (Spans 2 columns) */}
        <div className="lg:col-span-2 relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-50 overflow-hidden h-fit">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          <div className="relative z-10 p-6 sm:p-10">
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-blue-200 before:to-transparent">
              
              {timelineEvents.map((event, index) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  
                  {/* Timeline Dot */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${event.status === 'completed' ? 'bg-blue-600' : event.status === 'upcoming' ? 'bg-amber-400 animate-pulse' : 'bg-slate-200'}`}>
                    {event.status === 'completed' ? (
                      <FiCheckCircle className="w-4 h-4 text-white" />
                    ) : event.status === 'upcoming' ? (
                      <FiClock className="w-4 h-4 text-amber-900" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-400" />
                    )}
                  </div>
                  
                  {/* Event Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold uppercase tracking-wider ${event.status === 'completed' ? 'text-blue-600' : event.status === 'upcoming' ? 'text-amber-600' : 'text-slate-400'}`}>
                        {event.date}
                      </span>
                      {event.status === 'upcoming' && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">NEXT</span>
                      )}
                    </div>
                    <h4 className={`text-lg font-bold ${event.status === 'pending' ? 'text-slate-600' : 'text-slate-900'}`}>
                      {event.title}
                    </h4>
                    <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* Right: Next Milestone & Reminders */}
        <div className="flex flex-col gap-6">
          
          {/* Highlight Box */}
          <div className="relative rounded-[2rem] border border-white/60 shadow-md bg-blue-400 overflow-hidden group">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/40 rounded-full -z-10 group-hover:scale-110 transition-transform duration-700 ease-out" />
            
            <div className="relative z-10 p-8">
              <div className="flex items-center gap-2 text-blue-900 font-bold uppercase tracking-wider text-xs mb-4">
                <FiAlertCircle className="w-4 h-4" />
                <span>Urgent Milestone</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2 leading-tight">Registration Deadline</h3>
              <p className="text-slate-800 font-medium mb-6">Oct 15, 2026</p>
              
              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-sm text-slate-900 font-bold mb-1">Time Remaining:</p>
                <div className="flex items-end gap-2 text-blue-800">
                  <span className="text-3xl font-black">33</span>
                  <span className="font-bold mb-1">Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Reminders Box */}
          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-100 overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-8">
              <h3 className="text-lg font-bold text-slate-900 border-b border-white/50 pb-3 mb-4">Action Checklist</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="mt-0.5">
                    <FiCheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 line-through">Complete school registration profile</span>
                </li>
                <li className="flex gap-3">
                  <div className="mt-0.5">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">Upload 9th grade student list</span>
                </li>
                <li className="flex gap-3">
                  <div className="mt-0.5">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">Upload 10th grade student list</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardSchedule;