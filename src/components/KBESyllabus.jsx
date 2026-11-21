import React from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiClock, FiCheckSquare, FiGlobe, FiUsers, FiLayers } from 'react-icons/fi';

const KBESyllabus = () => {
  const syllabusData = [
    { no: 1, subject: 'Physics', questions: 10, marks: 10 },
    { no: 2, subject: 'Chemistry', questions: 10, marks: 10 },
    { no: 3, subject: 'Mathematics', questions: 10, marks: 10 },
    { no: 4, subject: 'Biology & Environment', questions: 10, marks: 10 },
    { no: 5, subject: "Einstein's Biography", questions: 10, marks: 10 },
  ];

  return (
    <section id="kbe-syllabus" className="relative py-16 md:py-24 bg-slate-50 overflow-hidden z-0">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 md:w-[40rem] h-72 md:h-[40rem] bg-blue-400/20 rounded-full blur-[80px] md:blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center max-w-3xl mx-auto px-2 sm:px-0"
        >
          <span className="block italic text-xs md:text-sm font-bold tracking-[0.2em] text-blue-700 uppercase mb-3 md:mb-4">
            KBE 2026 • Exam Blueprint
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 md:mb-6">
            Syllabus & Pattern.
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 font-light leading-relaxed">
            Exclusively designed for <strong className="font-semibold text-slate-800">Class 10th Studying Candidates</strong>, fully based on the 10th STD syllabus with <strong className="font-semibold text-blue-700">60% State Board</strong> & <strong className="font-semibold text-blue-700">40% NCERT</strong> curriculum weightage.
          </p>
        </motion.div>

        {/* Main Glassmorphic Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="group relative max-w-5xl mx-auto rounded-[1.5rem] md:rounded-[2.5rem] border border-white/70 bg-blue-100/70 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden p-6 sm:p-8 md:p-12"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-300/40 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700 ease-out" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-sky-300/40 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700 ease-out" />

          {/* Top Quick-Info Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
            <div className="flex items-center gap-3 bg-white/75 border border-white/80 px-4 py-3 rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center shrink-0">
                <FiUsers className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Eligibility</span>
                <span className="text-sm font-bold text-slate-900">Class 10th Students</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/75 border border-white/80 px-4 py-3 rounded-2xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center shrink-0">
                <FiLayers className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Weightage</span>
                <span className="text-sm font-bold text-slate-900">60% State • 40% NCERT</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/75 border border-white/80 px-4 py-3 rounded-2xl shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
                <FiClock className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Duration & Pace</span>
                <span className="text-sm font-bold text-slate-900">90 Mins (108 Sec/Que.)</span>
              </div>
            </div>
          </div>

          {/* Syllabus Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/80 bg-white/80 shadow-sm mb-8 md:mb-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-700 text-white text-xs sm:text-sm uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6 font-bold w-16 text-center">No.</th>
                  <th className="py-3.5 px-4 sm:px-6 font-bold">Subjects</th>
                  <th className="py-3.5 px-4 sm:px-6 font-bold text-center">No. of Questions</th>
                  <th className="py-3.5 px-4 sm:px-6 font-bold text-center">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100 text-sm sm:text-base text-slate-800">
                {syllabusData.map((row) => (
                  <tr
                    key={row.no}
                    className="hover:bg-blue-50/80 transition-colors duration-200"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-blue-700 text-center">{row.no}</td>
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">{row.subject}</td>
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-center">{row.questions}</td>
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-center">{row.marks}</td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr className="bg-blue-100/90 font-extrabold text-slate-900 border-t-2 border-blue-200">
                  <td className="py-3.5 px-4 sm:px-6 text-center">—</td>
                  <td className="py-3.5 px-4 sm:px-6">Total</td>
                  <td className="py-3.5 px-4 sm:px-6 text-center text-blue-800">50</td>
                  <td className="py-3.5 px-4 sm:px-6 text-center text-blue-800">50</td>
                </tr>

                {/* Time Given Row */}
                <tr className="bg-amber-100/80 font-extrabold text-slate-900">
                  <td className="py-3.5 px-4 sm:px-6 text-center">—</td>
                  <td className="py-3.5 px-4 sm:px-6 flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Time Given</span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-center text-amber-900">90 Minutes</td>
                  <td className="py-3.5 px-4 sm:px-6 text-center text-amber-900">108 Sec/Que.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Exam Mode & Medium Pills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3.5 bg-white/80 border border-white px-5 py-4 rounded-2xl shadow-sm">
              <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FiCheckSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-blue-700">
                  Mode of Exam
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900">
                  Offline OMR Based MCQ Pattern
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white/80 border border-white px-5 py-4 rounded-2xl shadow-sm">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FiGlobe className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-amber-700">
                  Medium of Instructions
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900">
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