import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Contact = () => {
  return (
    <section id="contact" className="relative py-16 md:py-24 bg-slate-50 overflow-hidden z-0">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 md:w-96 h-64 md:h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 md:w-[30rem] h-72 md:h-[30rem] bg-cyan-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center max-w-3xl mx-auto px-2"
        >
          <span className="block italic text-xs md:text-sm font-bold tracking-[0.2em] text-blue-700 uppercase mb-3 md:mb-4">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 md:mb-6">
            We're Here to Help.
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 font-light leading-relaxed">
            Have questions about the examination, registration process, or the platform? Reach out to our team using the details below.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto group relative rounded-[1.5rem] md:rounded-[2rem] border border-white/60 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-blue-200"
        >
           <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
           <div className="absolute -top-16 -left-16 md:-top-24 md:-left-24 w-48 h-48 md:w-64 md:h-64 bg-blue-400/30 rounded-full -z-10 group-hover:scale-110 transition-transform duration-700 ease-out" />
           
           <div className="relative z-10 p-6 sm:p-8 md:p-12">
             <div className="text-center mb-10 md:mb-12">
               <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">Contact Information</h3>
               <p className="text-slate-800 font-medium text-xs sm:text-sm">
                 Our support team is available Monday through Friday, 9:00 AM to 5:00 PM.
               </p>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-6 md:gap-4">
               
               {/* Phone Link */}
               <a 
                 href="tel:+911234567890" 
                 className="flex flex-col items-center text-center gap-3 md:gap-4 group/item hover:-translate-y-1 transition-transform duration-300"
               >
                 <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/60 border border-white shadow-sm flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/item:bg-white group-hover/item:shadow-md">
                   <FiPhone className="w-5 h-5 md:w-6 md:h-6 text-blue-800" />
                 </div>
                 <div>
                   <p className="text-[10px] md:text-xs text-blue-800 font-bold uppercase tracking-wider mb-0.5 md:mb-1">Phone</p>
                   <p className="text-slate-900 font-semibold text-base lg:text-lg group-hover/item:text-blue-700 transition-colors">+91 12345 67890</p>
                 </div>
               </a>

               {/* Email Link */}
               <a 
                 href="mailto:kaunbanegaeinstein@gmail.com" 
                 className="flex flex-col items-center text-center gap-3 md:gap-4 group/item hover:-translate-y-1 transition-transform duration-300 sm:delay-75"
               >
                 <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/60 border border-white shadow-sm flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/item:bg-white group-hover/item:shadow-md">
                   <FiMail className="w-5 h-5 md:w-6 md:h-6 text-blue-800" />
                 </div>
                 <div>
                   <p className="text-[10px] md:text-xs text-blue-800 font-bold uppercase tracking-wider mb-0.5 md:mb-1">Email</p>
                   <p className="text-slate-900 font-semibold text-[15px] lg:text-base group-hover/item:text-blue-700 transition-colors break-all px-2 sm:px-0">
                     kaunbanegaeinstein@gmail.com
                   </p>
                 </div>
               </a>

               {/* Location Link */}
               <a 
                 href="https://www.google.com/maps?ll=20.169319,73.991049&z=17&t=m&hl=en-US&gl=US&mapclient=embed&q=20%C2%B010%2709.6%22N+73%C2%B059%2727.8%22E+20.169319,+73.991049@20.1693189,73.9910487"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex flex-col items-center text-center gap-3 md:gap-4 group/item hover:-translate-y-1 transition-transform duration-300 sm:col-span-2 md:col-span-1 md:delay-150"
               >
                 <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/60 border border-white shadow-sm flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/item:bg-white group-hover/item:shadow-md">
                   <FiMapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-800" />
                 </div>
                 <div>
                   <p className="text-[10px] md:text-xs text-blue-800 font-bold uppercase tracking-wider mb-0.5 md:mb-1">Office</p>
                   <p className="text-slate-900 font-semibold text-base lg:text-lg group-hover/item:text-blue-700 transition-colors">
                     Pimpalgaon B, Nashik MH
                   </p>
                 </div>
               </a>

             </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;