import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { generateSchoolPDF, downloadBlob } from '../../lib/generatePDF.jsx';
import {
  FiDownload, FiClock, FiCheckCircle, FiZap, FiAlertCircle,
  FiFileText, FiEye,
} from 'react-icons/fi';
import HallTicketsSkeleton from './skeletons/HallTicketsSkeleton';

const HallTickets = ({ schoolInfo }) => {
  const [loading, setLoading]         = useState(true);
  const [published, setPublished]     = useState(false);
  const [generating, setGenerating]   = useState(false);
  const [progress, setProgress]       = useState({ current: 0, total: 0 });
  const [sessionPDF, setSessionPDF]   = useState(null); // { blobUrl, count }

  // Real-time listener on school doc for published flag
  useEffect(() => {
    if (!schoolInfo?.udise) { setLoading(false); return; }

    const schoolDocRef = doc(firestore, 'schools', String(schoolInfo.udise));
    const unsub = onSnapshot(schoolDocRef, (snap) => {
      if (snap.exists()) {
        setPublished(!!snap.data().hallTicketPublished);
      }
      setLoading(false);
    }, () => setLoading(false));

    return () => unsub();
  }, [schoolInfo?.udise]);

  // Generate + download PDF for this school
  const handleDownload = async () => {
    if (!schoolInfo?.udise) return;
    setGenerating(true);
    setProgress({ current: 0, total: 0 });

    try {
      const rosterRef = collection(firestore, 'students', String(schoolInfo.udise), 'roster');
      const q = query(rosterRef, orderBy('registeredAt', 'asc'));
      const snap = await getDocs(q);
      const students = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      if (students.length === 0) {
        alert('No students found in your roster.');
        return;
      }

      const { blobUrl } = await generateSchoolPDF(
        students,
        schoolInfo.name || 'School',
        (current, total) => setProgress({ current, total })
      );

      downloadBlob(blobUrl, `HallTickets_${(schoolInfo.name || 'School').replace(/\s+/g, '_')}.pdf`);
      setSessionPDF({ blobUrl, count: students.length });
    } catch (err) {
      console.error('Download failed:', err);
      alert(`Failed to generate hall tickets: ${err.message}`);
    } finally {
      setGenerating(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  if (loading) return <HallTicketsSkeleton />;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Hall Tickets</h2>
          <p className="text-slate-600 font-medium">Download examination admit cards for all students in your school.</p>
        </div>

        {published && (
          <div className="flex items-center gap-3">
                      {sessionPDF && (
              <button
                onClick={() => window.open(sessionPDF.blobUrl, '_blank')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-blue-200 text-blue-700 font-bold hover:bg-blue-50 transition-all shadow-sm text-sm"
              >
                <FiEye className="w-4 h-4" />
                Preview
              </button>
            )}
            <button
              onClick={handleDownload}
              disabled={generating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 transition-all shadow-md text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {generating ? (
                <><FiZap className="w-4 h-4 animate-pulse" /> Generating…</>
              ) : (
                <><FiDownload className="w-4 h-4" /> Download All Tickets</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Progress bar while generating */}
      {generating && progress.total > 0 && (
        <div className="mb-6 bg-blue-900 text-white rounded-2xl p-5 flex items-center gap-4 shadow-lg">
          <FiZap className="w-6 h-6 animate-pulse shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-sm">Building your hall tickets PDF…</p>
            <p className="text-blue-200 text-xs mt-0.5">{progress.current} / {progress.total} tickets</p>
            <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main card */}
      <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
        <div className="relative z-10 p-6 sm:p-8">

          {!published ? (
            /* Not published */
            <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-200 flex items-center justify-center shadow-sm">
                <FiClock className="w-9 h-9 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Hall Tickets Not Yet Published</h3>
                <p className="text-slate-500 font-medium text-sm max-w-md">
                  The admin is preparing your school's hall tickets. Once published, you'll be able to download the full PDF here.
                </p>
              </div>
            </div>
          ) : (
            /* Published */
            <>
              <div className="flex items-center gap-3 bg-green-100/80 border border-green-200 text-green-800 p-4 rounded-xl mb-6 shadow-sm">
                <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold">Hall tickets are published! Click "Download All Tickets" to get the PDF.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                    <FiFileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Hall Ticket PDF</p>
                    <p className="font-bold text-slate-900 text-sm">{schoolInfo?.name || 'Your School'}</p>
                    <p className="text-xs text-slate-400 mt-0.5">One page per student · Generated on demand</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
                    <FiCheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Status</p>
                    <p className="font-bold text-green-700 text-sm">Published by Admin</p>
                    <p className="text-xs text-slate-400 mt-0.5">Ready to download</p>
                  </div>
                </div>
              </div>

              {sessionPDF && (
                <p className="mt-4 text-xs text-slate-400 font-medium text-center">
                  Last generated: {sessionPDF.count} tickets. Click Preview to view before distributing.
                </p>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default HallTickets;
