import React from 'react';
import { FiAward, FiStar, FiDownload, FiTrendingUp } from 'react-icons/fi';

const AdminResults = () => {
  const topPerformers = [
    { rank: 1, name: 'Aarav Sharma', school: 'Saraswati Vidyalaya', region: 'Niphad', score: 98.5 },
    { rank: 2, name: 'Priya Patel', school: 'Karmaveer Kakasaheb Wagh', region: 'Chandwad', score: 97.2 },
    { rank: 3, name: 'Rohan Desai', school: 'Janta English School', region: 'Dindori', score: 96.8 },
    { rank: 4, name: 'Ananya Singh', school: 'Nutan Vidyalaya', region: 'Niphad', score: 95.5 },
    { rank: 5, name: 'Karan Malhotra', school: 'Saraswati Vidyalaya', region: 'Niphad', score: 94.0 },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Examination Results</h2>
          <p className="text-slate-600 font-medium">Process final scores and manage the ISRO prize winners.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm">
            <FiDownload className="w-4 h-4" />
            <span>Export Full Roster</span>
          </button>
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md">
            <FiTrendingUp className="w-4 h-4" />
            <span>Publish Results</span>
          </button>
        </div>
      </div>

      {/* Grand Prize Winners Showcase */}
      <div className="relative rounded-[2.5rem] border border-amber-200/60 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden mb-8 group">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl z-0 group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-amber-400 border-4 border-white flex items-center justify-center shadow-md shrink-0">
              <FiStar className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-amber-700 font-bold uppercase tracking-wider text-xs mb-2">
                <FiAward className="w-4 h-4" />
                <span>ISRO Trip Finalists</span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900">Top 3 Grand Winners</h3>
              <p className="text-slate-700 font-medium mt-2 max-w-md">
                These students have secured the highest combined scores across both practical and written evaluations.
              </p>
            </div>
          </div>
          
          <button className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all text-sm whitespace-nowrap">
            Generate Winner Certificates
          </button>
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
        <div className="relative z-10 p-4 sm:p-8">
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Global Leaderboard</h3>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">
              Final Stage
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                  <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Details</th>
                  <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">School & Region</th>
                  <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Final Score</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {topPerformers.map((student, i) => (
                  <tr key={i} className={`border-b border-slate-50 transition-colors ${student.rank <= 3 ? 'bg-amber-50/30' : 'hover:bg-slate-50'}`}>
                    <td className="py-4 px-5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${
                        student.rank === 1 ? 'bg-amber-400 text-white shadow-sm' :
                        student.rank === 2 ? 'bg-slate-300 text-slate-700 shadow-sm' :
                        student.rank === 3 ? 'bg-orange-300 text-orange-900 shadow-sm' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {student.rank}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-900">{student.name}</p>
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-semibold text-slate-700">{student.school}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{student.region}</p>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className="font-black text-blue-700 text-lg">{student.score}</span>
                      <span className="text-slate-400 text-xs font-bold ml-1">/ 100</span>
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

export default AdminResults;