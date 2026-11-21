import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiAward } from 'react-icons/fi';
import isroLogo from '../assets/img.png';
import flightImage from '../assets/flight.png';

const ISROPrize = () => {
  return (
    <section id="isro-prize" className="relative py-16 md:py-24 bg-slate-50 overflow-hidden z-0">
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 md:w-[40rem] h-72 md:h-[40rem] bg-blue-400/20 rounded-full blur-[80px] md:blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center max-w-3xl mx-auto px-2 sm:px-0"
        >
          <span className="block italic text-xs md:text-sm font-bold tracking-[0.2em] text-blue-700 uppercase mb-3 md:mb-4">
            The Ultimate Rewards
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-4 md:mb-6">
            A Journey to the Stars.
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 font-light leading-relaxed">
            KBE is more than just a certificate; it's a path to unparalleled opportunity. Here is what awaits our final winners.
          </p>
        </motion.div>

        {/* Three Cards Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* Card 1: Bangalore ISRO Visit */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative rounded-[2rem] border border-white/70 bg-blue-100/70 backdrop-blur-md p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center justify-between overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-300/40 rounded-full blur-2xl -z-10 group-hover:scale-125 transition-transform duration-500" />
            
            <div className="w-24 h-24 rounded-full border-4 border-white bg-white flex items-center justify-center p-1 shadow-md mb-6 group-hover:scale-105 transition-transform duration-300">
              <img src={isroLogo} alt="ISRO" className="w-full h-full rounded-full object-cover" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 bg-white/70 px-3.5 py-1.5 rounded-full mb-3">
                <FiMapPin className="w-3.5 h-3.5" />
                Bangalore
              </span>
              <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                ISRO Visit
              </h3>
              <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                Explore India's center of cosmic discovery at the Indian Space Research Organisation in person.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Scholarship ₹1,55,000/- (Center Highlight) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative rounded-[2rem] border-2 border-amber-300/80 bg-gradient-to-b from-amber-100/90 via-yellow-50/90 to-blue-100/70 backdrop-blur-md p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center justify-between overflow-hidden"
          >
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-300/40 rounded-full blur-2xl -z-10 group-hover:scale-125 transition-transform duration-500" />

            <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-md mb-6 group-hover:scale-105 transition-transform duration-300">
              <FiAward className="w-11 h-11" />
            </div>

            <div>
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-amber-800 bg-amber-200/80 px-3.5 py-1.5 rounded-full mb-3">
                Winner Reward
              </span>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                Scholarship
              </h3>
              <div className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight my-2">
                ₹1,55,000/-
              </div>
              <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                Substantial financial scholarship support to fuel your future academic and scientific ambitions.
              </p>
            </div>
          </motion.div>

          {/* Card 3: First Flight Journey */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative rounded-[2rem] border border-white/70 bg-blue-100/70 backdrop-blur-md p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center justify-between overflow-hidden"
          >
            <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-sky-300/40 rounded-full blur-2xl -z-10 group-hover:scale-125 transition-transform duration-500" />

            <img
              src={flightImage}
              alt="First flight journey"
              className="w-24 h-24 rounded-full border-4 border-white bg-white object-cover shadow-md mb-6 group-hover:scale-105 transition-transform duration-300"
            />

            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-700 bg-white/70 px-3.5 py-1.5 rounded-full mb-3">
                Take Flight
              </span>
              <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                First Flight Journey
              </h3>
              <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                Experience the thrill of your very first air travel journey as you fly to Bangalore.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ISROPrize;