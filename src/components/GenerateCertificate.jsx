import React, { useRef, useState, useEffect } from 'react';
import { FiDownload, FiAward, FiArrowLeft, FiLoader } from 'react-icons/fi';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

const GenerateCertificate = ({ studentData, onBack }) => {
  const componentRef = useRef();
  const containerRef = useRef();
  const [scale, setScale] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  // Dynamically calculate the scale factor based on the true available width
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const availableWidth = entry.contentRect.width;
        // 1123px is the exact width of our A4 Landscape design.
        // We cap the scale at 1 so it doesn't stretch on large desktop screens.
        setScale(Math.min(availableWidth / 1123, 1));
      }
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Generate and download PDF directly
  const handleDownload = async () => {
    const printElement = componentRef.current;
    if (!printElement || isDownloading) return;

    setIsDownloading(true);

    try {
      // Temporarily remove the scaling to capture it in full high-resolution quality
      const originalTransform = printElement.style.transform;
      printElement.style.transform = 'none';

      const canvas = await html2canvas(printElement, {
        scale: 2, // Double resolution for crisp text
        useCORS: true,
        logging: false
      });

      // Restore the scaling for the UI
      printElement.style.transform = originalTransform;

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      
      const fileName = `KBE_Certificate_${(studentData?.name || 'Student').replace(/\\s+/g, '_')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full font-sans">
      
      {/* Controls */}
      <div className="mb-6 flex gap-3 w-full max-w-[1123px] justify-between items-center">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-700 font-bold transition-colors bg-white px-4 py-2.5 rounded-full shadow-sm border border-slate-200 text-sm"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        )}
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:bg-blue-800 transition-colors ml-auto text-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <FiLoader className="w-4 h-4 animate-spin" />
          ) : (
            <FiDownload className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{isDownloading ? 'Generating...' : 'Download PDF'}</span>
          <span className="sm:hidden">{isDownloading ? 'Wait...' : 'Download'}</span>
        </button>
      </div>

      {/* 
        1. Outer Container: Takes full width of mobile screen to measure space. 
      */}
      <div ref={containerRef} className="w-full flex justify-center">
        
        {/* 
          2. Bounding Box: Reserves the exact scaled height and width so the layout doesn't collapse.
          It also holds the rounded corners and shadow safely.
        */}
        <div 
          className="relative overflow-hidden rounded-lg shadow-2xl bg-white"
          style={{ 
            width: `${1123 * scale}px`, 
            height: `${794 * scale}px` 
          }}
        >
          {/* 
            3. Actual Certificate: Full fixed 1123x794 size, absolutely positioned, 
            and scaled down from the top-left corner to perfectly fit the bounding box.
          */}
          <div 
            ref={componentRef}
            className="absolute top-0 left-0 w-[1123px] h-[794px] bg-white flex flex-col box-border origin-top-left"
            style={{ transform: `scale(${scale})` }}
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
                <div className="w-28 h-28 rounded-full border-4 border-blue-900 bg-white flex items-center justify-center p-2 shrink-0 shadow-sm">
                  <div className="text-center leading-tight">
                    <span className="text-blue-900 font-black text-xs tracking-widest">SCIENCE</span><br/>
                    <span className="text-blue-900 font-bold text-[10px]">&</span><br/>
                    <span className="text-blue-900 font-black text-xs tracking-widest">INNOVATION</span>
                  </div>
                </div>

                <div className="text-center flex-1 px-4">
                  <h1 className="text-2xl font-extrabold text-blue-900 uppercase tracking-widest font-serif">
                    B. K. Kawale Jr. College of Science
                  </h1>
                  <p className="text-sm font-bold text-slate-600 mt-1 uppercase tracking-widest">in association with</p>
                  <h2 className="text-xl font-bold text-blue-800 mt-1 font-serif">
                    Swami Vivekananda Institute
                  </h2>
                </div>

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

      </div>
    </div>
  );
};

export default GenerateCertificate;