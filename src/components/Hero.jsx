import { motion } from 'framer-motion';
import heroImage from '../assets/hero.webp';

const Hero = () => {
  return (
    <main
      className="relative z-10 flex min-h-screen flex-col justify-center overflow-hidden px-6 pb-20 text-white md:px-12 lg:px-24"
      style={{ fontFamily: '"Poppins", sans-serif' }}
    >
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div 
        className="absolute inset-x-0 bottom-0 h-24 md:h-48 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none -z-10" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <h1
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-2 drop-shadow-lg text-white whitespace-nowrap"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Step Into the Cosmos.
        </h1>
        <h2
          className="text-4xl md:text-5xl italic mb-6 text-white-300 drop-shadow-md whitespace-nowrap"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Master the Art of Science.
        </h2>
        <p className="text-lg md:text-xl text-white-200 mb-10 max-w-xl leading-relaxed drop-shadow-lg">
          The ultimate competitive platform built for brilliant young minds. Practice real-time scientific challenges, analyze complex theories in seconds, and embark on your journey toward a brighter tomorrow effortlessly.
        </p>
      </motion.div>
    </main>
  );
};

export default Hero;