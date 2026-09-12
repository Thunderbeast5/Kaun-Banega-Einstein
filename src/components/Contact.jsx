import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Contact = () => {
  return (
    <section id="contact" className="relative py-24 bg-slate-50 overflow-hidden z-0">
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-cyan-400/20 rounded-full blur-3xl" />
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
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            We're Here to Help.
          </h2>
          <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed">
            Have questions about the examination, registration process, or the platform? Reach out to our team using the details below.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto group relative rounded-[2rem] border border-white/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-blue-200"
        >
           <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
           <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-400/30 rounded-full -z-10 group-hover:scale-110 transition-transform duration-700 ease-out" />
           <div className="relative z-10 p-8 md:p-12">
             <div className="text-center mb-12">
               <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Contact Information</h3>
               <p className="text-slate-800 font-medium text-sm">
                 Our support team is available Monday through Friday, 9:00 AM to 5:00 PM.
               </p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
               <div className="flex flex-col items-center text-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-white/60 border border-white shadow-sm flex items-center justify-center flex-shrink-0 transition-transform group-hover:-translate-y-1">
                   <FiPhone className="w-6 h-6 text-blue-800" />
                 </div>
                 <div>
                   <p className="text-xs text-blue-800 font-bold uppercase tracking-wider mb-1">Phone</p>
                   <p className="text-slate-900 font-semibold text-lg">+91 (123) 456-7890</p>
                 </div>
               </div>
               <div className="flex flex-col items-center text-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-white/60 border border-white shadow-sm flex items-center justify-center flex-shrink-0 transition-transform group-hover:-translate-y-1 delay-75">
                   <FiMail className="w-6 h-6 text-blue-800" />
                 </div>
                 <div>
                   <p className="text-xs text-blue-800 font-bold uppercase tracking-wider mb-1">Email</p>
                   <p className="text-slate-900 font-semibold text-lg">support@kbeplatform.com</p>
                 </div>
               </div>
               <div className="flex flex-col items-center text-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-white/60 border border-white shadow-sm flex items-center justify-center flex-shrink-0 transition-transform group-hover:-translate-y-1 delay-150">
                   <FiMapPin className="w-6 h-6 text-blue-800" />
                 </div>
                 <div>
                   <p className="text-xs text-blue-800 font-bold uppercase tracking-wider mb-1">Office</p>
                   <p className="text-slate-900 font-semibold text-lg">Nashik, Maharashtra, India</p>
                 </div>
               </div>
             </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;