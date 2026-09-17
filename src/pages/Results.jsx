import React from 'react';
import { FiAward, FiStar, FiMapPin, FiTrendingUp } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const Results = () => {
  // Ordered specifically for the desktop flex layout (2nd, 1st, 3rd)
  // We use Tailwind's `order` utility to ensure 1st place is at the top on mobile.
  const topWinners = [
    { 
      id: 2, 
      rank: 2, 
      name: 'Priya Patel', 
      school: 'Karmaveer Kakasaheb Wagh', 
      marks: '97.2', 
      region: 'Chandwad',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=250&auto=format&fit=crop',
      theme: 'bg-blue-100',
      badgeColor: 'bg-slate-300 text-slate-800'
    },
    { 
      id: 1, 
      rank: 1, 
      name: 'Aarav Sharma', 
      school: 'Saraswati Vidyalaya', 
      marks: '98.5', 
      region: 'Niphad',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=250&auto=format&fit=crop',
      theme: 'bg-gradient-to-br from-amber-200 to-orange-200',
      badgeColor: 'bg-amber-400 text-white'
    },
    { 
      id: 3, 
      rank: 3, 
      name: 'Rohan Desai', 
      school: 'Janta English School', 
      marks: '96.8', 
      region: 'Dindori',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=250&auto=format&fit=crop',
      theme: 'bg-blue-100',
      badgeColor: 'bg-orange-300 text-orange-900'
    },
  ];

  const runnerUps = [
    { rank: 4, name: 'Ananya Singh', school: 'Nutan Vidyalaya', marks: '95.5' },
    { rank: 5, name: 'Karan Malhotra', school: 'Saraswati Vidyalaya', marks: '94.0' },
    { rank: 6, name: 'Neha Joshi', school: 'Janta English School', marks: '93.2' },
  ];

  return (
    <>
      <Navbar forceDarkText={true} />
      <main className="relative min-h-screen bg-slate-50 overflow-hidden py-24 z-0">
      
      {/* Ambient Background Blurs */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] bg-amber-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-blue-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="block italic text-sm font-bold tracking-[0.2em] text-blue-700 uppercase mb-4">
            KBE 2026 Finale
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Meet the Next Einsteins.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
            Celebrating the brightest young minds across our districts who have proven their exceptional scientific curiosity and practical knowledge.
          </p>
        </div>

        {/* Podium Container */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-4 lg:gap-8 mb-16">
          
          {topWinners.map((student) => {
            const isFirst = student.rank === 1;
            
            return (
              <div 
                key={student.id}
                className={`w-full md:w-1/3 group relative rounded-[2rem] border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${student.theme} 
                  ${isFirst ? 'order-1 md:order-2 z-10 md:mb-8 md:scale-105' : 'order-2 md:order-1'}
                  ${student.rank === 3 ? 'order-3 md:order-3' : ''}
                `}
              >
                {/* Frosted Glass Overlay */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
                
                {isFirst && (
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-300/40 rounded-full blur-2xl -z-10" />
                )}

                <div className={`relative z-10 flex flex-col items-center text-center ${isFirst ? 'p-10 lg:p-12' : 'p-8 lg:p-10'}`}>
                  
                  {/* Avatar & Rank Badge */}
                  <div className="relative mb-6">
                    <img 
                      src={student.image} 
                      alt={student.name} 
                      className={`rounded-full object-cover border-4 border-white shadow-md ${isFirst ? 'w-32 h-32' : 'w-24 h-24'}`}
                    />
                    <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg border-2 border-white shadow-sm ${student.badgeColor}`}>
                      {student.rank}
                    </div>
                  </div>

                  {/* Icon for 1st Place */}
                  {isFirst && (
                    <div className="flex items-center gap-2 text-amber-700 font-bold uppercase tracking-widest text-xs mb-3">
                      <FiStar className="w-4 h-4" />
                      <span>Grand Winner</span>
                    </div>
                  )}

                  {/* Student Details */}
                  <h3 className={`font-extrabold text-slate-900 mb-1 tracking-tight ${isFirst ? 'text-3xl' : 'text-2xl'}`}>
                    {student.name}
                  </h3>
                  
                  <p className="text-slate-700 font-bold text-sm mb-1">{student.school}</p>
                  
                  <div className="flex items-center gap-1 text-slate-500 text-xs font-medium uppercase tracking-wider mb-6">
                    <FiMapPin className="w-3 h-3" />
                    <span>{student.region}</span>
                  </div>

                  {/* Marks */}
                  <div className={`w-full rounded-2xl py-4 flex flex-col items-center border border-white/60 shadow-sm ${isFirst ? 'bg-white/80' : 'bg-white/60'}`}>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Final Score</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`font-black ${isFirst ? 'text-4xl text-amber-600' : 'text-3xl text-blue-700'}`}>
                        {student.marks}
                      </span>
                      <span className="font-bold text-slate-400 text-sm">/ 100</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Honorable Mentions / Runner Ups */}
        <div className="max-w-4xl mx-auto group relative rounded-[2rem] border border-white/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-blue-100">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          
          <div className="relative z-10 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8 border-b border-white/50 pb-4">
              <FiTrendingUp className="w-6 h-6 text-blue-700" />
              <h3 className="text-2xl font-bold text-slate-900">Honorable Mentions</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {runnerUps.map((runner) => (
                <div key={runner.rank} className="bg-white/60 border border-white rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:bg-white transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <span className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black text-sm">
                      {runner.rank}
                    </span>
                    <div className="text-right">
                      <span className="font-black text-xl text-blue-700">{runner.marks}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg leading-tight mb-1">{runner.name}</h4>
                    <p className="text-sm text-slate-600 font-medium">{runner.school}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
               <button className="px-8 py-3 rounded-full bg-white border border-slate-200 text-blue-700 font-bold hover:bg-blue-50 transition-colors shadow-sm text-sm">
                 Download Full Merit List (PDF)
               </button>
            </div>
          </div>
        </div>

      </div>
    </main>
    </>
  );
};

export default Results;