import React, { useRef } from 'react';
import { FiPrinter, FiAward } from 'react-icons/fi';

const GenerateCertificate = ({ studentData, onBack }) => {
  const componentRef = useRef();

  // Trigger browser print dialog tailored for A4 Landscape
  const handlePrint = () => {
    const printContent = componentRef.current;
    const windowPrint = window.open('', '', 'width=1100,height=800');
    windowPrint.document.write(`
      <html>
        <head>
          <title>Certificate - ${studentData?.name || 'Student'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: A4 landscape; margin: 0; }
            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .font-cursive { font-family: 'Brush Script MT', 'cursive', serif; }
          </style>
        </head>
        <body class="bg-white flex justify-center items-center h-screen">
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    windowPrint.document.close();
    windowPrint.focus();
    // Small timeout to allow Tailwind to process classes before printing
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
    }, 500);
  };

  return (
    <div className="flex flex-col items-center py-10 font-sans w-full">
      
      {/* Controls */}
      <div className="mb-8 flex gap-4 w-full max-w-[297mm] justify-between">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-700 font-bold transition-colors bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200"
          >
            <span>&larr; Back to Search</span>
          </button>
        )}
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-blue-800 transition-colors ml-auto"
        >
          <FiPrinter className="w-5 h-5" />
          Save as PDF / Print
        </button>
      </div>

      {/* A4 Printable Container (Landscape: 297mm x 210mm) */}
      <div 
        ref={componentRef}
        className="w-[297mm] h-[210mm] bg-white shadow-2xl relative overflow-hidden flex flex-col box-border"
      >
        {/* Ornate Certificate Borders */}
        <div className="absolute inset-4 border-[12px] border-blue-900 pointer-events-none z-10" />
        <div className="absolute inset-7 border-[3px] border-yellow-500 pointer-events-none z-10" />
        
        {/* Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
          <span className="text-[300px]">💡</span>
        </div>

        <div className="relative z-20 px-16 py-12 flex-1 flex flex-col justify-between">
          
          {/* --- HEADER SECTION --- */}
          <div className="flex items-center justify-between mb-2">
            {/* Left Logo */}
            <div className="w-28 h-28 rounded-full border-4 border-blue-900 bg-white flex items-center justify-center p-2 shrink-0 shadow-sm">
              <div className="text-center leading-tight">
                <span className="text-blue-900 font-black text-xs tracking-widest">SCIENCE</span><br/>
                <span className="text-blue-900 font-bold text-[10px]">&</span><br/>
                <span className="text-blue-900 font-black text-xs tracking-widest">INNOVATION</span>
              </div>
            </div>

            {/* Center Text */}
            <div className="text-center flex-1 px-4">
              <h1 className="text-2xl font-extrabold text-blue-900 uppercase tracking-widest font-serif">
                B. K. Kawale Jr. College of Science
              </h1>
              <p className="text-sm font-bold text-slate-600 mt-1 uppercase tracking-widest">in association with</p>
              <h2 className="text-xl font-bold text-blue-800 mt-1 font-serif">
                Swami Vivekananda Institute
              </h2>
            </div>

            {/* Right Logo */}
            <div className="w-28 h-28 rounded-full border-4 border-blue-900 bg-white flex flex-col items-center justify-center shrink-0 shadow-sm">
              <span className="text-3xl mb-1">⚛️</span>
              <span className="text-xs font-black text-blue-900 tracking-wider">E=mc²</span>
            </div>
          </div>

          {/* --- CERTIFICATE TITLE --- */}
          <div className="text-center mt-2 mb-6">
            <div className="inline-flex items-center justify-center gap-3 bg-yellow-400 px-8 py-2 rounded-full border-2 border-blue-900 shadow-sm mb-4">
              <FiAward className="w-6 h-6 text-blue-900" />
              <span className="text-xl font-black text-blue-900 uppercase tracking-widest">Certificate of Excellence</span>
              <FiAward className="w-6 h-6 text-blue-900" />
            </div>
            
            <p className="text-lg text-slate-700 font-serif italic mb-4">This is proudly presented to</p>
            
            {/* Student Name */}
            <h2 className="text-5xl font-bold text-blue-900 border-b-2 border-slate-300 inline-block px-12 pb-2 font-serif" style={{ fontFamily: 'Georgia, serif' }}>
              {studentData?.name || 'Aarav Sharma'}
            </h2>
          </div>

          {/* --- BODY TEXT --- */}
          <div className="text-center max-w-4xl mx-auto space-y-4 font-serif text-slate-800 text-lg leading-relaxed">
            <p>
              of <span className="font-bold text-xl text-blue-900">{studentData?.school || 'Saraswati Vidyalaya'}</span>
            </p>
            <p>
              for demonstrating exceptional scientific curiosity and practical knowledge by securing 
              <span className="font-bold text-xl text-blue-900 mx-2">Rank {studentData?.rank || '1'}</span> 
              with a remarkable score of <span className="font-bold text-xl text-blue-900 mx-1">{studentData?.score || '98.5'}</span> 
              in the
            </p>
            
            <div className="inline-block relative my-2">
              <h3 className="text-3xl font-black text-blue-900 uppercase tracking-tighter" style={{ WebkitTextStroke: '1px #1e3a8a' }}>
                Kaun Banega Einstein
              </h3>
              <div className="absolute -top-3 -left-6 text-yellow-500 text-3xl opacity-80">💡</div>
            </div>
            
            <p className="font-bold uppercase tracking-widest text-sm text-blue-800">
              Inter-School Science & Innovation Examination 2026
            </p>
          </div>

          {/* --- SIGNATURES --- */}
          <div className="flex justify-between items-end px-12 mt-10">
            <div className="flex flex-col items-center">
              <div className="w-48 border-b-2 border-blue-900 mb-2"></div>
              <span className="text-sm font-bold text-blue-900 uppercase tracking-wider">Date of Issue</span>
              <span className="text-xs text-slate-600 font-serif mt-1">20 December 2026</span>
            </div>

            {/* Center Seal Placeholder */}
            <div className="w-24 h-24 rounded-full border-2 border-yellow-500 bg-yellow-50 flex items-center justify-center opacity-80">
              <span className="text-xs font-bold text-yellow-600 text-center leading-tight">OFFICIAL<br/>SEAL</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-48 border-b-2 border-blue-900 mb-2"></div>
              <span className="text-sm font-bold text-blue-900 uppercase tracking-wider">Examination Director</span>
              <span className="text-xs text-slate-600 font-serif mt-1">B. K. Kawale Jr. College</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default GenerateCertificate;