import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCheckSquare, FiGlobe, FiUsers, FiLayers } from 'react-icons/fi';

const KBESyllabus = () => {
  const syllabusData = [
    { no: 1, subject: 'Physics', questions: 10, marks: 10 },
    { no: 2, subject: 'Chemistry', questions: 10, marks: 10 },
    { no: 3, subject: 'Mathematics', questions: 10, marks: 10 },
    { no: 4, subject: 'Biology & Environment', questions: 10, marks: 10 },
    { no: 5, subject: "Einstein's Biography", questions: 10, marks: 10 },
  ];

  return (
    <section id="syllabus" className="relative py-12 sm:py-16 md:py-24 bg-slate-50 overflow-hidden z-0">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 md:w-[40rem] h-72 md:h-[40rem] bg-blue-400/20 rounded-full blur-[80px] md:blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 md:mb-16 text-center max-w-3xl mx-auto px-1 sm:px-0"
        >
          <span className="block italic text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.2em] text-blue-700 uppercase mb-2 sm:mb-3 md:mb-4">
            KBE 2026 • Exam Blueprint
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-3 sm:mb-4 md:mb-6">
            Syllabus & Pattern.
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 font-light leading-relaxed">
            Exclusively designed for <strong className="font-semibold text-slate-800">Class 10th Studying Candidates</strong>, fully based on the 10th STD syllabus with <strong className="font-semibold text-blue-700">60% State Board</strong> & <strong className="font-semibold text-blue-700">40% NCERT</strong> curriculum weightage.
          </p>
        </motion.div>

        {/* Main Glassmorphic Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="group relative max-w-5xl mx-auto rounded-[1.25rem] sm:rounded-[1.5rem] md:rounded-[2.5rem] border border-white/70 bg-blue-100/70 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden p-3.5 sm:p-6 md:p-12"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-300/40 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700 ease-out" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-sky-300/40 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700 ease-out" />

          {/* Top Quick-Info Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 mb-5 sm:mb-8 md:mb-10">
            <div className="flex items-center gap-3 bg-white/75 border border-white/80 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl shadow-sm">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center shrink-0">
                <FiUsers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Eligibility</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">Class 10th Students</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/75 border border-white/80 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl shadow-sm">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center shrink-0">
                <FiLayers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Weightage</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">60% State • 40% NCERT</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/75 border border-white/80 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
                <FiClock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Duration & Pace</span>
                <span className="text-xs sm:text-sm font-bold text-slate-900">90 Mins (108 Sec/Que.)</span>
              </div>
            </div>
          </div>

          {/* Syllabus Table - Zero Horizontal Scroll */}
          <div className="w-full rounded-xl sm:rounded-2xl border border-white/80 bg-white/85 shadow-sm mb-5 sm:mb-8 md:mb-10 overflow-hidden">
            <table className="w-full table-fixed text-left border-collapse">
              <thead>
                <tr className="bg-blue-700 text-white text-[10px] sm:text-xs md:text-sm uppercase tracking-wider">
                  <th className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 md:px-6 font-bold w-9 sm:w-16 text-center">
                    No.
                  </th>
                  <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 md:px-6 font-bold">
                    Subjects
                  </th>
                  <th className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 md:px-6 font-bold w-20 sm:w-36 md:w-44 text-center leading-tight">
                    <span className="sm:hidden">Ques.</span>
                    <span className="hidden sm:inline">No. of Questions</span>
                  </th>
                  <th className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 md:px-6 font-bold w-20 sm:w-32 md:w-40 text-center">
                    Marks
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100 text-xs sm:text-sm md:text-base text-slate-800">
                {syllabusData.map((row) => (
                  <tr
                    key={row.no}
                    className="hover:bg-blue-50/80 transition-colors duration-200"
                  >
                    <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 md:px-6 font-bold text-blue-700 text-center">
                      {row.no}
                    </td>
                    <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 md:px-6 font-semibold text-slate-900 break-words leading-snug">
                      {row.subject}
                    </td>
                    <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 md:px-6 font-medium text-center">
                      {row.questions}
                    </td>
                    <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 md:px-6 font-medium text-center">
                      {row.marks}
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="bg-blue-100/90 font-extrabold text-slate-900 border-t-2 border-blue-200">
                  <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 md:px-6 text-center">—</td>
                  <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 md:px-6">Total</td>
                  <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 md:px-6 text-center text-blue-800">50</td>
                  <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 md:px-6 text-center text-blue-800">50</td>
                </tr>

                {/* Time Given Row */}
                <tr className="bg-amber-100/80 font-extrabold text-slate-900">
                  <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 md:px-6 text-center">—</td>
                  <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 md:px-6">
                    <div className="flex items-center gap-1.5">
                      <FiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700 shrink-0" />
                      <span>Time Given</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-1 sm:py-3.5 sm:px-4 md:px-6 text-center text-amber-900 leading-tight">
                    90 Mins
                  </td>
                  <td className="py-2.5 px-1 sm:py-3.5 sm:px-4 md:px-6 text-center text-amber-900 leading-tight">
                    108 Sec/Que.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Exam Mode & Medium Pills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-3.5 bg-white/80 border border-white px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl shadow-sm">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FiCheckSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-700">
                  Mode of Exam
                </span>
                <span className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900">
                  Offline OMR Based MCQ Pattern
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-3.5 bg-white/80 border border-white px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl shadow-sm">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FiGlobe className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-700">
                  Medium of Instructions
                </span>
                <span className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900">
                  English & Marathi
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default KBESyllabus;