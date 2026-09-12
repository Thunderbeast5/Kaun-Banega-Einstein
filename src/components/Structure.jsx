import React from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiEdit3, FiAward, FiArrowRight } from 'react-icons/fi';

const Structure = () => {
  const steps = [
    {
      level: '01',
      title: 'School Level Examination',
      icon: <FiBookOpen className="w-6 h-6 text-blue-700" />,
      theme: 'bg-blue-200',
      workflow: ['Registration', 'Hall Ticket', 'Offline Exam', 'Evaluation', 'Qualified List'],
      desc: 'Registered students appear for their first-level assessment within their schools. Qualifying students proceed to the centralized final level.',
    },
    {
      level: '02',
      title: 'Final Level Examination',
      icon: <FiEdit3 className="w-6 h-6 text-blue-800" />,
      theme: 'bg-blue-400',
      workflow: ['Qualification', 'Final Exam', 'Evaluation', 'Rankings', 'Top 3'],
      desc: 'The top performers from the school level compete in a rigorous centralized examination to determine the ultimate winners.',
    },
  ];

  return (
    <section id="structure" className="relative py-24 bg-slate-50 overflow-hidden z-0">
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20 text-center max-w-3xl mx-auto"
        >
          <span className="block italic text-sm font-bold tracking-[0.2em] text-blue-700 uppercase mb-4">
            The Process
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            A Multi-Level Path to Excellence
          </h2>
          <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed">
            KBE is a rigorous, two-stage examination process that ensures only the brightest, most passionate minds move forward. The offline process is entirely managed through this digital platform.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div 
              key={step.level}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex gap-6 md:gap-10 mb-12"
            >
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white border-4 border-blue-100 shadow-sm flex items-center justify-center font-black text-xl text-blue-700 z-10 flex-shrink-0">
                  {step.level}
                </div>
                <div className="flex-1 w-1 bg-gradient-to-b from-blue-200 to-transparent my-2 rounded-full" />
              </div>
              <div className={`flex-1 group relative rounded-[2rem] border border-white/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden ${step.theme}`}>
                <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
                <div className="relative z-10 p-8 md:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center shadow-sm">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{step.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-8">
                    {step.workflow.map((item, i) => (
                      <React.Fragment key={i}>
                        <span className="px-4 py-2 rounded-full bg-white/70 border border-white text-sm font-semibold text-blue-800 shadow-sm whitespace-nowrap">
                          {item}
                        </span>
                        {i < step.workflow.length - 1 && (
                          <FiArrowRight className="w-4 h-4 text-blue-600/60 flex-shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-base md:text-lg text-slate-800 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-6 md:gap-10"
          >
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-blue-600 border-4 border-blue-200 shadow-lg flex items-center justify-center z-10 flex-shrink-0">
                <FiAward className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 pt-3">
               <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-slate-800 font-medium">
                    Final Evaluation leads to the prestigious final ranking, determining the ultimate winners.
                  </span>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Structure;