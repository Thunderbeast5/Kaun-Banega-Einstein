import React, { useEffect, useState } from 'react';
import {
  collection, doc, getDocs, getCountFromServer, orderBy, query, where
} from 'firebase/firestore';
import { FiUsers, FiArrowLeft, FiSearch, FiFilter } from 'react-icons/fi';
import { firestore } from '../../lib/firebase';
import AdminApprovalsSkeleton from './skeletons/AdminApprovalsSkeleton';

// ─── Inline student panel ─────────────────────────────────────────────────────
const StudentPanel = ({ school, onBack }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        let snap;
        if (school.isIndividual) {
          const indRef = collection(firestore, 'individual_students');
          const q = query(indRef, where('udise', '==', school.id), orderBy('createdAt', 'desc'));
          snap = await getDocs(q);
        } else {
          const rosterRef = collection(doc(firestore, 'students', String(school.id)), 'roster');
          const q = query(rosterRef, orderBy('registeredAt', 'desc'));
          snap = await getDocs(q);
        }
        if (isMounted) setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [school.id]);

  const filtered = students.filter(s => {
    const matchesSearch =
      !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.applicationNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(search.toLowerCase());

    const studentGrade = String(s.grade ?? '');
    const matchesGrade = gradeFilter === 'All' || studentGrade === String(gradeFilter);

    return matchesSearch && matchesGrade;
  });

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Back header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-700 font-bold text-sm transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-blue-300 group-hover:bg-blue-50 transition-colors">
            <FiArrowLeft className="w-4 h-4" />
          </div>
          Back to Schools
        </button>
      </div>

      {/* Panel heading */}
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">{school.name}</h2>
        <p className="text-slate-500 font-mono text-sm">UDISE: {school.id}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, app no., or roll no."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm font-medium transition-all text-sm"
          />
        </div>

        <div className="relative w-full sm:w-52">
          <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <select
            value={gradeFilter}
            onChange={e => setGradeFilter(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm appearance-none cursor-pointer text-sm"
          >
            <option value="All">All Classes</option>
            <option value="9">9th Class</option>
            <option value="10">10th Class</option>
          </select>
        </div>
      </div>

      {/* Table card */}
      <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
        <div className="relative z-10 p-4 sm:p-8">
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 bg-white/70 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['App No.', 'Full Name', 'Class', 'Parent', 'Contact'].map(col => (
                      <th key={col} className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filtered.length > 0 ? filtered.map(student => (
                    <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-bold text-blue-700 text-xs">
                        {student.applicationNumber ?? student.id}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-slate-900">{student.name ?? '—'}</td>
                      <td className="py-3.5 px-5">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                          {student.grade ? `${student.grade}th` : '—'}
                          {student.division ? ` – ${student.division}` : ''}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 font-medium">
                        <span className="block">{student.parentName ?? '—'}</span>
                        {student.relation && (
                          <span className="text-xs text-slate-400 capitalize">{student.relation}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 font-medium">
                        {(student.mobile || student.phone) ? `+91 ${student.mobile || student.phone}` : '—'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-16 text-center text-slate-400 font-medium text-sm">
                        {students.length === 0
                          ? 'No students registered for this school yet.'
                          : 'No students match your search.'}
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
                Showing{' '}
                <span className="font-bold text-slate-900">{filtered.length}</span>
                {' '}of{' '}
                <span className="font-bold text-slate-900">{students.length}</span>
                {' '}registered students
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminApprovals = () => {
  const [registeredSchools, setRegisteredSchools] = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [selectedSchool, setSelectedSchool]       = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadSchools = async () => {
      try {
        const schoolsSnapshot = await getDocs(collection(firestore, 'schools'));

        const schools = await Promise.all(
          schoolsSnapshot.docs.map(async (schoolDoc) => {
            const schoolData = schoolDoc.data();
            const udise = String(schoolData.udiseNumber || schoolDoc.id);
            const rosterRef = collection(firestore, 'students', udise, 'roster');
            const studentCountSnapshot = await getCountFromServer(rosterRef);

            return {
              id: schoolDoc.id,
              name: schoolData.schoolName || schoolData.school_name || 'Unknown School',
              students: studentCountSnapshot.data().count || 0,
              principalName: schoolData.principalName || 'Not available',
              principalPhone: schoolData.principalMobile || 'Not available',
              coordinatorName: schoolData.coordinatorName || 'Not available',
              coordinatorPhone: schoolData.coordinatorMobile || schoolData.coordinatorWhatsapp || 'Not available',
            };
          }),
        );

        // Add Individual Students grouped by school
        const indRef = collection(firestore, 'individual_students');
        const indSnapshot = await getDocs(indRef);
        if (!indSnapshot.empty) {
          const indSchoolsMap = new Map();
          indSnapshot.forEach(docSnap => {
            const student = docSnap.data();
            const udise = student.udise || 'UNKNOWN';
            if (!indSchoolsMap.has(udise)) {
              indSchoolsMap.set(udise, {
                id: udise,
                name: student.school || 'Unknown School',
                students: 0,
                principalName: 'Individual Registration',
                principalPhone: '—',
                coordinatorName: '—',
                coordinatorPhone: '—',
                isIndividual: true,
              });
            }
            indSchoolsMap.get(udise).students += 1;
          });
          indSchoolsMap.forEach(indSchool => schools.push(indSchool));
        }

        if (isMounted) {
          setRegisteredSchools(schools.sort((a, b) => b.students - a.students));
        }
      } catch (error) {
        console.error('Failed to load registered schools:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSchools();
    return () => { isMounted = false; };
  }, []);

  // Show student panel when a school is selected
  if (selectedSchool) {
    return <StudentPanel school={selectedSchool} onBack={() => setSelectedSchool(null)} />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">School Registrations</h2>
        <p className="text-slate-600 font-medium">View all registered schools and browse their student rosters.</p>
      </div>

      <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-50 overflow-hidden flex flex-col h-full">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
        <div className="relative z-10 p-4 sm:p-8 flex-1">
          {loading ? (
            <AdminApprovalsSkeleton />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">School / UDISE</th>
                    <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Students</th>
                    <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Principal</th>
                    <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Coordinator</th>
                    <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {registeredSchools.map((school) => (
                    <tr key={school.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors align-middle">
                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-900 flex items-center gap-2">
                          {school.name}
                          {school.isIndividual && (
                            <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              Individual
                            </span>
                          )}
                        </p>
                        <p className="font-mono text-xs text-slate-500 mt-1">UDISE: {school.id}</p>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                          {school.students}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-600 font-medium">
                        <div className="space-y-0.5">
                          <span className="block font-medium text-slate-800">{school.principalName}</span>
                          <span className="block text-xs text-slate-400">{school.principalPhone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-600 font-medium">
                        <div className="space-y-0.5">
                          <span className="block font-medium text-slate-800">{school.coordinatorName}</span>
                          <span className="block text-xs text-slate-400">{school.coordinatorPhone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-left">
                        <button
                          onClick={() => setSelectedSchool(school)}
                          className="inline-flex items-center justify-start gap-1.5 text-blue-700 hover:text-blue-800 font-bold text-xs transition-colors bg-transparent border-none p-0 shadow-none"
                        >
                          {/* <FiUsers className="w-3.5 h-3.5" /> */}
                          View Students
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApprovals;