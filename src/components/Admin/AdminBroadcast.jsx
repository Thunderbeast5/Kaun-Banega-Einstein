import React, { useEffect, useRef, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import {
  FiRadio, FiChevronDown, FiChevronUp, FiCheck,
  FiSend, FiAlertCircle, FiCheckCircle, FiLoader, FiMail, FiUsers,
} from 'react-icons/fi';
import { firestore } from '../../lib/firebase';

// ─── Brevo config (from .env.local) ──────────────────────────────────────────
const BREVO_API_KEY  = import.meta.env.VITE_BREVO_API_KEY;
const SENDER_EMAIL   = import.meta.env.VITE_BREVO_SENDER_EMAIL;
const SENDER_NAME    = import.meta.env.VITE_BREVO_SENDER_NAME;

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

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allSelected  = selected.length === schools.length && schools.length > 0;
  const someSelected = selected.length > 0 && !allSelected;

  const toggleAll = () => onChange(allSelected ? [] : schools.map(s => s.email));
  const toggleOne = (email) => onChange(
    selected.includes(email)
      ? selected.filter(e => e !== email)
      : [...selected, email],
  );

  const label = () => {
    if (loading)              return 'Loading recipients…';
    if (schools.length === 0) return 'No coordinator emails found';
    if (allSelected)          return `All ${selected.length} coordinators selected`;
    if (selected.length > 0)  return `${selected.length} of ${schools.length} selected`;
    return 'Select recipients…';
  };

  return (
    <div ref={ref}>
      <button
        type="button"
        onClick={() => !loading && schools.length > 0 && setOpen(v => !v)}
        className={`
          w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border
          bg-white text-left text-sm font-semibold transition-all duration-200
          ${open ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm' : 'border-slate-200 hover:border-slate-300 shadow-sm'}
          ${(loading || schools.length === 0) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className={selected.length > 0 ? 'text-slate-900' : 'text-slate-400'}>{label()}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {selected.length > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {selected.length}
            </span>
          )}
          {open ? <FiChevronUp className="w-4 h-4 text-slate-500" /> : <FiChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {open && (
        <div className="mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-md">
          {/* Select All – sticky at top */}
          <div className="sticky top-0 bg-white z-10 rounded-t-2xl border-b border-slate-100">
            <button
              type="button"
              onClick={toggleAll}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-slate-800 hover:bg-blue-50 transition-colors rounded-t-2xl"
            >
              <span className={`
                w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors
                ${allSelected ? 'bg-blue-600 border-blue-600' : someSelected ? 'bg-blue-100 border-blue-400' : 'border-slate-300'}
              `}>
                {allSelected && <FiCheck className="w-3 h-3 text-white" />}
                {someSelected && !allSelected && <span className="w-2 h-0.5 bg-blue-600 block" />}
              </span>
              Select All — {schools.length} coordinators
            </button>
          </div>

          {/* Scrollable school list */}
          <div className="max-h-52 overflow-y-auto divide-y divide-slate-50">
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

// ─── Main Page ────────────────────────────────────────────────────────────────
const AdminBroadcast = () => {
  const [schools,  setSchools]  = useState([]);
  const [fetching, setFetching] = useState(true);
  const [selected, setSelected] = useState([]);

  const [subject,  setSubject]  = useState('');
  const [htmlBody, setHtmlBody] = useState('');

  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errMsg, setErrMsg] = useState('');

  // Fetch coordinator emails
  useEffect(() => {
    let isMounted = true;
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
      .catch(err => console.error('AdminBroadcast: failed to fetch schools', err))
      .finally(() => { if (isMounted) setFetching(false); });
    return () => { isMounted = false; };
  }, []);

  const canSend = selected.length > 0 && subject.trim() && htmlBody.trim() && status !== 'sending';

  const handleSend = async () => {
    if (!canSend) return;

    if (!BREVO_API_KEY) {
      setErrMsg('Brevo API key is missing. Please set VITE_BREVO_API_KEY in your .env.local file.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrMsg('');

    const recipients = schools.filter(s => selected.includes(s.email));
    try {
      await sendBrevoEmail({ recipients, subject: subject.trim(), htmlContent: htmlBody });
      setStatus('success');
    } catch (err) {
      setErrMsg(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setSubject('');
    setHtmlBody('');
    setSelected([]);
    setStatus('idle');
    setErrMsg('');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Broadcast Update</h2>
          <p className="text-slate-600 font-medium">Compose and send an email to school coordinators via Brevo.</p>
        </div>
        {/* Recipient summary pill */}
        {!fetching && schools.length > 0 && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm text-sm font-semibold text-slate-600">
            <FiUsers className="w-4 h-4 text-blue-600" />
            <span><span className="text-slate-900 font-extrabold">{schools.length}</span> coordinators available</span>
          </div>
        )}
      </div>

      {/* ── Two-column layout on large screens ─────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left – Compose area */}
        <div className="xl:col-span-2 space-y-6">

          {/* Recipients card */}
          <div className="relative rounded-[2rem] border border-slate-200/60 bg-white shadow-sm">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0 rounded-[2rem]" />
            <div className="relative z-10 p-6 sm:p-8">
              <h3 className="text-base font-extrabold text-slate-900 mb-1">Recipients</h3>
              <p className="text-sm text-slate-500 font-medium mb-4">Choose which school coordinators receive this email.</p>
              <RecipientDropdown
                schools={schools}
                selected={selected}
                onChange={setSelected}
                loading={fetching}
              />
              {selected.length > 0 && (
                <p className="mt-3 text-xs text-slate-400 font-medium">
                  Email will be sent to{' '}
                  <span className="font-bold text-slate-700">{selected.length}</span>{' '}
                  coordinator{selected.length !== 1 ? 's' : ''}.
                </p>
              )}
            </div>
          </div>

          {/* Compose card */}
          <div className="relative rounded-[2rem] border border-slate-200/60 bg-white shadow-sm overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-6 sm:p-8 space-y-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1">Compose Email</h3>
                <p className="text-sm text-slate-500 font-medium">HTML is supported in the content body.</p>
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
                  placeholder="e.g. Important Update – KBE Examination 2026"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all shadow-sm disabled:opacity-60"
                />
              </div>

              {/* HTML Body */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="broadcast-body" className="block text-sm font-bold text-slate-800">
                    Email Content
                  </label>
                  <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">HTML supported</span>
                </div>
                <textarea
                  id="broadcast-body"
                  value={htmlBody}
                  onChange={e => setHtmlBody(e.target.value)}
                  disabled={status === 'sending' || status === 'success'}
                  rows={12}
                  placeholder={"<p>Dear Coordinator,</p>\n<p>We have an important update regarding the KBE examination…</p>\n<br/>\n<p>Regards,<br/>KBE Admin Team</p>"}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all shadow-sm resize-none disabled:opacity-60"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Supported tags:{' '}
                  {['<p>', '<b>', '<i>', '<br/>', '<ul>', '<li>', '<a>', '<h2>'].map(tag => (
                    <code key={tag} className="bg-slate-100 px-1 rounded mx-0.5">{tag}</code>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right – Actions & status */}
        <div className="space-y-5">

          {/* Send card */}
          <div className="relative rounded-[2rem] border border-slate-200/60 bg-white shadow-sm overflow-hidden sticky top-0">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-6 sm:p-8 space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 mb-1">Send Broadcast</h3>
                <p className="text-sm text-slate-500 font-medium">Review your email before sending.</p>
              </div>

              {/* Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Recipients</span>
                  <span className={`font-bold ${selected.length > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                    {selected.length > 0 ? `${selected.length} selected` : 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Subject</span>
                  <span className={`font-bold truncate max-w-[120px] ${subject.trim() ? 'text-slate-900' : 'text-slate-400'}`}>
                    {subject.trim() || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500 font-medium">Content</span>
                  <span className={`font-bold ${htmlBody.trim() ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {htmlBody.trim() ? `${htmlBody.trim().length} chars` : 'Empty'}
                  </span>
                </div>
              </div>

              {/* Status banners */}
              {status === 'success' && (
                <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3.5">
                  <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-emerald-800">Sent successfully!</p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      Delivered to {selected.length} coordinator{selected.length !== 1 ? 's' : ''}.
                    </p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
                  <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-800">Failed to send</p>
                    <p className="text-xs text-red-600 mt-0.5 break-words">{errMsg}</p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {status === 'success' ? (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all shadow-md"
                >
                  <FiRadio className="w-4 h-4" />
                  New Broadcast
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!canSend}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-md ${
                    canSend
                      ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {status === 'sending' ? (
                    <><FiLoader className="w-4 h-4 animate-spin" /> Sending…</>
                  ) : (
                    <><FiSend className="w-4 h-4" /> Send Broadcast</>
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium pt-1">
                <FiMail className="w-3.5 h-3.5" />
                Powered by Brevo
              </div>
            </div>
          </div>

          {/* Tips card */}
          <div className="relative rounded-[2rem] border border-slate-200/60 bg-blue-50 shadow-sm overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-6">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">Tips</p>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Use <strong>&lt;p&gt;</strong> tags to wrap paragraphs for proper spacing.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Add <strong>&lt;b&gt;</strong> for bold text and <strong>&lt;i&gt;</strong> for italics.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Sender email must be verified in your Brevo account.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Free Brevo plan supports 300 emails/day.
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminBroadcast;
