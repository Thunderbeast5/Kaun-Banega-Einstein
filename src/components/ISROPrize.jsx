import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiUsers, FiAward } from 'react-icons/fi';
import isroLogo from '../assets/img.png';

const ISROPrize = () => {
  return (
    <section id="isro-prize" className="relative py-16 md:py-24 bg-slate-50 overflow-hidden z-0">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 md:w-[40rem] h-72 md:h-[40rem] bg-blue-400/20 rounded-full blur-[80px] md:blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center max-w-3xl mx-auto px-2 sm:px-0"
        >
          <span className="block italic text-xs md:text-sm font-bold tracking-[0.2em] text-blue-700 uppercase mb-3 md:mb-4">
            The Ultimate Reward
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 md:mb-6">
            A Journey to the Stars.
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 font-light leading-relaxed">
            KBE is more than just a certificate; it's a path to unparalleled opportunity. We are proud to announce that the final winners will receive a once-in-a-lifetime chance to explore India's center of cosmic discovery.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="group relative max-w-5xl mx-auto rounded-[1.5rem] md:rounded-[2.5rem] border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-blue-200"
        >
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          <div className="absolute -top-16 -right-16 md:-top-32 md:-right-32 w-48 h-48 md:w-80 md:h-80 bg-blue-300/60 rounded-full blur-2xl md:blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700 ease-out" />

          <div className="relative z-10 flex flex-col md:flex-row items-stretch">
            
            {/* Left: Logo & Location */}
            <div className="w-full md:w-2/5 p-8 sm:p-10 md:p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/40">
              <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 md:border-[6px] border-white bg-white flex items-center justify-center p-1 shadow-md mb-5 md:mb-6 group-hover:scale-105 transition-transform duration-500 shrink-0">
                  <img src={isroLogo} alt="ISRO" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="flex items-center gap-2 text-blue-800 font-bold tracking-widest uppercase text-xs md:text-sm bg-white/60 px-4 py-2 rounded-full shadow-sm">
                <FiMapPin className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
                <span>Bangalore, India</span>
              </div>
            </div>

            {/* Right: Content & Pills */}
            <div className="w-full md:w-3/5 p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center text-center md:text-left">
              <div className="inline-flex items-center justify-center md:justify-start gap-2 text-blue-700 font-bold uppercase tracking-wider text-xs md:text-sm mb-3 md:mb-4">
                <FiStar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>The Grand Prize</span>
              </div>
              
              <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 md:mb-6 tracking-tight leading-tight">
                Visit ISRO Headquarters.
              </h4>
              
              <p className="text-sm sm:text-base md:text-lg text-slate-700 font-medium leading-relaxed mb-8 md:mb-10">
                The Top 3 students and their teachers will receive this fully supported opportunity to explore the <strong className="font-bold text-slate-900">Indian Space Research Organisation (ISRO)</strong> in person.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 md:gap-4">
                <div className="flex items-center gap-2.5 md:gap-3 bg-blue-100/80 border border-white/60 px-4 py-2.5 md:px-5 md:py-3 rounded-xl shadow-sm w-full sm:w-auto justify-center md:justify-start">
                  <FiUsers className="w-4 h-4 md:w-5 md:h-5 text-blue-700 flex-shrink-0" />
                  <span className="text-slate-800 font-semibold text-xs sm:text-sm text-center leading-tight">Top 3 Students + Mentors</span>
                </div>
                <div className="flex items-center gap-2.5 md:gap-3 bg-blue-100/80 border border-white/60 px-4 py-2.5 md:px-5 md:py-3 rounded-xl shadow-sm w-full sm:w-auto justify-center md:justify-start">
                  <FiAward className="w-4 h-4 md:w-5 md:h-5 text-blue-700 flex-shrink-0" />
                  <span className="text-slate-800 font-semibold text-xs sm:text-sm text-center leading-tight">Fully Sponsored Trip</span>
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