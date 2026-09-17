import { useState, useEffect, useCallback } from 'react';
import {
  FiCheckCircle, FiClock, FiFileText, FiEye, FiX,
  FiZap, FiGlobe, FiRefreshCw, FiAlertCircle, FiDownload,
} from 'react-icons/fi';
import {
  collection, doc, getDocs, getCountFromServer,
  orderBy, query, updateDoc,
} from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { generateSchoolPDF, downloadBlob } from '../../lib/generatePDF.jsx';

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    'not-generated': 'bg-amber-100 text-amber-700',
    'generated':     'bg-blue-100 text-blue-700',
    'published':     'bg-green-100 text-green-700',
  };
  const labels = {
    'not-generated': 'Not Generated',
    'generated':     'Generated',
    'published':     'Published',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${styles[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {labels[status] ?? status}
    </span>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const AdminTickets = () => {
  const [schools, setSchools]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [generatingId, setGeneratingId] = useState(null);
  const [publishingId, setPublishingId] = useState(null);
  const [progress, setProgress]         = useState({ current: 0, total: 0, name: '' });
  // In-session blob URLs: { [udise]: { blobUrl, count } }
  // These live only until page refresh — that's intentional (no cloud storage).
  const [sessionPDFs, setSessionPDFs]   = useState({});
  const [toast, setToast]               = useState(null);

  // ── Load schools ────────────────────────────────────────────────────────────
  const loadSchools = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(firestore, 'schools'));
      const list = await Promise.all(
        snapshot.docs.map(async (schoolDoc) => {
          const d = schoolDoc.data();
          const udise = String(d.udiseNumber || schoolDoc.id);
          const rosterRef = collection(firestore, 'students', udise, 'roster');
          const countSnap = await getCountFromServer(rosterRef);
          return {
            id: schoolDoc.id,
            udise,
            name: d.schoolName || d.school_name || 'Unknown School',
            region: d.taluka || d.region || '—',
            count: countSnap.data().count || 0,
            published: !!d.hallTicketPublished,
          };
        })
      );
      setSchools(list.sort((a, b) => b.count - a.count));
    } catch (err) {
      console.error('Failed to load schools:', err);
      showToast('error', 'Failed to load schools.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSchools(); }, [loadSchools]);

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  // ── Derive display status for a school ─────────────────────────────────────
  const getStatus = (school) => {
    if (school.published) return 'published';
    if (sessionPDFs[school.udise]) return 'generated';
    return 'not-generated';
  };

  // ── Generate PDF ────────────────────────────────────────────────────────────
  const handleGenerate = async (school) => {
    setGeneratingId(school.udise);
    setProgress({ current: 0, total: 0, name: school.name });

    try {
      // 1. Fetch students
      const rosterRef = collection(firestore, 'students', school.udise, 'roster');
      const q = query(rosterRef, orderBy('registeredAt', 'asc'));
      const snap = await getDocs(q);
      const students = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      if (students.length === 0) {
        showToast('error', `No students registered for ${school.name}.`);
        return;
      }

      setProgress({ current: 0, total: students.length, name: school.name });

      // 2. Generate PDF in-browser
      const { blobUrl } = await generateSchoolPDF(
        students,
        school.name,
        (current, total) => setProgress(prev => ({ ...prev, current, total }))
      );

      // 3. Auto-download
      downloadBlob(blobUrl, `HallTickets_${school.name.replace(/\s+/g, '_')}.pdf`);

      // 4. Store blob URL for this session (for Preview button)
      setSessionPDFs(prev => ({ ...prev, [school.udise]: { blobUrl, count: students.length } }));

      showToast('success', `✅ ${students.length} hall tickets downloaded for ${school.name}`);
    } catch (err) {
      console.error('Generation failed:', err);
      showToast('error', `Generation failed: ${err.message}`);
    } finally {
      setGeneratingId(null);
      setProgress({ current: 0, total: 0, name: '' });
    }
  };

  // ── Publish ─────────────────────────────────────────────────────────────────
  const handlePublish = async (school) => {
    setPublishingId(school.udise);
    try {
      await updateDoc(doc(firestore, 'schools', school.id), {
        hallTicketPublished: true,
        hallTicketPublishedAt: new Date().toISOString(),
      });
      setSchools(prev => prev.map(sc =>
        sc.id === school.id ? { ...sc, published: true } : sc
      ));
      showToast('success', `🌐 Hall tickets published for ${school.name}`);
    } catch (err) {
      showToast('error', `Publish failed: ${err.message}`);
    } finally {
      setPublishingId(null);
    }
  };

  // ── Unpublish (re-lock) ─────────────────────────────────────────────────────
  const handleUnpublish = async (school) => {
    setPublishingId(school.udise);
    try {
      await updateDoc(doc(firestore, 'schools', school.id), {
        hallTicketPublished: false,
      });
      setSchools(prev => prev.map(sc =>
        sc.id === school.id ? { ...sc, published: false } : sc
      ));
      showToast('success', `🔒 Hall tickets unpublished for ${school.name}`);
    } catch (err) {
      showToast('error', `Unpublish failed: ${err.message}`);
    } finally {
      setPublishingId(null);
    }
  };

  // ── Stats ───────────────────────────────────────────────────────────────────
  const totalGenerated = Object.keys(sessionPDFs).length;
  const totalPublished = schools.filter(s => s.published).length;
  const anyBusy = !!generatingId || !!publishingId;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-bold transition-all ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success'
            ? <FiCheckCircle className="w-5 h-5 shrink-0" />
            : <FiAlertCircle className="w-5 h-5 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Progress banner */}
      {generatingId && (
        <div className="mb-6 bg-blue-900 text-white rounded-2xl p-5 flex items-center gap-4 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <FiZap className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">
              Generating hall tickets for {progress.name}
            </p>
            <p className="text-blue-200 text-xs mt-0.5">
              {progress.current} / {progress.total} tickets processed…
            </p>
            {progress.total > 0 && (
              <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Hall Tickets Master
          </h2>
          <p className="text-slate-600 font-medium">
            Generate &amp; download hall ticket PDFs per school, then publish to unlock coordinator downloads.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSchools}
          disabled={loading || anyBusy}
          className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Schools',       value: schools.length,  bg: 'bg-blue-100',   icon: <FiFileText className="w-5 h-5" />,    color: 'text-blue-700'   },
          { label: 'Generated (session)', value: totalGenerated,  bg: 'bg-indigo-100', icon: <FiCheckCircle className="w-5 h-5" />, color: 'text-indigo-700' },
          { label: 'Published to Schools',value: totalPublished,  bg: 'bg-green-100',  icon: <FiGlobe className="w-5 h-5" />,       color: 'text-green-700'  },
        ].map(({ label, value, bg, icon, color }) => (
          <div key={label} className={`relative rounded-[2rem] border border-white/60 shadow-sm ${bg} overflow-hidden`}>
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-600 mb-1">{label}</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{loading ? '—' : value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center shadow-sm ${color}`}>
                {icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
        <div className="relative z-10 p-4 sm:p-8">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-white/70 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : schools.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-medium">
              No schools registered yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[820px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['School', 'Region', 'Students', 'Status', 'Actions'].map(col => (
                      <th key={col} className={`pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider ${col === 'Actions' ? 'text-right' : ''}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {schools.map((school) => {
                    const status       = getStatus(school);
                    const isGenerating = generatingId === school.udise;
                    const isPublishing = publishingId === school.udise;
                    const hasSessionPDF = !!sessionPDFs[school.udise];

                    return (
                      <tr key={school.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-5">
                          <p className="font-bold text-slate-900">{school.name}</p>
                          <p className="font-mono text-xs text-slate-500 mt-0.5">UDISE: {school.udise}</p>
                        </td>
                        <td className="py-4 px-5 font-medium text-slate-700">{school.region}</td>
                        <td className="py-4 px-5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                            {school.count} students
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <StatusBadge status={status} />
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center justify-end gap-2 flex-wrap">

                            {/* DOWNLOAD / RE-DOWNLOAD */}
                            <button
                              type="button"
                              onClick={() => handleGenerate(school)}
                              disabled={anyBusy || school.count === 0}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {isGenerating ? (
                                <><FiRefreshCw className="w-3 h-3 animate-spin" /> Downloading…</>
                              ) : (
                                <><FiDownload className="w-3 h-3" /> {hasSessionPDF ? 'Re-download' : 'Download'}</>
                              )}
                            </button>

                            {/* PREVIEW — opens in new tab */}
                            {hasSessionPDF && (
                              <button
                                type="button"
                                onClick={() => window.open(sessionPDFs[school.udise].blobUrl, '_blank')}
                                disabled={anyBusy}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-700 font-bold hover:bg-blue-50 text-xs transition-colors shadow-sm disabled:opacity-40"
                              >
                                <FiEye className="w-3 h-3" /> Preview
                              </button>
                            )}

                            {/* PUBLISH — if generated in session and not yet published */}
                            {hasSessionPDF && !school.published && (
                              <button
                                type="button"
                                onClick={() => handlePublish(school)}
                                disabled={anyBusy}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-40"
                              >
                                {isPublishing ? (
                                  <><FiRefreshCw className="w-3 h-3 animate-spin" /> Publishing…</>
                                ) : (
                                  <><FiGlobe className="w-3 h-3" /> Publish</>
                                )}
                              </button>
                            )}

                            {/* UNPUBLISH — if already published */}
                            {school.published && (
                              <button
                                type="button"
                                onClick={() => handleUnpublish(school)}
                                disabled={anyBusy}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-bold text-xs transition-colors shadow-sm disabled:opacity-40 border border-slate-200"
                              >
                                {isPublishing
                                  ? <FiRefreshCw className="w-3 h-3 animate-spin" />
                                  : <FiCheckCircle className="w-3.5 h-3.5 text-green-600" />}
                                {isPublishing ? 'Updating…' : 'Published'}
                              </button>
                            )}

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Session notice */}
          {!loading && totalGenerated > 0 && (
            <p className="mt-4 text-xs text-slate-400 font-medium text-center">
              Preview is only available in this browser session. Refresh the page and you'll need to re-generate to preview again.
            </p>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminTickets;
