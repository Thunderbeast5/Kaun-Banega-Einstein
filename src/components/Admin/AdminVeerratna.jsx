import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { FiAward, FiSearch, FiFileText, FiLoader, FiX, FiExternalLink, FiCalendar, FiMapPin, FiMail, FiPhone, FiCheckCircle } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { firestore } from '../../lib/firebase';

const AdminVeerratna = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isVeerratnaOpen, setIsVeerratnaOpen] = useState(true);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  // Live listen to platform controls to know if Veerratna registrations are open
  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, 'settings', 'platformControls'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setIsVeerratnaOpen(data.veerratnaOpen !== false);
      }
    });
    return () => unsub();
  }, []);

  const handleToggleVeerratnaStatus = async () => {
    if (isTogglingStatus) return;
    setIsTogglingStatus(true);
    const nextState = !isVeerratnaOpen;
    try {
      await setDoc(doc(firestore, 'settings', 'platformControls'), {
        veerratnaOpen: nextState,
      }, { merge: true });
    } catch (err) {
      console.error('Failed to toggle Veerratna registration status:', err);
      alert('Failed to update registration status. Please try again.');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadRegistrations = async () => {
      try {
        const q = query(collection(firestore, 'veerratna'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        if (isMounted) {
          setRegistrations(data);
        }
      } catch (err) {
        console.error('Failed to load Veerratna Award registrations:', err);
        // Fallback without ordering if index not yet generated
        try {
          const fallbackSnap = await getDocs(collection(firestore, 'veerratna'));
          const fallbackData = fallbackSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          if (isMounted) {
            setRegistrations(fallbackData);
          }
        } catch (innerErr) {
          console.error('Fallback query failed:', innerErr);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRegistrations();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleExportExcel = () => {
    if (registrations.length === 0) {
      alert('No registrations available to export.');
      return;
    }

    setIsExporting(true);
    try {
      const rows = registrations.map((item, index) => {
        let formattedDate = '';
        if (item.createdAt?.toDate) {
          formattedDate = item.createdAt.toDate().toLocaleString('en-IN');
        } else if (item.createdAt?.seconds) {
          formattedDate = new Date(item.createdAt.seconds * 1000).toLocaleString('en-IN');
        }

        return {
          'Sr No.': index + 1,
          'Coordinator Name': item.coordinatorName || '',
          'Email Address': item.coordinatorEmail || '',
          'Mobile Number': item.coordinatorMobile || '',
          'WhatsApp Number': item.coordinatorWhatsapp || '',
          'Years of Experience': item.experience || '',
          'Address': item.address || item.workAddress || '',
          'About / Key Contributions': item.aboutYourself || '',
          'School Name': item.schoolName || '',
          'UDISE Code': item.udiseNumber || item.id || '',
          'School Address': item.schoolAddress || '',
          'Taluka': item.taluka || '',
          'District': item.district || '',
          'PIN Code': item.pinCode || '',
          'Registered At': formattedDate,
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Veerratna Award');

      XLSX.writeFile(workbook, 'Veerratna_Award_Registrations.xlsx');
    } catch (err) {
      console.error('Failed to export Excel:', err);
      alert('Failed to export Excel file. Please check console for details.');
    } finally {
      setIsExporting(false);
    }
  };

  const filteredRegistrations = registrations.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.coordinatorName?.toLowerCase().includes(q) ||
      item.coordinatorEmail?.toLowerCase().includes(q) ||
      item.coordinatorMobile?.includes(q) ||
      item.coordinatorWhatsapp?.includes(q) ||
      item.schoolName?.toLowerCase().includes(q) ||
      item.udiseNumber?.includes(q) ||
      item.district?.toLowerCase().includes(q) ||
      item.taluka?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200/60 shadow-sm">
            <FiAward className="w-3.5 h-3.5" />
            <span>Award Management</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Veerratna Award</h2>
          <p className="text-slate-600 font-medium">Review and export all coordinator and teacher registrations for the Veerratna Award.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Open/Close Status Toggle */}
          <button
            type="button"
            onClick={handleToggleVeerratnaStatus}
            disabled={isTogglingStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer border ${
              isVeerratnaOpen
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
            }`}
            title="Click to toggle Veerratna registrations open or closed"
          >
            {isTogglingStatus ? (
              <FiLoader className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span className={`w-2.5 h-2.5 rounded-full ${isVeerratnaOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            )}
            <span>Registrations: {isVeerratnaOpen ? 'Open' : 'Closed'}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
              ({isVeerratnaOpen ? 'Click to Close' : 'Click to Open'})
            </span>
          </button>

          <button
            onClick={handleExportExcel}
            disabled={isExporting || registrations.length === 0}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isExporting ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiFileText className="w-4 h-4" />}
            <span>{isExporting ? 'Exporting...' : 'Export to Excel'}</span>
          </button>
        </div>
      </div>

      {/* Search and Summary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, phone, school, or UDISE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm font-medium transition-all text-sm"
          />
        </div>

        <div className="text-sm font-bold text-slate-600 bg-white/70 px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-sm self-start sm:self-auto">
          Total Nominations: <span className="text-blue-700 font-extrabold">{registrations.length}</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-50 overflow-hidden flex flex-col h-full">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
        <div className="relative z-10 p-4 sm:p-8 flex-1">
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 bg-white/70 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Coordinator</th>
                    <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">School / UDISE</th>
                    <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Experience</th>
                    <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((entry) => (
                      <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors align-middle">
                        <td className="py-4 px-5">
                          <p className="font-bold text-slate-900">{entry.coordinatorName || 'Unnamed'}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{entry.coordinatorEmail || '—'}</p>
                        </td>

                        <td className="py-4 px-5">
                          <p className="font-bold text-slate-900">{entry.schoolName || 'Unknown School'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-semibold">
                              UDISE: {entry.udiseNumber || entry.id}
                            </span>
                            {entry.district && (
                              <span className="text-xs text-slate-400">
                                {entry.taluka ? `${entry.taluka}, ` : ''}{entry.district}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                            {entry.experience ? `${entry.experience} Yrs` : '—'}
                          </span>
                        </td>

                        <td className="py-4 px-5 text-slate-700 font-medium">
                          <div className="text-xs space-y-0.5">
                            <p className="flex items-center gap-1.5 text-slate-800">
                              <span className="text-slate-400">Phone:</span> {entry.coordinatorMobile || '—'}
                            </p>
                            {entry.coordinatorWhatsapp && (
                              <p className="flex items-center gap-1.5 text-slate-500">
                                <span className="text-slate-400">WA:</span> {entry.coordinatorWhatsapp}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedEntry(entry)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors cursor-pointer"
                          >
                            <span>View Full Details</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-16 text-center text-slate-400 font-medium text-sm">
                        {registrations.length === 0
                          ? 'No Veerratna Award registrations found yet.'
                          : 'No registrations match your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && (
            <div className="mt-5 px-2">
              <p className="text-sm font-medium text-slate-500">
                Showing <span className="font-bold text-slate-900">{filteredRegistrations.length}</span> of{' '}
                <span className="font-bold text-slate-900">{registrations.length}</span> registrations
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedEntry && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 sm:p-6 md:p-8 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="relative my-auto w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-[2rem] border border-white/60 bg-white p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedEntry(null)}
              aria-label="Close details"
              className="absolute right-6 top-6 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-sm">
                <FiAward className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">{selectedEntry.coordinatorName}</h3>
                <p className="text-sm text-slate-500">Veerratna Award Candidate</p>
              </div>
            </div>

            <div className="space-y-6 text-sm">
              {/* Coordinator Details Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                  Coordinator Contact & Profile
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="block text-xs text-slate-400 uppercase font-bold">Email Address</span>
                    <span className="font-medium text-slate-900">{selectedEntry.coordinatorEmail || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 uppercase font-bold">Mobile Number</span>
                    <span className="font-medium text-slate-900">{selectedEntry.coordinatorMobile || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 uppercase font-bold">WhatsApp Number</span>
                    <span className="font-medium text-slate-900">{selectedEntry.coordinatorWhatsapp || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 uppercase font-bold">Experience</span>
                    <span className="font-medium text-slate-900">{selectedEntry.experience ? `${selectedEntry.experience} Years` : '—'}</span>
                  </div>
                </div>

                {(selectedEntry.address || selectedEntry.workAddress) && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="block text-xs text-slate-400 uppercase font-bold mb-1">Address</span>
                    <p className="text-slate-700 whitespace-pre-line leading-relaxed">{selectedEntry.address || selectedEntry.workAddress}</p>
                  </div>
                )}
              </div>

              {/* About Yourself Card */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100">
                <h4 className="font-bold text-slate-900 text-sm border-b border-blue-200/60 pb-2 mb-2">
                  About Yourself & Contributions
                </h4>
                <p className="text-slate-800 leading-relaxed whitespace-pre-line text-sm">
                  {selectedEntry.aboutYourself || 'No description provided.'}
                </p>
              </div>

              {/* School Details Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                  School Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="block text-xs text-slate-400 uppercase font-bold">School Name</span>
                    <span className="font-medium text-slate-900">{selectedEntry.schoolName || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 uppercase font-bold">UDISE Code</span>
                    <span className="font-mono font-bold text-blue-700">{selectedEntry.udiseNumber || selectedEntry.id}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-xs text-slate-400 uppercase font-bold">Region</span>
                    <span className="font-medium text-slate-900">{selectedEntry.taluka}, {selectedEntry.district} - {selectedEntry.pinCode}</span>
                  </div>
                </div>

                {selectedEntry.schoolAddress && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="block text-xs text-slate-400 uppercase font-bold mb-1">School Street Address</span>
                    <p className="text-slate-700 whitespace-pre-line leading-relaxed">{selectedEntry.schoolAddress}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVeerratna;
