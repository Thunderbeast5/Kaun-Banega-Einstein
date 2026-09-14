import React from 'react';

const AdminControls = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Platform Controls</h2>
        <p className="text-slate-600 font-medium">Manage examination phases and external modules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Registration Toggles */}
        <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-100 overflow-hidden">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          <div className="relative z-10 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-white/50 pb-4">Lifecycle Management</h3>
            
            <div className="space-y-4">
              <div className="bg-white/60 border border-white p-5 rounded-2xl flex items-center justify-between shadow-sm hover:bg-white transition-colors cursor-pointer">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">System Registrations</h4>
                  <p className="text-xs text-slate-600 font-medium mt-1">Currently accepting new schools.</p>
                </div>
                <div className="w-12 h-7 bg-blue-600 rounded-full relative flex items-center p-1 shadow-inner">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-1 shadow-sm"></div>
                </div>
              </div>

              <div className="bg-white/60 border border-white p-5 rounded-2xl flex items-center justify-between shadow-sm hover:bg-white transition-colors cursor-pointer">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Hall Ticket Generation</h4>
                  <p className="text-xs text-slate-600 font-medium mt-1">Locked until registration closes.</p>
                </div>
                <div className="w-12 h-7 bg-slate-300 rounded-full relative flex items-center p-1 shadow-inner">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-1 shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* External Modules */}
        <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-700 overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600 rounded-full blur-2xl z-0" />
          <div className="relative z-10 p-8 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-2xl font-extrabold text-white mb-2">Rocket Launch Module</h3>
              <p className="text-blue-100 font-medium leading-relaxed mb-6 text-sm">
                Manage separate registrations and input physical evaluation scores for the specialized practical event.
              </p>
            </div>
            
            <button className="w-full py-4 rounded-xl bg-white text-blue-800 font-bold hover:bg-blue-50 transition-colors shadow-md">
              Launch Module Portal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminControls;