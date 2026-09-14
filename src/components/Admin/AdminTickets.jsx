import { useState } from 'react';
import { FiCheckCircle, FiClock, FiFileText, FiEye, FiX } from 'react-icons/fi';
import HallTicket from '../HallTicket';

const AdminTickets = () => {
  const [showPreview, setShowPreview] = useState(false);

  const demoStudent = {
    name: 'Aarav Sharma',
    school: 'Saraswati Vidyalaya',
    standard: '10th Grade',
    rollNo: '45-A',
    applicationNumber: 'KBE-26-0001',
  };

  const ticketData = [
    { id: '27201100501', name: 'Saraswati Vidyalaya', region: 'Niphad', count: 142, status: 'Generated' },
    { id: '27201100502', name: 'Karmaveer Kakasaheb Wagh School', region: 'Chandwad', count: 210, status: 'Generated' },
    { id: '27201100503', name: 'Janta English School', region: 'Dindori', count: 95, status: 'Pending' },
    { id: '27201100504', name: 'Nutan Vidyalaya', region: 'Niphad', count: 118, status: 'Generated' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Hall Tickets Master</h2>
          <p className="text-slate-600 font-medium">Manage and generate examination admit cards for all districts.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md"
          >
            <FiEye className="w-4 h-4" />
            <span>Preview Sample Ticket</span>
          </button>
          <button type="button" className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm">
            <FiCheckCircle className="w-4 h-4" />
            <span>Generate Pending Tickets</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-100 overflow-hidden">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          <div className="relative z-10 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-600 mb-1">Total Eligible</p>
              <h3 className="text-2xl font-extrabold text-slate-900">3,245</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center text-blue-700 shadow-sm">
              <FiFileText className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-green-100 overflow-hidden">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          <div className="relative z-10 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-600 mb-1">Tickets Generated</p>
              <h3 className="text-2xl font-extrabold text-slate-900">2,850</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center text-green-700 shadow-sm">
              <FiCheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-amber-100 overflow-hidden">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          <div className="relative z-10 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-600 mb-1">Pending Generation</p>
              <h3 className="text-2xl font-extrabold text-slate-900">395</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center text-amber-700 shadow-sm">
              <FiClock className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
        <div className="relative z-10 p-4 sm:p-8">
          
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">School Details</th>
                  <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Region</th>
                  <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tickets</th>
                  <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {ticketData.map((school, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-900">{school.name}</p>
                      <p className="font-mono text-xs text-slate-500 mt-0.5">UDISE: {school.id}</p>
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-700">{school.region}</td>
                    <td className="py-4 px-5 font-bold text-slate-900">{school.count}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        school.status === 'Generated' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {school.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button 
                        type="button"
                        onClick={() => school.status === 'Generated' && setShowPreview(true)}
                        disabled={school.status === 'Pending'}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-blue-700 font-bold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs shadow-sm"
                      >
                        <FiEye className="w-3 h-3" />
                        <span>Preview PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label="Hall ticket preview">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg hover:bg-slate-100"
            aria-label="Close hall ticket preview"
          >
            <FiX className="h-5 w-5" />
          </button>
          <div className="h-full overflow-y-auto rounded-2xl bg-slate-100">
            <HallTicket studentData={demoStudent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;