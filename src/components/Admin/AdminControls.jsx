import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FiToggleLeft, FiToggleRight, FiLoader } from 'react-icons/fi';
import { firestore } from '../../lib/firebase';

const SETTINGS_DOC = doc(firestore, 'settings', 'platformControls');

const defaultSettings = {
  registrationsOpen: true,
  studentRegistrationsOpen: true,
  resultsVisible: false,
  certificatesVisible: false,
};

// ─── Toggle Row ───────────────────────────────────────────────────────────────
const ToggleRow = ({ label, description, value, onChange, saving }) => (
  <div className="bg-white/60 border border-white p-5 rounded-2xl flex items-center justify-between shadow-sm hover:bg-white transition-colors">
    <div className="min-w-0 pr-4">
      <h4 className="font-bold text-slate-900 text-sm">{label}</h4>
      <p className="text-xs text-slate-500 font-medium mt-1">{description}</p>
    </div>
    <button
      type="button"
      onClick={() => !saving && onChange(!value)}
      disabled={saving}
      className={`relative flex-shrink-0 w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none disabled:opacity-60 ${
        value ? 'bg-blue-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
          value ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminControls = () => {
  const [settings, setSettings]   = useState(defaultSettings);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [savedKey, setSavedKey]   = useState(null); // which key just saved

  // Load settings from Firestore
  useEffect(() => {
    let isMounted = true;
    getDoc(SETTINGS_DOC)
      .then(snap => {
        if (isMounted) {
          setSettings(snap.exists() ? { ...defaultSettings, ...snap.data() } : defaultSettings);
        }
      })
      .catch(err => console.error('Failed to load platform controls:', err))
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const handleToggle = async (key, newValue) => {
    const updated = { ...settings, [key]: newValue };
    setSettings(updated);   // optimistic
    setSaving(true);
    setSavedKey(null);
    try {
      await setDoc(SETTINGS_DOC, updated, { merge: true });
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2000);
    } catch (err) {
      console.error('Failed to save setting:', err);
      setSettings(settings); // revert
    } finally {
      setSaving(false);
    }
  };

  const controls = [
    {
      key: 'registrationsOpen',
      label: 'School Registrations',
      descOn:  'Open — new schools can sign up.',
      descOff: 'Closed — new school registrations are blocked.',
    },
    {
      key: 'studentRegistrationsOpen',
      label: 'Student Registrations',
      descOn:  'Open — registered schools can add students.',
      descOff: 'Closed — adding students is blocked for all schools.',
    },
    {
      key: 'resultsVisible',
      label: 'Results',
      descOn:  'Visible — Results link appears in navbar (replaces Rocket Launch).',
      descOff: 'Hidden — Results page is not accessible.',
    },
    {
      key: 'certificatesVisible',
      label: 'Certificates',
      descOn:  'Visible — Certificates link appears in navbar (replaces Contact).',
      descOff: 'Hidden — Certificates page is not accessible.',
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Platform Controls</h2>
        <p className="text-slate-600 font-medium">Toggle examination phases. Changes apply instantly across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ── Lifecycle Toggles ─────────────────────────────── */}
        <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-100 overflow-hidden">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between mb-6 border-b border-white/50 pb-4">
              <h3 className="text-xl font-bold text-slate-900">Lifecycle Management</h3>
              {saving && (
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <FiLoader className="w-3.5 h-3.5 animate-spin" />
                  Saving…
                </span>
              )}
              {!saving && savedKey && (
                <span className="text-xs text-emerald-600 font-bold">✓ Saved</span>
              )}
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-20 bg-white/60 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {controls.map(ctrl => (
                  <ToggleRow
                    key={ctrl.key}
                    label={ctrl.label}
                    description={
                      settings[ctrl.key] ? ctrl.descOn : ctrl.descOff
                    }
                    value={settings[ctrl.key]}
                    onChange={val => handleToggle(ctrl.key, val)}
                    saving={saving}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Rocket Launch Module ──────────────────────────── */}
        <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-700 overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600 rounded-full blur-2xl z-0" />
          <div className="relative z-10 p-8 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-2xl font-extrabold text-white mb-2">Rocket Launch Module</h3>
              <p className="text-blue-100 font-medium leading-relaxed mb-6 text-sm">
                Manage separate registrations and input physical evaluation scores for the specialized practical event.
              </p>
            </div>
            <button className="w-full py-4 rounded-xl bg-white text-blue-800 font-bold hover:bg-blue-50 transition-colors shadow-md">
              Launch Module Portal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminControls;