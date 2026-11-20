import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import kawleLogo from '../assets/kawle.png';
import svicsmLogo from '../assets/logo.png';

const Organizers = () => {
  return (
    <section id="organizers" className="relative py-16 md:py-24 bg-slate-50 overflow-hidden z-0">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-16 left-12 w-64 md:w-96 h-64 md:h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-12 w-64 md:w-96 h-64 md:h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center max-w-3xl mx-auto px-2"
        >
          <span className="block italic text-xs md:text-sm font-bold tracking-[0.2em] text-blue-700 uppercase mb-3 md:mb-4">
            Organized By
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 md:mb-6">
            Our Organizers.
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 font-light leading-relaxed">
            Jointly organized by leading academic institutions committed to fostering scientific temper and excellence across Maharashtra.
          </p>
        </motion.div>

        {/* Transparent Co-Organizers Lockup with Center Divider */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-16"
        >
          {/* Organizer 1: B. K. Kawale College */}
          <div className="flex-1 max-w-sm flex flex-col items-center text-center group">
            <img
              src={kawleLogo}
              alt="B. K. Kawale College"
              className="h-24 sm:h-28 md:h-32 w-auto object-contain mb-4 sm:mb-5 transition-transform duration-300 group-hover:scale-105"
            />
            <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 leading-snug tracking-tight">
              B. K. Kawale College
            </h3>
          </div>

          {/* Vertical Divider (Horizontal on Mobile, Vertical `|` on Desktop) */}
          <div
            aria-hidden="true"
            className="w-24 h-px md:w-px md:h-40 bg-slate-300/90 shrink-0"
          />

          {/* Organizer 2: Swami Vivekananda Institute of Commerce, Science & Management */}
          <div className="flex-1 max-w-sm flex flex-col items-center text-center group">
            <img
              src={svicsmLogo}
              alt="Swami Vivekananda Institute of Commerce, Science & Management"
              className="h-24 sm:h-28 md:h-32 w-auto object-contain mb-4 sm:mb-5 transition-transform duration-300 group-hover:scale-105"
            />
            <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 leading-snug tracking-tight">
              Swami Vivekananda Institute of Commerce, Science &amp; Management
            </h3>
          </div>
        </motion.div>

        {/* Centered "Visit Our Site" CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 md:mt-12 flex justify-center"
        >
          <a
            href="https://www.svicsm.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-300"
          >
            <span>Visit Our Site</span>
            <FiExternalLink className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Organizers;