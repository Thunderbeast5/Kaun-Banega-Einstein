import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/KBE.png';
import { auth } from '../lib/firebase';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Hysteresis: Toggle pill shape based on scroll depth
          setIsScrolled(currentScrollY > 60);

          // Toggle visibility: Hide on scroll down, show on scroll up
          if (currentScrollY < lastScrollY || currentScrollY <= 100) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(Boolean(user));
    });

    return unsubscribe;
  }, []);

  return (
    <div
      className={`
        fixed inset-x-0 top-4 z-50 flex justify-center pointer-events-none px-4 md:px-6
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-32'}
      `}
    >
      <nav
        className={`
          pointer-events-auto relative flex items-center justify-between w-full font-manrope border transition-all duration-300 ease-in-out
          ${isScrolled ? 'max-w-6xl px-7 py-3 rounded-full border-white/30' : 'max-w-full px-2 md:px-6 py-2 rounded-full border-transparent'}
        `}
      >
        {/* Backdrop layer */}
        <div
          aria-hidden
          className={`
            absolute inset-0 -z-10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out
            ${isScrolled ? 'bg-white/90 backdrop-blur-md opacity-100' : 'opacity-0'}
          `}
        />

        {/* ================= LEFT: LOGO ================= */}
        <div
          className="flex items-center gap-4 cursor-pointer select-none"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src={logo}
            alt="Kaun Banega Einstein"
            className={`
              rounded-full object-cover border-2 border-white/20 shadow-lg transition-all duration-300 ease-in-out
              ${isScrolled ? 'w-12 h-12' : 'w-16 h-16'}
            `}
          />

          <span
            className={`
              ${isScrolled ? 'text-slate-900 drop-shadow-none' : 'text-white drop-shadow-md'} font-semibold tracking-wide transition-all duration-300 ease-in-out
              ${isScrolled ? 'text-lg' : 'text-xl md:text-2xl'}
            `}
          >
            Kaun Banega Einstein
          </span>
        </div>

        {/* ================= CENTER: NAVIGATION ================= */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10 text-base font-semibold tracking-wide">
          <a href="#about" className={`${isScrolled ? 'text-slate-900' : 'text-white drop-shadow-md'} hover:text-yellow-400 transition-colors duration-300 cursor-pointer`}>
            About
          </a>
          <a href="#structure" className={`${isScrolled ? 'text-slate-900' : 'text-white drop-shadow-md'} hover:text-yellow-400 transition-colors duration-300 cursor-pointer`}>
            Structure
          </a>
          <a href="#rocket-launch" className={`${isScrolled ? 'text-slate-900' : 'text-white drop-shadow-md'} hover:text-yellow-400 transition-colors duration-300 cursor-pointer`}>
            Rocket Launch
          </a>
          <a href="#isro-prize" className={`${isScrolled ? 'text-slate-900' : 'text-white drop-shadow-md'} hover:text-yellow-400 transition-colors duration-300 cursor-pointer`}>
            Prizes
          </a>
          <a href="#contact" className={`${isScrolled ? 'text-slate-900' : 'text-white drop-shadow-md'} hover:text-yellow-400 transition-colors duration-300 cursor-pointer`}>
            Contact
          </a>
        </div>

        {/* ================= RIGHT: AUTH ACTION ================= */}
        <div>
          <Link to={isLoggedIn ? '/dashboard' : '/auth'} className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-full font-semibold text-base tracking-wide shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            {isLoggedIn ? 'Dashboard' : 'Register'}
          </Link>
        </div>

      </nav>
    </div>
  );
};

export default Navbar;