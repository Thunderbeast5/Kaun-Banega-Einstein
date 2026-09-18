import React from 'react';
import { motion } from 'framer-motion';
import { FiCrosshair, FiWind, FiGlobe, FiClipboard, FiTarget, FiTool, FiArrowRight } from 'react-icons/fi';
import { LuRocket } from 'react-icons/lu';

const RocketLaunch = () => {
  const concepts = [
    { name: 'Forces & Motion', icon: <FiCrosshair className="w-4 h-4 md:w-5 md:h-5 text-blue-700" /> },
    { name: 'Aerodynamics & Stability', icon: <FiWind className="w-4 h-4 md:w-5 md:h-5 text-blue-700" /> },
    { name: 'Basic Space Technology', icon: <FiGlobe className="w-4 h-4 md:w-5 md:h-5 text-blue-700" /> },
    { name: 'Physical Evaluation', icon: <FiClipboard className="w-4 h-4 md:w-5 md:h-5 text-blue-700" /> },
    { name: 'Rocket Physics', icon: <FiTarget className="w-4 h-4 md:w-5 md:h-5 text-blue-700" /> },
    { name: 'Practical Application', icon: <FiTool className="w-4 h-4 md:w-5 md:h-5 text-blue-700" /> },
  ];

  return (
    <section id="rocket-launch" className="relative py-16 md:py-24 bg-slate-50 overflow-hidden z-0">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-20 right-10 md:right-20 w-64 md:w-[30rem] h-64 md:h-[30rem] bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-0 md:left-10 w-64 md:w-96 h-64 md:h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center max-w-3xl mx-auto"
        >
          <span className="block italic text-xs md:text-sm font-bold tracking-[0.2em] text-blue-700 uppercase mb-3 md:mb-4">
            The Practical Frontier
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 md:mb-6">
            Rocket Launch Competition.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Main Description Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3 group relative rounded-[1.5rem] md:rounded-[2rem] border border-white/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-blue-200"
          >
             <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
             <div className="absolute -bottom-16 -right-16 md:-bottom-24 md:-right-24 w-48 h-48 md:w-64 md:h-64 bg-blue-300/50 rounded-full -z-10 group-hover:scale-110 transition-transform duration-700 ease-out" />
             <div className="relative z-10 p-6 sm:p-8 lg:p-12 h-full flex flex-col justify-center">
               <p className="text-base sm:text-lg lg:text-xl text-slate-800 leading-relaxed font-medium mb-8 md:mb-10">
                 Science isn't just found in textbooks. The Rocket Launch Competition is a core, separate practical event designed to provide students with hands-on exposure to advanced physics concepts. This is physical evaluation, separate from the written exam, bringing theory to life.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                 {concepts.map((item, index) => (
                   <div key={index} className="flex items-center gap-3 md:gap-4 bg-white/60 border border-white/80 px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl shadow-sm hover:bg-white transition-colors duration-300">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                       {item.icon}
                     </div>
                     <span className="font-semibold text-slate-800 text-xs sm:text-sm md:text-base">
                       {item.name}
                     </span>
                   </div>
                 ))}
               </div>
             </div>
          </motion.div>

          {/* Call to Action Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 group relative rounded-[1.5rem] md:rounded-[2rem] border border-white/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-blue-400"
          >
             <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
             <div className="relative z-10 p-6 sm:p-8 lg:p-12 h-full flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] bg-white/80 border border-white flex items-center justify-center mb-6 md:mb-8 shadow-sm group-hover:-translate-y-2 transition-transform duration-500">
                 <LuRocket className="w-10 h-10 md:w-12 md:h-12 text-blue-700" />
               </div>
               <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 md:mb-4 tracking-tight">
                 Ready for Lift-Off?
               </h4>
               <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed mb-8 md:mb-10">
                 This unique event has its own rules and specialized entry process, managed separately through the platform to guarantee practical fairness.
               </p>
               <a href="#" className="group/btn inline-flex items-center gap-2 md:gap-3 px-6 py-3.5 md:px-8 md:py-4 rounded-full bg-blue-700 border border-transparent text-white font-bold hover:bg-blue-800 transition-all duration-300 w-full justify-center shadow-md hover:shadow-lg text-sm md:text-base">
                 <span>Access Rules & Regs</span>
                 <FiArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform" />
               </a>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default RocketLaunch;