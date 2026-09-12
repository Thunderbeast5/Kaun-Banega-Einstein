import React, { useState, useEffect } from 'react';
import { FiDownload, FiCheckCircle } from 'react-icons/fi';
import HallTicketsSkeleton from './skeletons/HallTicketsSkeleton';

const HallTickets = ({ loading: externalLoading }) => {
  const [loading, setLoading] = useState(externalLoading ?? true);

  useEffect(() => {
    // Simulate async ticket data fetch
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <HallTicketsSkeleton />;
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Hall Tickets</h2>
          <p className="text-slate-600 font-medium">Download individual or bulk examination tickets.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 transition-all shadow-md">
          <FiDownload className="w-5 h-5" />
          <span>Download All Tickets</span>
        </button>
      </div>

      <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
        <div className="relative z-10 p-6 sm:p-8">
          
          {/* Status Alert */}
          <div className="flex items-center gap-3 bg-green-100/80 border border-green-200 text-green-800 p-4 rounded-xl mb-6 shadow-sm">
            <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">Generation Complete. 142 tickets are ready for download.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200/60">
                  <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                  <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Reg ID</th>
                  <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</th>
                  <th className="pb-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[1, 2, 3].map((item) => (
                  <tr key={item} className="border-b border-slate-200/40 hover:bg-white/40 transition-colors">
                    <td className="py-4 font-bold text-slate-900">Student Name {item}</td>
                    <td className="py-4 font-mono font-medium text-slate-600">KBE-00{item}</td>
                    <td className="py-4 text-slate-600 font-medium">10th</td>
                    <td className="py-4 text-right">
                      <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-blue-700 font-bold hover:bg-blue-50 transition-colors text-xs shadow-sm">
                        <FiDownload className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HallTickets;