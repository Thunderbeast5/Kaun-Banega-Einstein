import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FiCheckCircle, FiClock, FiFileText, FiEye, FiX,
  FiZap, FiGlobe, FiRefreshCw, FiAlertCircle, FiDownload,
} from 'react-icons/fi';
import ReactDOM from 'react-dom/client';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import {
  collection, doc, getDocs, getCountFromServer,
  orderBy, query, updateDoc,
} from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { uploadHallTicketPDF } from '../../lib/cloudinary';
import HallTicketPage from '../HallTicketPage';

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    'not-generated': 'bg-amber-100 text-amber-700',
    'generated': 'bg-blue-100 text-blue-700',
    'published': 'bg-green-100 text-green-700',
  };
  const label = {
    'not-generated': 'Not Generated',
    'generated': 'Generated',
    'published': 'Published',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${map[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {label[status] ?? status}
    </span>
  );
};

// ─── Renders ONE hall ticket page off-screen and returns a canvas ─────────────
async function renderTicketCanvas(studentData) {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;left:-9999px;top:-9999px;z-index:-1;';
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);
    root.render(<HallTicketPage studentData={studentData} />);

    // Give React a frame to paint, then capture
    requestAnimationFrame(async () => {
      await new Promise(r => setTimeout(r, 200)); // let images load
      try {
        const el = container.firstElementChild;
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          width: 794,
          height: 1123,
          windowWidth: 794,
          windowHeight: 1123,
        });
        resolve(canvas);
      } catch (err) {
        reject(err);
      } finally {
        root.unmount();
        document.body.removeChild(container);
      }
    });
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminTickets = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState(null); // udise being generated
  const [publishingId, setPublishingId] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0, name: '' });
  const [previewUrl, setPreviewUrl] = useState(null);     // viewUrl — for Google Docs viewer preview
  const [previewDownload, setPreviewDownload] = useState(null); // downloadUrl — for the Download button
  const [previewSchool, setPreviewSchool] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  // ── Load schools from Firestore ─────────────────────────────────────────────
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

          let status = 'not-generated';
          if (d.hallTicketPublished && d.hallTicketUrl) status = 'published';
          else if (d.hallTicketUrl) status = 'generated';

          return {
            id: schoolDoc.id,
            udise,
            name: d.schoolName || d.school_name || 'Unknown School',
            region: d.taluka || d.region || '—',
            count: countSnap.data().count || 0,
            status,
            hallTicketUrl: d.hallTicketUrl || null,
            hallTicketDownloadUrl: d.hallTicketDownloadUrl || d.hallTicketUrl || null,
          };
        })
      );
      setSchools(list.sort((a, b) => b.count - a.count));
    } catch (err) {
      console.error('Failed to load schools:', err);
      showToast('error', 'Failed to load schools. Check console.');
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

  // ── Generate bulk PDF for a school ─────────────────────────────────────────
  const handleGenerate = async (school) => {
    setGeneratingId(school.udise);
    setProgress({ current: 0, total: 0, name: school.name });

    try {
      // 1. Fetch all students
      const rosterRef = collection(firestore, 'students', school.udise, 'roster');
      const q = query(rosterRef, orderBy('registeredAt', 'asc'));
      const snap = await getDocs(q);
      const students = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      if (students.length === 0) {
        showToast('error', `No students found for ${school.name}.`);
        return;
      }

      setProgress({ current: 0, total: students.length, name: school.name });

      // 2. Create jsPDF (A4 portrait)
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = 210, pdfH = 297;

      for (let i = 0; i < students.length; i++) {
        const s = students[i];
        const studentData = {
          name: s.name,
          school: s.schoolName || school.name,
          grade: s.grade,
          division: s.division,
          rollNumber: s.rollNumber,
          applicationNumber: s.applicationNumber || s.id,
          photoUrl: s.photoUrl || null,
        };

        const canvas = await renderTicketCanvas(studentData);
        const imgData = canvas.toDataURL('image/jpeg', 0.85);

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH, undefined, 'FAST');

        setProgress(prev => ({ ...prev, current: i + 1 }));
      }

      // 3. Get blob and upload to Cloudinary
      const pdfBlob = pdf.output('blob');
      const { viewUrl, downloadUrl } = await uploadHallTicketPDF(pdfBlob, school.udise);

      // 4. Write both URLs back to Firestore (not published yet)
      await updateDoc(doc(firestore, 'schools', school.id), {
        hallTicketUrl: viewUrl,
        hallTicketDownloadUrl: downloadUrl,
        hallTicketPublished: false,
        hallTicketGeneratedAt: new Date().toISOString(),
      });

      // 5. Update local state
      setSchools(prev => prev.map(sc =>
        sc.id === school.id
          ? { ...sc, status: 'generated', hallTicketUrl: viewUrl, hallTicketDownloadUrl: downloadUrl }
          : sc
      ));
      showToast('success', `✅ ${students.length} tickets generated for ${school.name}`);
    } catch (err) {
      console.error('Generation failed:', err);
      showToast('error', `Generation failed: ${err.message}`);
    } finally {
      setGeneratingId(null);
      setProgress({ current: 0, total: 0, name: '' });
    }
  };

  // ── Publish a school's PDF ──────────────────────────────────────────────────
  const handlePublish = async (school) => {
    setPublishingId(school.udise);
    try {
      await updateDoc(doc(firestore, 'schools', school.id), {
        hallTicketPublished: true,
      });
      setSchools(prev => prev.map(sc =>
        sc.id === school.id ? { ...sc, status: 'published' } : sc
      ));
      showToast('success', `🌐 Hall tickets published for ${school.name}`);
    } catch (err) {
      showToast('error', `Publish failed: ${err.message}`);
    } finally {
      setPublishingId(null);
    }
  };

  // ─── Derived stats ──────────────────────────────────────────────────────────
  const totalGenerated = schools.filter(s => s.status === 'generated' || s.status === 'published').length;
  const totalPublished = schools.filter(s => s.status === 'published').length;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-bold transition-all ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <FiCheckCircle className="w-5 h-5 shrink-0" /> : <FiAlertCircle className="w-5 h-5 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Generation Progress Banner */}
      {generatingId && (
        <div className="mb-6 bg-blue-900 text-white rounded-2xl p-5 flex items-center gap-4 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <FiZap className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">Generating hall tickets for {progress.name}</p>
            <p className="text-blue-200 text-xs mt-0.5">{progress.current} / {progress.total} tickets processed…</p>
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
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Hall Tickets Master</h2>
          <p className="text-slate-600 font-medium">Generate, preview and publish examination admit cards for all schools.</p>
        </div>
        <button
          type="button"
          onClick={loadSchools}
          disabled={loading}
          className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Schools', value: schools.length, bg: 'bg-blue-100', icon: <FiFileText className="w-5 h-5" />, color: 'text-blue-700' },
          { label: 'PDFs Generated', value: totalGenerated, bg: 'bg-indigo-100', icon: <FiCheckCircle className="w-5 h-5" />, color: 'text-indigo-700' },
          { label: 'Published to Schools', value: totalPublished, bg: 'bg-green-100', icon: <FiGlobe className="w-5 h-5" />, color: 'text-green-700' },
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

      {/* Main Table */}
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
            <div className="text-center py-20 text-slate-400 font-medium">No schools registered yet.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[800px]">
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
                    const isGenerating = generatingId === school.udise;
                    const isPublishing = publishingId === school.udise;
                    const anyBusy = !!generatingId || !!publishingId;
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
                          <StatusBadge status={school.status} />
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center justify-end gap-2 flex-wrap">

                            {/* GENERATE button */}
                            <button
                              type="button"
                              onClick={() => handleGenerate(school)}
                              disabled={anyBusy || school.count === 0}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {isGenerating ? (
                                <><FiRefreshCw className="w-3 h-3 animate-spin" /> Generating…</>
                              ) : (
                                <><FiZap className="w-3 h-3" /> {school.hallTicketUrl ? 'Re-generate' : 'Generate'}</>
                              )}
                            </button>

                            {/* PREVIEW button — only if URL exists */}
                            {school.hallTicketUrl && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewUrl(school.hallTicketUrl);
                                  setPreviewDownload(school.hallTicketDownloadUrl || school.hallTicketUrl);
                                  setPreviewSchool(school.name);
                                }}
                                disabled={anyBusy}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-blue-700 font-bold hover:bg-blue-50 text-xs transition-colors shadow-sm disabled:opacity-40"
                              >
                                <FiEye className="w-3 h-3" /> Preview
                              </button>
                            )}

                            {/* PUBLISH button — only if generated but not published */}
                            {(school.status === 'generated') && (
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

                            {/* Re-publish badge when already published */}
                            {school.status === 'published' && (
                              <span className="inline-flex items-center gap-1 text-green-700 font-bold text-xs">
                                <FiCheckCircle className="w-3.5 h-3.5" /> Published
                              </span>
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
        </div>
      </div>

      {/* PDF Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex flex-col" role="dialog" aria-modal="true" aria-label="Hall ticket PDF preview">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Preview — Hall Tickets PDF</p>
              <p className="font-bold text-sm mt-0.5">{previewSchool}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Use downloadUrl (fl_attachment) so browser saves the file instead
                  of Chrome's PDF viewer extension intercepting and returning 401 */}
              <a
                href={previewDownload || previewUrl}
                download={`HallTickets_${previewSchool?.replace(/\s+/g, '_')}.pdf`}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-xs font-bold transition-colors"
              >
                <FiDownload className="w-3.5 h-3.5" /> Download PDF
              </a>
              <button
                type="button"
                onClick={() => { setPreviewUrl(null); setPreviewDownload(null); setPreviewSchool(null); }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close preview"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            {/* Cloudinary blocks direct iframe embedding (X-Frame-Options).
                Google Docs viewer proxies the PDF and renders it inline. */}
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewUrl)}&embedded=true`}
              title="Hall Tickets PDF"
              className="w-full h-full rounded-xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
