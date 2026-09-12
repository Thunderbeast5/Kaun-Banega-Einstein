import React from 'react';
import { motion } from 'framer-motion';
import { FiLayout, FiTarget, FiZap, FiAward } from 'react-icons/fi';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="about" className="relative py-24 bg-slate-50 overflow-hidden z-0">
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <span className="block italic text-sm font-bold tracking-[0.2em] text-blue-700 uppercase mb-4">
            About KBE
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Redefining Scientific Curiosity.
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(160px,auto)]"
        >
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2 group relative rounded-[2rem] border border-white/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-blue-200">
             <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
             <div className="absolute top-0 right-0 w-48 h-48 bg-blue-300/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700 ease-out" />
             <div className="relative z-10 p-8 lg:p-10 h-full flex flex-col justify-between">
               <div className="flex items-center gap-4 mb-6">
                  <FiLayout className="w-8 h-8 text-blue-700 flex-shrink-0" />
                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">The Platform Overview</h3>
               </div>
               <p className="text-base lg:text-lg text-slate-800 leading-relaxed font-medium">
                 The Kaun Banega Einstein (KBE) platform is a centralized, offline-examination management system designed to cultivate scientific curiosity and practical understanding among students in three key districts: <strong className="font-bold text-slate-900">Niphad, Chandwad, and Dindori</strong>. While examinations are held offline, the entire competition life cycle, from registration to certificate issuance, is powered online.
               </p>
             </div>
          </motion.div>

          <motion.div variants={itemVariants} className="group relative rounded-[2rem] border border-white/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-blue-400 hover:-translate-y-1">
             <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
             <div className="relative z-10 p-6 h-full flex flex-col justify-center">
               <div className="flex items-center gap-3 mb-3">
                 <FiTarget className="w-6 h-6 text-blue-800 flex-shrink-0" />
                 <h4 className="text-lg font-bold text-slate-900">The Mission</h4>
               </div>
               <p className="text-slate-800 font-medium text-sm md:text-base leading-relaxed">
                 Reduce manual administrative burden for organizers and participating schools.
               </p>
             </div>
          </motion.div>

          <motion.div variants={itemVariants} className="group relative rounded-[2rem] border border-white/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-blue-400 hover:-translate-y-1">
             <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
             <div className="relative z-10 p-6 h-full flex flex-col justify-center">
               <div className="flex items-center gap-3 mb-3">
                 <FiZap className="w-6 h-6 text-blue-800 flex-shrink-0" />
                 <h4 className="text-lg font-bold text-slate-900">Objective</h4>
               </div>
               <p className="text-slate-800 font-medium text-sm md:text-base leading-relaxed">
                 Develop students' practical interest in science, physics, and space technology.
               </p>
             </div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-3 group relative rounded-[2rem] border border-white/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-blue-200">
             <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
             <div className="relative z-10 p-6 md:px-10 md:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/80 border border-white flex items-center justify-center flex-shrink-0 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-sm">
                    <FiAward className="w-7 h-7 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">The Goal</h4>
                    <p className="text-slate-800 font-medium max-w-2xl text-sm md:text-base">
                      Provide a unified platform for registration, hall tickets, results, and finalist selection.
                    </p>
                  </div>
               </div>
               <a href="#structure" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 border border-transparent text-white font-semibold hover:bg-blue-700 transition-colors duration-300 whitespace-nowrap text-sm shadow-md hover:shadow-lg">
                  Explore Structure
               </a>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;