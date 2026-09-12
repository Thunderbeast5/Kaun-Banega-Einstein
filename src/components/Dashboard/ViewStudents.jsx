import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import ViewStudentsSkeleton from './skeletons/ViewStudentsSkeleton';

const ViewStudents = ({ loading: externalLoading }) => {
  const [loading, setLoading] = useState(externalLoading ?? true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <ViewStudentsSkeleton />;


  // Mock student data
  const students = [
    { id: 'KBE-001', name: 'Aarav Sharma', grade: '10th', contact: '+91 9876543210', status: 'Verified' },
    { id: 'KBE-002', name: 'Priya Patel', grade: '9th', contact: '+91 8765432109', status: 'Verified' },
    { id: 'KBE-003', name: 'Rohan Desai', grade: '10th', contact: '-', status: 'Pending' },
    { id: 'KBE-004', name: 'Ananya Singh', grade: '9th', contact: '+91 7654321098', status: 'Verified' },
    { id: 'KBE-005', name: 'Vihaan Kumar', grade: '10th', contact: '+91 6543210987', status: 'Verified' },
    { id: 'KBE-006', name: 'Diya Joshi', grade: '9th', contact: '-', status: 'Verified' },
    { id: 'KBE-007', name: 'Aditya Patil', grade: '10th', contact: '+91 5432109876', status: 'Pending' },
  ];

  // Simple filtering logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'All' || student.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Area */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Student Roster</h2>
        <p className="text-slate-600 font-medium">View, search, and manage all students registered from your school.</p>
      </div>

      {/* Toolbar (Search & Filters) */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or Reg ID..." 
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
              className="w-full pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm appearance-none transition-all cursor-pointer"
            >
              <option value="All">All Grades</option>
              <option value="9th">9th Grade</option>
              <option value="10th">10th Grade</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
        <div className="relative z-10 p-2 sm:p-6">
          
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Reg ID</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-blue-700">{student.id}</td>
                      <td className="py-4 px-6 font-bold text-slate-900">{student.name}</td>
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                          {student.grade}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">{student.contact}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          student.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="More Options">
                            <FiMoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                      No students found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination / Footer */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            <p className="text-sm font-medium text-slate-600">
              Showing <span className="font-bold text-slate-900">{filteredStudents.length}</span> of <span className="font-bold text-slate-900">{students.length}</span> registered students
            </p>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors shadow-sm disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white hover:text-slate-900 transition-colors shadow-sm">
                Next
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ViewStudents;