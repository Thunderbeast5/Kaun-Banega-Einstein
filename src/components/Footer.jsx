import React from 'react';
import { motion } from 'framer-motion';
import { FiInstagram, FiYoutube, FiMail } from 'react-icons/fi';
import logo from '../assets/KBE.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Custom social links mapped with their specific URLs
  const socialLinks = [
    { 
      Icon: FiInstagram, 
      href: 'https://www.instagram.com/swami_vivekananda_jr.college?igsh=b21sbGRtZTJqZWg%3D&utm_source=ig_contact_invite',
      label: 'Instagram'
    },
    { 
      Icon: FiYoutube, 
      href: 'https://www.youtube.com/@swamivivekananda2021',
      label: 'YouTube'
    },
    { 
      Icon: FiMail, 
      href: 'mailto:kaunbanegaeinstein@gmail.com',
      label: 'Email'
    }
  ];

  return (
    <footer className="relative bg-slate-50 pt-16 md:pt-24 pb-28 md:pb-10 border-t border-slate-200 overflow-hidden z-0">
      
      {/* Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30rem] md:w-[50rem] h-[15rem] md:h-[20rem] bg-blue-400/15 rounded-t-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12 md:mb-16">
          
          {/* Brand & Socials */}
          <div className="lg:col-span-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 mb-4 md:mb-5">
              <img src={logo} alt="Kaun Banega Einstein" className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-lg shrink-0" />
              <h5 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Kaun Banega Einstein
              </h5>
            </div>
            <p className="text-slate-600 font-medium text-sm md:text-base max-w-md mx-auto md:mx-0 leading-relaxed mb-6 md:mb-8">
              A centralized competition management system connecting schools, students, and organizers across key Maharashtra regions.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              {socialLinks.map(({ Icon, href, label }, i) => (
                <a 
                  key={i} 
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer" 
                  aria-label={label}
                  className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all shadow-sm hover:shadow group"
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 1: Info Links */}
          <div className="text-center md:text-left">
            <h6 className="font-bold text-slate-900 mb-4 md:mb-6 uppercase tracking-wider text-xs md:text-sm">
              Competition Info
            </h6>
            <ul className="space-y-3 md:space-y-4 font-medium text-sm">
              {['About', 'Structure', 'Rocket Launch', 'Contact'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-slate-600 hover:text-blue-700 md:hover:translate-x-1 transition-transform inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Platform Links */}
          <div className="text-center md:text-left">
            <h6 className="font-bold text-slate-900 mb-4 md:mb-6 uppercase tracking-wider text-xs md:text-sm">
              Platform Tools
            </h6>
            <ul className="space-y-3 md:space-y-4 font-medium text-sm">
              {[
                { label: 'School Login', href: '/login' },
                { label: 'Admin Login', href: '/admin/login' },
                // { label: 'Student Info', href: '#student-info' },
                // { label: 'Certificate Verification', href: '/certificate' },
                // { label: 'Results Dashboard', href: '/results' }
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-600 hover:text-blue-700 md:hover:translate-x-1 transition-transform inline-block">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Credit */}
        <div className="pt-6 md:pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-slate-500 text-xs md:text-sm font-medium">
            Copyright © {currentYear} Kaun Banega Einstein. All Rights Reserved.
          </p>
          <div className="flex items-center text-xs md:text-sm font-medium text-slate-500">
            <span className="text-slate-500 bg-white/60 px-4 py-1.5 rounded-full border border-slate-200/60 shadow-sm">
              Platform by <span className="text-blue-700 font-extrabold tracking-wide ml-1">Vedant Purkar</span>
            </span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;