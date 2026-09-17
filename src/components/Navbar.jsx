import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/KBE.png';
import { auth, firestore } from '../lib/firebase';

const Navbar = ({ forceDarkText = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [certificatesVisible, setCertificatesVisible] = useState(false);

  // Scroll behaviour
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsScrolled(currentScrollY > 60);
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

  // Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(Boolean(user));
    });
    return unsubscribe;
  }, []);

  // Live-listen to platform controls — updates navbar instantly when admin toggles
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, 'settings', 'platformControls'),
      (snap) => {
        const data = snap.exists() ? snap.data() : {};
        setResultsVisible(Boolean(data.resultsVisible));
        setCertificatesVisible(Boolean(data.certificatesVisible));
      },
      () => {
        setResultsVisible(false);
        setCertificatesVisible(false);
      },
    );
    return unsubscribe;
  }, []);

  // Dynamically build center navigation links
  const navLinks = [
    { path: '#about', label: 'About' },
    { path: '#structure', label: 'Structure' },
    resultsVisible
      ? { path: '/results', label: 'Results' }
      : { path: '#rocket-launch', label: 'Rocket Launch' },
    { path: '#isro-prize', label: 'Prizes' },
    certificatesVisible
      ? { path: '/certificate', label: 'Certificates' }
      : { path: '#contact', label: 'Contact' },
  ];

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
          ${isScrolled
            ? 'max-w-6xl px-7 py-3 rounded-full border-white/30'
            : 'max-w-full px-2 md:px-6 py-2 rounded-full border-transparent'}
        `}
      >
        {/* Backdrop */}
        <div
          aria-hidden
          className={`
            absolute inset-0 -z-10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out
            ${isScrolled ? 'bg-white/90 backdrop-blur-md opacity-100' : 'opacity-0'}
          `}
        />

        {/* ── Logo ── */}
        <Link
          to="/"
          className="flex items-center gap-4 cursor-pointer select-none"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src={logo}
            alt="Kaun Banega Einstein"
            className={`rounded-full object-cover border-2 border-white/20 shadow-lg transition-all duration-300 ease-in-out ${isScrolled ? 'w-12 h-12' : 'w-16 h-16'}`}
          />
          <span className={`font-semibold tracking-wide transition-all duration-300 ease-in-out ${isScrolled ? 'text-lg' : 'text-xl md:text-2xl'} ${isScrolled || forceDarkText ? 'text-slate-900 drop-shadow-none' : 'text-white drop-shadow-md'}`}>
            Kaun Banega Einstein
          </span>
        </Link>

        {/* ── Center nav ── */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10 text-base font-semibold tracking-wide">
          {navLinks.map(({ path, label }) => {
            const className = `${isScrolled || forceDarkText ? 'text-slate-900 hover:text-blue-700' : 'text-white drop-shadow-md hover:text-yellow-400'} transition-colors duration-300 cursor-pointer`;
            return path.startsWith('#') ? (
              <a key={path} href={path} className={className}>
                {label}
              </a>
            ) : (
              <Link key={path} to={path} className={className}>
                {label}
              </Link>
            );
          })}
        </div>

        {/* ── Right CTA ── */}
        <div>
          <Link
            to={isLoggedIn ? '/dashboard' : '/auth'}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-full font-semibold text-base tracking-wide shadow-lg transition-all duration-300 hover:scale-105"
          >
            {isLoggedIn ? 'Dashboard' : 'Register'}
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;