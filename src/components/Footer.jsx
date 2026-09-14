import React from 'react';
import { motion } from 'framer-motion';
import { FiInstagram, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import logo from '../assets/KBE.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-50 pt-24 pb-10 border-t border-slate-200 overflow-hidden z-0">
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50rem] h-[20rem] bg-blue-400/15 rounded-t-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-4">
              <img src={logo} alt="Kaun Banega Einstein" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg" />
              <h5 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Kaun Banega Einstein
              </h5>
            </div>
            <p className="text-slate-600 font-medium max-w-md leading-relaxed mb-8">
              A centralized competition management system connecting schools, students, and organizers across key Maharashtra regions.
            </p>
            <div className="flex items-center gap-4">
              {[FiInstagram, FiTwitter, FiLinkedin, FiMail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all shadow-sm hover:shadow group">
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h6 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">
              Competition Info
            </h6>
            <ul className="space-y-4 font-medium text-sm">
              {['About', 'Structure', 'Rocket Launch', 'Results', 'FAQ', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-slate-600 hover:text-blue-700 hover:translate-x-1 transition-transform inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">
              Platform Tools
            </h6>
            <ul className="space-y-4 font-medium text-sm">
              {[
                { label: 'School Login', href: '/login' },
                { label: 'Admin Login', href: '/admin/login' },
                { label: 'Student Info', href: '#student-info' },
                { label: 'Certificate Verification', href: '#certificate-verification' },
                { label: 'Results Dashboard', href: '#results-dashboard' }
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-600 hover:text-blue-700 hover:translate-x-1 transition-transform inline-block">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-slate-500 text-sm font-medium">
            Copyright © {currentYear} Kaun Banega Einstein. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-700 transition-colors">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <a href="#" className="hover:text-blue-700 transition-colors">Terms of Service</a>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-slate-500">
              Platform by <a href="#" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">Plasma</a>
            </span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;