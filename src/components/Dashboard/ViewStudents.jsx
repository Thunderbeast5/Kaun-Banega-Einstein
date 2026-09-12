import React, { useState, useEffect } from 'react';
import {
  FiSearch, FiFilter, FiEdit2, FiTrash2,
  FiX, FiCheck, FiAlertCircle, FiLoader, FiUser,
} from 'react-icons/fi';
import {
  collection, doc, onSnapshot,
  updateDoc, deleteDoc, orderBy, query,
} from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import ViewStudentsSkeleton from './skeletons/ViewStudentsSkeleton';

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EditModal = ({ student, onClose, onSave }) => {
  const [form, setForm] = useState({
    name:       student.name       ?? '',
    grade:      student.grade      ?? '',
    division:   student.division   ?? '',
    rollNumber: student.rollNumber ?? '',
    parentName: student.parentName ?? '',
    relation:   student.relation   ?? '',
    mobile:     student.mobile     ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const handleInput = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message || 'Could not save changes.');
      setSaving(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-slate-100">
          <h3 className="text-xl font-extrabold text-slate-900">Edit Student</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="px-8 py-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">

          <ModalInput label="Full Name"      name="name"       value={form.name}       onChange={handleInput} required />
          
          <div className="grid grid-cols-2 gap-4">
            <ModalSelect label="Class" name="grade" value={form.grade} onChange={handleInput} required>
              <option value="">Select</option>
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
            </ModalSelect>
            <ModalSelect label="Division" name="division" value={form.division} onChange={handleInput} required>
              <option value="">Select</option>
              {['A','B','C','D','E','F'].map(d => <option key={d} value={d}>{d}</option>)}
            </ModalSelect>
          </div>

          <ModalInput label="Roll Number"    name="rollNumber" value={form.rollNumber} onChange={handleInput} required />
          <ModalInput label="Parent Name"    name="parentName" value={form.parentName} onChange={handleInput} required />

          <ModalSelect label="Relation" name="relation" value={form.relation} onChange={handleInput} required>
            <option value="">Select</option>
            <option value="father">Father</option>
            <option value="mother">Mother</option>
            <option value="guardian">Guardian</option>
          </ModalSelect>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">Mobile</label>
            <div className="flex">
              <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600">+91</span>
              <input
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleInput}
                pattern="[0-9]{10}"
                maxLength={10}
                required
                className="w-full rounded-r-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 font-semibold flex items-center gap-2">
              <FiAlertCircle className="w-4 h-4" /> {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {saving
                ? <><FiLoader className="w-4 h-4 animate-spin" /> Saving…</>
                : <><FiCheck className="w-4 h-4" /> Save Changes</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Delete Confirm Modal ────────────────────────────────────────────────────
const DeleteModal = ({ student, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <FiTrash2 className="w-7 h-7 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Remove Student?</h3>
            <p className="text-slate-500 font-medium text-sm">
              <span className="font-bold text-slate-700">{student.name}</span> will be permanently removed from your roster.
              This cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 w-full pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {deleting
                ? <><FiLoader className="w-4 h-4 animate-spin" /> Removing…</>
                : 'Yes, Remove'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ViewStudents = ({ schoolInfo }) => {
  const [students, setStudents]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [editTarget, setEditTarget]   = useState(null); // student object
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Real-time Firestore listener ──────────────────────────────────────────
  useEffect(() => {
    if (!schoolInfo?.udise) return;

    const rosterRef = collection(
      doc(firestore, 'students', String(schoolInfo.udise)),
      'roster'
    );
    const q = query(rosterRef, orderBy('registeredAt', 'desc'));

    const unsub = onSnapshot(
      q,
      (snap) => {
        setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('Firestore snapshot error:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [schoolInfo?.udise]);

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = students.filter((s) => {
    const matchSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.applicationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGrade = gradeFilter === 'All' || s.grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const handleSaveEdit = async (updatedFields) => {
    const docRef = doc(
      collection(doc(firestore, 'students', String(schoolInfo.udise)), 'roster'),
      editTarget.id
    );
    await updateDoc(docRef, updatedFields);
  };

  const handleConfirmDelete = async () => {
    const docRef = doc(
      collection(doc(firestore, 'students', String(schoolInfo.udise)), 'roster'),
      deleteTarget.id
    );
    await deleteDoc(docRef);
    setDeleteTarget(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) return <ViewStudentsSkeleton />;

  return (
    <>
      {/* Edit Modal */}
      {editTarget && (
        <EditModal
          student={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          student={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Student Roster</h2>
          <p className="text-slate-600 font-medium">
            View and manage all students registered from your school.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, app no., or roll no."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm font-medium transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm appearance-none cursor-pointer"
              >
                <option value="All">All Grades</option>
                <option value="9">9th Grade</option>
                <option value="10">10th Grade</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table card */}
        <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-50 overflow-hidden">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          <div className="relative z-10 p-2 sm:p-6">

            <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Photo', 'App No.', 'Full Name', 'Class', 'Contact', 'Actions'].map((col) => (
                      <th key={col} className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filtered.length > 0 ? (
                    filtered.map((student) => (
                      <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">

                        {/* Photo */}
                        <td className="py-3 px-5">
                          {student.photoUrl ? (
                            <img
                              src={student.photoUrl}
                              alt={student.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                              <FiUser className="w-4 h-4 text-blue-500" />
                            </div>
                          )}
                        </td>

                        {/* Application number */}
                        <td className="py-3 px-5 font-mono font-bold text-blue-700 text-xs">
                          {student.applicationNumber ?? student.id}
                        </td>

                        {/* Name */}
                        <td className="py-3 px-5 font-bold text-slate-900">{student.name}</td>

                        {/* Class + Division */}
                        <td className="py-3 px-5 text-slate-600 font-medium">
                          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                            {student.grade ? `${student.grade}th` : '—'}
                            {student.division ? ` – ${student.division}` : ''}
                          </span>
                        </td>

                        {/* Contact */}
                        <td className="py-3 px-5 text-slate-600 font-medium">
                          {student.mobile ? `+91 ${student.mobile}` : '—'}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setEditTarget(student)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit student"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(student)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove student"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-16 text-center text-slate-500 font-medium">
                        {students.length === 0
                          ? 'No students registered yet. Use "Register Students" to add your first student.'
                          : 'No students match your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer count */}
            <div className="mt-5 px-2">
              <p className="text-sm font-medium text-slate-500">
                Showing{' '}
                <span className="font-bold text-slate-900">{filtered.length}</span>{' '}
                of{' '}
                <span className="font-bold text-slate-900">{students.length}</span>{' '}
                registered students
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

// ─── Modal field helpers ──────────────────────────────────────────────────────
const ModalInput = ({ label, name, value, onChange, required, type = 'text' }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-slate-700">{label}</label>
    <input
      type={type} name={name} value={value} onChange={onChange}
      required={required}
      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
    />
  </div>
);

const ModalSelect = ({ label, name, value, onChange, children, required }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-slate-700">{label}</label>
    <select
      name={name} value={value} onChange={onChange} required={required}
      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
    >
      {children}
    </select>
  </div>
);

export default ViewStudents;