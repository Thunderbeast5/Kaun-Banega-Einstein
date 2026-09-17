import React, { useEffect, useRef, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import {
  FiRadio, FiX, FiChevronDown, FiChevronUp, FiCheck,
  FiSend, FiAlertCircle, FiCheckCircle, FiLoader, FiMail,
} from 'react-icons/fi';
import { firestore } from '../../lib/firebase';

// ─── Brevo sender config from env ────────────────────────────────────────────
const BREVO_API_KEY    = import.meta.env.VITE_BREVO_API_KEY    ?? '';
const SENDER_EMAIL     = import.meta.env.VITE_BREVO_SENDER_EMAIL ?? 'noreply@kaunbanega.einstein';
const SENDER_NAME      = import.meta.env.VITE_BREVO_SENDER_NAME  ?? 'KBE Admin';

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function sendBrevoEmail({ recipients, subject, htmlContent }) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: recipients.map(r => ({ email: r.email, name: r.name ?? r.email })),
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `Brevo API error ${res.status}`);
  }
  return res.json();
}

// ─── Multi-select Dropdown ────────────────────────────────────────────────────
const RecipientDropdown = ({ schools, selected, onChange, loading }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allSelected   = selected.length === schools.length && schools.length > 0;
  const someSelected  = selected.length > 0 && !allSelected;

  const toggleAll = () => {
    onChange(allSelected ? [] : schools.map(s => s.email));
  };

  const toggleOne = (email) => {
    onChange(
      selected.includes(email)
        ? selected.filter(e => e !== email)
        : [...selected, email],
    );
  };

  const label = () => {
    if (loading)              return 'Loading recipients…';
    if (schools.length === 0) return 'No coordinator emails found';
    if (allSelected)          return `All ${selected.length} coordinators selected`;
    if (selected.length > 0)  return `${selected.length} of ${schools.length} selected`;
    return 'Select recipients…';
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !loading && schools.length > 0 && setOpen(v => !v)}
        className={`
          w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border
          bg-white text-left text-sm font-semibold transition-all duration-200
          ${open
            ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
            : 'border-slate-200 hover:border-slate-300 shadow-sm'}
          ${(loading || schools.length === 0) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className={selected.length > 0 ? 'text-slate-900' : 'text-slate-400'}>
          {label()}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {selected.length > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {selected.length}
            </span>
          )}
          {open
            ? <FiChevronUp className="w-4 h-4 text-slate-500" />
            : <FiChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          {/* Select All row */}
          <button
            type="button"
            onClick={toggleAll}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-800 hover:bg-blue-50 transition-colors border-b border-slate-100"
          >
            <span className={`
              w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors
              ${allSelected
                ? 'bg-blue-600 border-blue-600'
                : someSelected
                  ? 'bg-blue-100 border-blue-400'
                  : 'border-slate-300'}
            `}>
              {allSelected && <FiCheck className="w-3 h-3 text-white" />}
              {someSelected && !allSelected && <span className="w-2 h-0.5 bg-blue-600 block" />}
            </span>
            <span>Select All ({schools.length} coordinators)</span>
          </button>

          {/* Individual schools */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50">
            {schools.map(school => {
              const checked = selected.includes(school.email);
              return (
                <button
                  key={school.email}
                  type="button"
                  onClick={() => toggleOne(school.email)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className={`
                    w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}
                  `}>
                    {checked && <FiCheck className="w-3 h-3 text-white" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{school.name}</p>
                    <p className="text-xs text-slate-400 font-mono truncate">{school.email}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Modal ───────────────────────────────────────────────────────────────
const BroadcastModal = ({ isOpen, onClose }) => {
  const [schools,  setSchools]  = useState([]);   // { name, email }
  const [fetching, setFetching] = useState(false);
  const [selected, setSelected] = useState([]);   // array of email strings

  const [subject,  setSubject]  = useState('');
  const [htmlBody, setHtmlBody] = useState('');

  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errMsg, setErrMsg] = useState('');

  // Fetch coordinator emails from Firestore when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setFetching(true);
    setSelected([]);
    setSubject('');
    setHtmlBody('');
    setStatus('idle');
    setErrMsg('');

    getDocs(collection(firestore, 'schools'))
      .then(snap => {
        if (!isMounted) return;
        const list = snap.docs
          .map(d => {
            const data = d.data();
            const email = data.coordinatorEmail || data.loginEmail || '';
            return { name: data.schoolName || data.school_name || 'Unknown School', email };
          })
          .filter(s => s.email && s.email.includes('@'));
        setSchools(list);
      })
      .catch(err => {
        console.error('BroadcastModal: failed to fetch schools', err);
      })
      .finally(() => {
        if (isMounted) setFetching(false);
      });

    return () => { isMounted = false; };
  }, [isOpen]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const canSend = selected.length > 0 && subject.trim() && htmlBody.trim() && status !== 'sending';

  const handleSend = async () => {
    if (!canSend) return;

    if (!BREVO_API_KEY || BREVO_API_KEY === 'your_brevo_api_key_here') {
      setErrMsg('Brevo API key is not configured. Please set VITE_BREVO_API_KEY in your .env.local file.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrMsg('');

    const recipients = schools.filter(s => selected.includes(s.email));

    try {
      await sendBrevoEmail({
        recipients,
        subject: subject.trim(),
        htmlContent: htmlBody,
      });
      setStatus('success');
    } catch (err) {
      setErrMsg(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status === 'sending') return;
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Broadcast Update"
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          onClick={e => e.stopPropagation()}
          className="pointer-events-auto w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* ── Header ────────────────────────────────── */}
          <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md">
                <FiRadio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Broadcast Update</h2>
                <p className="text-xs text-slate-500 font-medium">Send an email to school coordinators via Brevo</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={status === 'sending'}
              className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all disabled:opacity-40"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          {/* ── Body ──────────────────────────────────── */}
          <div className="px-8 py-6 space-y-5">

            {/* Recipients */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Recipients
                {schools.length > 0 && (
                  <span className="ml-2 text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {schools.length} available
                  </span>
                )}
              </label>
              <RecipientDropdown
                schools={schools}
                selected={selected}
                onChange={setSelected}
                loading={fetching}
              />
              {selected.length > 0 && (
                <p className="mt-2 text-xs text-slate-400 font-medium">
                  Email will be sent to{' '}
                  <span className="font-bold text-slate-700">{selected.length}</span>{' '}
                  coordinator{selected.length !== 1 ? 's' : ''}.
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="broadcast-subject" className="block text-sm font-bold text-slate-800 mb-2">
                Subject
              </label>
              <input
                id="broadcast-subject"
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                disabled={status === 'sending' || status === 'success'}
                placeholder="e.g. Important Update – KBE Examination 2024"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all shadow-sm disabled:opacity-60"
              />
            </div>

            {/* HTML Body */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="broadcast-body" className="block text-sm font-bold text-slate-800">
                  Email Content
                </label>
                <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                  HTML supported
                </span>
              </div>
              <textarea
                id="broadcast-body"
                value={htmlBody}
                onChange={e => setHtmlBody(e.target.value)}
                disabled={status === 'sending' || status === 'success'}
                rows={8}
                placeholder={"<p>Dear Coordinator,</p>\n<p>We have an important update regarding the KBE examination…</p>\n<br/>\n<p>Regards,<br/>KBE Admin Team</p>"}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all shadow-sm resize-none disabled:opacity-60"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                You can use HTML tags like{' '}
                <code className="bg-slate-100 px-1 rounded">&lt;p&gt;</code>,{' '}
                <code className="bg-slate-100 px-1 rounded">&lt;b&gt;</code>,{' '}
                <code className="bg-slate-100 px-1 rounded">&lt;br/&gt;</code>,{' '}
                <code className="bg-slate-100 px-1 rounded">&lt;ul&gt;</code> etc.
              </p>
            </div>

            {/* Status banners */}
            {status === 'success' && (
              <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3.5">
                <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">Broadcast sent successfully!</p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    Email delivered to {selected.length} coordinator{selected.length !== 1 ? 's' : ''} via Brevo.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
                <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-800">Failed to send</p>
                  <p className="text-xs text-red-600 mt-0.5">{errMsg}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer ────────────────────────────────── */}
          <div className="flex items-center justify-between px-8 py-5 bg-slate-50 rounded-b-[2rem] border-t border-slate-100 gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <FiMail className="w-3.5 h-3.5" />
              Powered by Brevo
            </div>

            <div className="flex items-center gap-3">
              {status !== 'success' && (
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={status === 'sending'}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 text-sm font-bold transition-all disabled:opacity-40"
                >
                  Cancel
                </button>
              )}

              {status === 'success' ? (
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-md"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  Done
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!canSend}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md ${
                    canSend
                      ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {status === 'sending' ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      Send Broadcast
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BroadcastModal;
