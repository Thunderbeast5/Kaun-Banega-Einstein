import { useRef, useState, useEffect } from 'react';
import { FiUser, FiCalendar, FiAlertTriangle, FiPrinter } from 'react-icons/fi';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import kbeLogo from '../assets/KBE.png';
import kawaleLogo from '../assets/kawle.png';

const HallTicket = ({ studentData }) => {
  const ticketRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const availableWidth = entry.contentRect.width;
        // A4 portrait width is ~794px
        setScale(Math.min(availableWidth / 794, 1));
      }
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  const handleDownloadPdf = async () => {
    if (!ticketRef.current || isGenerating) return;
    setIsGenerating(true);

    try {
      const printElement = ticketRef.current;
      const originalTransform = printElement.style.transform;
      printElement.style.transform = 'none';

      // Render the DOM node to a high-res canvas
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3, // higher = sharper PDF, 3 is a good balance of quality vs file size
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 794,
        windowHeight: 1123,
      });

      printElement.style.transform = originalTransform;

      const imgData = canvas.toDataURL('image/png');

      // A4 in mm
      const pdfWidth = 210;
      const pdfHeight = 297;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Fit the captured canvas exactly onto one A4 page
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      const fileName = `HallTicket_${studentData?.applicationNumber || 'KBE-26-0000'}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Something went wrong generating the PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-slate-100 min-h-screen py-6 font-manrope w-full">
      {/* Controls */}
      <div className="mb-6 flex gap-4 w-full max-w-[794px] justify-center sm:justify-end px-4">
        <button
          onClick={handleDownloadPdf}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FiPrinter className="w-5 h-5" />
          {isGenerating ? 'Generating PDF...' : 'Download as PDF'}
        </button>
      </div>

      {/* Outer Container */}
      <div ref={containerRef} className="w-full flex justify-center px-4">
        {/* Bounding Box */}
        <div 
          className="relative overflow-hidden shadow-2xl bg-white"
          style={{ 
            width: `${794 * scale}px`, 
            height: `${1123 * scale}px` 
          }}
        >
          {/* A4 Printable Container */}
          <div
            ref={ticketRef}
            className="hall-ticket font-manrope w-[794px] h-[1123px] bg-white relative flex flex-col border border-slate-200 box-border origin-top-left"
            style={{ transform: `scale(${scale})` }}
          >
        {/* Decorative Top Border */}
        <div className="h-3 w-full bg-blue-900" />

        <div className="px-8 py-5 flex-1 flex flex-col">

          {/* --- HEADER SECTION --- */}
          <div className="flex items-center justify-between mb-4">
            <img src={kbeLogo} alt="Kaun Banega Einstein logo" className="w-24 h-24 object-contain shrink-0" crossOrigin="anonymous" />

            {/* Center Text */}
            <div className="text-center flex-1 px-4">
              <h1 className="text-xl font-extrabold text-blue-900 uppercase tracking-wide">
                B. K. Kawale Jr. College of Science
              </h1>
              <p className="text-sm font-medium text-slate-700 mt-1">in association with</p>
              <h2 className="text-lg font-bold text-blue-800 mt-1">
                Swami Vivekananda Institute
              </h2>
              <p className="text-sm font-medium text-slate-700 mt-1 mb-1">Organises</p>

              <div className="inline-block mb-1">
                <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tight" style={{ WebkitTextStroke: '1px #1e3a8a' }}>
                  Kaun Banega Einstein 2026
                </h2>
              </div>

              <div className="bg-yellow-400 py-1 px-3 rounded-full border-2 border-blue-900 mx-auto">
                <p className="text-xs font-bold text-blue-900 uppercase whitespace-nowrap">
                  Inter-School Science &amp; Innovation Examination
                </p>
              </div>
            </div>

            <img src={kawaleLogo} alt="B.K Kawale Jr. College of Science" className="w-24 h-24 object-contain shrink-0" crossOrigin="anonymous" />
          </div>

          {/* --- HALL TICKET BANNER & APP NO --- */}
          <div className="flex items-end justify-between border-b-4 border-blue-900 pb-2 mb-4">
            <div className="bg-blue-900 text-white px-10 py-2 rounded-t-xl rounded-br-xl inline-block">
              <h2 className="text-3xl font-black tracking-widest uppercase">Hall Ticket</h2>
            </div>

            <div className="border-2 border-blue-900 p-2 text-center rounded-lg bg-slate-50 min-w-[140px]">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Application No.</p>
              <p className="text-lg font-black text-blue-900">{studentData?.applicationNumber || 'KBE-26-0000'}</p>
            </div>
          </div>

          {/* --- STUDENT DETAILS --- */}
          <div className="mb-4 relative border-2 border-blue-100 rounded-2xl p-5 pt-7">
            <div className="absolute -top-4 left-6 bg-blue-900 text-white px-4 py-1.5 rounded-full flex items-center gap-2">
              <FiUser className="w-4 h-4" />
              <span className="text-sm font-bold tracking-wider uppercase">Student Details</span>
            </div>

            <div className="flex justify-between gap-6">
              <div className="flex-1 space-y-4 text-sm">
                <div className="flex items-end border-b border-dashed border-slate-300 pb-1">
                  <span className="w-32 font-bold text-slate-700">Student Name</span>
                  <span className="font-bold text-slate-900 pl-4">{studentData?.name || 'Aarav Sharma'}</span>
                </div>
                <div className="flex items-end border-b border-dashed border-slate-300 pb-1">
                  <span className="w-32 font-bold text-slate-700">School Name</span>
                  <span className="font-bold text-slate-900 pl-4">{studentData?.school || 'Saraswati Vidyalaya'}</span>
                </div>
                <div className="flex items-end border-b border-dashed border-slate-300 pb-1">
                  <span className="w-32 font-bold text-slate-700">Standard</span>
                  <span className="font-bold text-slate-900 pl-4">{studentData?.standard || '10th Grade'}</span>
                </div>
                <div className="flex items-end border-b border-dashed border-slate-300 pb-1">
                  <span className="w-32 font-bold text-slate-700">Roll No.</span>
                  <span className="font-bold text-slate-900 pl-4">{studentData?.rollNumber || studentData?.rollNo || '45-A'}</span>
                </div>
                <div className="flex items-end border-b border-dashed border-slate-300 pb-1">
                  <span className="w-32 font-bold text-slate-700">Application No.</span>
                  <span className="font-bold text-slate-900 pl-4">{studentData?.applicationNumber || 'KBE-26-0000'}</span>
                </div>
              </div>

              {/* Photo Box */}
              <div className="w-[120px] h-[150px] border-2 border-slate-400 border-dashed rounded-lg flex flex-col items-center justify-center bg-slate-50 shrink-0 text-center p-2 overflow-hidden">
                {studentData?.photoUrl ? (
                  <img
                    src={studentData.photoUrl}
                    alt="Candidate"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <FiUser className="w-12 h-12 text-slate-300 mb-2" />
                    <span className="text-[10px] text-slate-400 font-bold">Paste Passport<br/>Size Photo Here</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* --- EXAMINATION DETAILS --- */}
          <div className="mb-4 relative border-2 border-blue-100 rounded-2xl p-5 pt-7">
            <div className="absolute -top-4 left-6 bg-blue-900 text-white px-4 py-1.5 rounded-full flex items-center gap-2">
              <FiCalendar className="w-4 h-4" />
              <span className="text-sm font-bold tracking-wider uppercase">Examination Details</span>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div className="flex items-end border-b border-dashed border-slate-300 pb-1">
                <span className="w-28 font-bold text-slate-700">Exam Date</span>
                <span className="font-bold text-blue-900 pl-2">24 November 2026</span>
              </div>
              <div className="flex items-end border-b border-dashed border-slate-300 pb-1 col-span-2">
                <span className="w-28 font-bold text-slate-700">Reporting Time</span>
                <span className="font-bold text-blue-900 pl-2">09:30 AM</span>
              </div>
              <div className="flex items-end border-b border-dashed border-slate-300 pb-1">
                <span className="w-28 font-bold text-slate-700">Exam Time</span>
                <span className="font-bold text-blue-900 pl-2">10:00 AM - 12:00 PM</span>
              </div>
              <div className="flex items-end border-b border-dashed border-slate-300 pb-1 col-span-2">
                <span className="w-28 font-bold text-slate-700">Venue</span>
                <span className="font-bold text-slate-900 pl-2">B. K. Kawale Jr. College of Science Campus</span>
              </div>
            </div>
          </div>

          {/* --- INSTRUCTIONS --- */}
          <div className="mb-4 relative border-2 border-yellow-400 bg-yellow-50/30 rounded-2xl p-5 pt-7">
            <div className="absolute -top-4 left-6 bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-full flex items-center gap-2">
              <FiAlertTriangle className="w-4 h-4" />
              <span className="text-sm font-black tracking-wider uppercase">Important Instructions</span>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-800 font-medium leading-relaxed pl-2">
              <li>Bring this Hall Ticket along with a valid school ID card to the examination centre.</li>
              <li>Reach the venue at least <strong>30 minutes</strong> before the examination starts.</li>
              <li>Mobile phones, smartwatches, and electronic gadgets are strictly prohibited inside the hall.</li>
              <li>Use only a blue or black ballpoint pen for writing the examination.</li>
              <li>Keep this Hall Ticket safely until the completion of the examination process.</li>
            </ol>
          </div>

          {/* --- SIGNATURES --- */}
          <div className="flex justify-between items-end px-4 mt-auto">
            <div className="flex flex-col items-center">
              <div className="w-40 border-b border-slate-400 mb-2"></div>
              <span className="text-xs font-bold text-slate-600">Student's Signature</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-40 border-b border-slate-400 mb-2"></div>
              <span className="text-xs font-bold text-slate-600">Class Teacher</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-40 border-b border-slate-400 mb-2"></div>
              <span className="text-xs font-bold text-slate-600">Exam Coordinator</span>
            </div>
          </div>

        </div>

        {/* Decorative Bottom Banner */}
        <div className="w-full bg-blue-900 py-2 text-center shrink-0">
          <p className="text-yellow-400 text-xs font-bold italic tracking-wide whitespace-nowrap">
            "Think. Question. Discover. Become the next Einstein!"
          </p>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default HallTicket;