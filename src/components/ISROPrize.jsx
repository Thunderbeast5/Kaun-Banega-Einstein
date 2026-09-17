import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiUsers, FiAward } from 'react-icons/fi';
import isroLogo from '../assets/img.png';

const ISROPrize = () => {
  return (
    <section id="isro-prize" className="relative py-24 bg-slate-50 overflow-hidden z-0">
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-blue-400/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <span className="block italic text-sm font-bold tracking-[0.2em] text-blue-700 uppercase mb-4">
            The Ultimate Reward
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            A Journey to the Stars.
          </h2>
          <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed">
            KBE is more than just a certificate; it's a path to unparalleled opportunity. We are proud to announce that the final winners will receive a once-in-a-lifetime chance to explore India's center of cosmic discovery.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="group relative max-w-5xl mx-auto rounded-[2.5rem] border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-blue-200"
        >
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-300/60 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700 ease-out" />

          <div className="relative z-10 flex flex-col md:flex-row items-stretch">
            <div className="w-full md:w-2/5 p-10 md:p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/40">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-white bg-white flex items-center justify-center p-1 shadow-md mb-6 group-hover:scale-105 transition-transform duration-500">
                  <img src={isroLogo} alt="ISRO" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="flex items-center gap-2 text-blue-800 font-bold tracking-widest uppercase text-sm bg-white/60 px-4 py-2 rounded-full shadow-sm">
                <FiMapPin className="w-4 h-4" /> 
                <span>Bangalore, India</span>
              </div>
            </div>

            <div className="w-full md:w-3/5 p-10 md:p-14 flex flex-col justify-center text-center md:text-left">
              <div className="inline-flex items-center justify-center md:justify-start gap-2 text-blue-700 font-bold uppercase tracking-wider text-xs md:text-sm mb-4">
                <FiStar className="w-4 h-4" />
                <span>The Grand Prize</span>
              </div>
              <h4 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                Visit ISRO Headquarters.
              </h4>
              <p className="text-base md:text-lg text-slate-700 font-medium leading-relaxed mb-10">
                The Top 3 students and their teachers will receive this fully supported opportunity to explore the <strong className="font-bold text-slate-900">Indian Space Research Organisation (ISRO)</strong> in person.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <div className="flex items-center gap-3 bg-blue-100/80 border border-white/60 px-5 py-3 rounded-xl shadow-sm w-full sm:w-auto">
                  <FiUsers className="w-5 h-5 text-blue-700 flex-shrink-0" />
                  <span className="text-slate-800 font-semibold text-sm">Top 3 Students + Mentors</span>
                </div>
                <div className="flex items-center gap-3 bg-blue-100/80 border border-white/60 px-5 py-3 rounded-xl shadow-sm w-full sm:w-auto">
                  <FiAward className="w-5 h-5 text-blue-700 flex-shrink-0" />
                  <span className="text-slate-800 font-semibold text-sm">Fully Sponsored Trip</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ISROPrize;