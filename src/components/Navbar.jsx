import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiLayout, FiTarget, FiAward, FiGift, FiFileText } from 'react-icons/fi';
import logo from '../assets/KBE.png';
import { auth, firestore } from '../lib/firebase';

const Navbar = ({ forceDarkText = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [certificatesVisible, setCertificatesVisible] = useState(false);
  
  // Track active tab for mobile/tablet bottom nav
  const [activeMobileTab, setActiveMobileTab] = useState('about');
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll behaviour for the TOP navbar ONLY
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

  const [dashboardPath, setDashboardPath] = useState('/dashboard');

  // Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoggedIn(Boolean(user));
      if (user) {
        try {
          const studentDoc = await getDoc(doc(firestore, 'individual_students', user.uid));
          if (studentDoc.exists()) {
            setDashboardPath('/student/dashboard');
          } else {
            const adminDoc = await getDoc(doc(firestore, 'admins', user.uid));
            if (adminDoc.exists()) {
              setDashboardPath('/admin');
            } else {
              setDashboardPath('/dashboard');
            }
          }
        } catch (e) {
          setDashboardPath('/dashboard');
        }
      }
    });
    return unsubscribe;
  }, []);

  // Live-listen to platform controls
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

  // Keep the mobile bottom-nav selection in sync with the visible home section.
  useEffect(() => {
    if (location.pathname !== '/') return undefined;

    const sectionTabs = [
      ['about', 'about'],
      ['structure', 'structure'],
      ['prizes', 'isro-prize'],
      ...(!resultsVisible ? [['rocket', 'rocket-launch']] : []),
    ];
    const visibleSections = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        const mostVisible = [...visibleSections.entries()].sort((a, b) => b[1] - a[1])[0];
        if (mostVisible) {
          const activeTab = sectionTabs.find(([, sectionId]) => sectionId === mostVisible[0]);
          if (activeTab) setActiveMobileTab(activeTab[0]);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sectionTabs.forEach(([, sectionId]) => {
      const section = document.getElementById(sectionId);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [location.pathname, resultsVisible]);

  // Dynamically build center navigation links for Desktop
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

  // Dynamically build mobile/tablet bottom nav links without Auth
  const mobileNavLinks = [
    { id: 'about', path: '/', label: 'Home', icon: FiHome },
    { id: 'structure', path: '#structure', label: 'Structure', icon: FiLayout },
    resultsVisible
      ? { id: 'results', path: '/results', label: 'Results', icon: FiAward }
      : { id: 'rocket', path: '#rocket-launch', label: 'Rocket', icon: FiTarget },
    { id: 'prizes', path: '#isro-prize', label: 'Prizes', icon: FiGift },
  ];

  // Conditionally add Certificates to mobile/tablet nav if active
  if (certificatesVisible) {
    mobileNavLinks.push({ id: 'certificate', path: '/certificate', label: 'Certificates', icon: FiFileText });
  }

  const handleMobileNavClick = (id, path) => {
    setActiveMobileTab(id);
    if (path === '/') {
      if (location.pathname !== '/') {
        navigate('/');
      }
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      return;
    }

    if (path.startsWith('#')) {
      navigateToSection(path);
    }
  };

  const navigateToSection = (path) => {
    if (location.pathname !== '/') {
      navigate(`/${path}`);
      return;
    }

    const element = document.querySelector(path);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ========================================= */}
      {/* TOP NAVBAR (Desktop & Mobile/Tablet Header) */}
      {/* ========================================= */}
      <div
        className={`
          fixed inset-x-0 top-4 z-50 flex justify-center pointer-events-none px-4 lg:px-6
          transition-transform duration-300 ease-in-out
          ${isVisible ? 'translate-y-0' : '-translate-y-32'}
        `}
      >
        <nav
          className={`
            pointer-events-auto relative flex items-center justify-between w-full font-manrope border transition-all duration-300 ease-in-out
            ${isScrolled
              ? 'max-w-6xl px-4 lg:px-7 py-3 rounded-full border-white/30'
              : 'max-w-full px-4 lg:px-6 py-3 rounded-full border-transparent'}
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

          {/* ── Logo & Title ── */}
          <Link
            to="/"
            className="relative flex items-center justify-start cursor-pointer select-none gap-2 sm:gap-3 lg:gap-4 shrink min-w-0 pr-2"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src={logo}
              alt="Kaun Banega Einstein"
              className={`rounded-full object-cover border-2 border-white/20 shadow-lg shrink-0 transition-all duration-300 ease-in-out ${isScrolled ? 'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12' : 'w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16'}`}
            />
            <span className={`font-extrabold tracking-tight lg:tracking-wide leading-tight transition-all duration-300 ease-in-out truncate ${isScrolled ? 'text-sm sm:text-base lg:text-lg' : 'text-base sm:text-lg lg:text-2xl'} ${isScrolled || forceDarkText ? 'text-slate-900 drop-shadow-none' : 'text-white drop-shadow-md'}`}>
              Kaun Banega Einstein
            </span>
          </Link>

          {/* ── Center nav (Desktop Only) ── */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-10 text-base font-semibold tracking-wide">
            {navLinks.map(({ path, label }) => {
              const className = `${isScrolled || forceDarkText ? 'text-slate-900 hover:text-blue-700' : 'text-white drop-shadow-md hover:text-yellow-400'} transition-colors duration-300 cursor-pointer`;
              return path.startsWith('#') ? (
                <a
                  key={path}
                  href={path}
                  onClick={(event) => {
                    event.preventDefault();
                    navigateToSection(path);
                  }}
                  className={className}
                >
                  {label}
                </a>
              ) : (
                <Link key={path} to={path} className={className}>
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ── Right CTA (Mobile & Desktop) ── */}
          <div className="block shrink-0">
            <Link
              to={isLoggedIn ? dashboardPath : '/auth'}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 lg:px-6 lg:py-2.5 rounded-full font-bold text-xs sm:text-sm lg:text-base tracking-wide shadow-lg transition-all duration-300 hover:scale-105 inline-block whitespace-nowrap"
            >
              {isLoggedIn ? 'Dashboard' : 'Register'}
            </Link>
          </div>
        </nav>
      </div>

      {/* ========================================= */}
      {/* BOTTOM NAV PILL (Mobile & Tablet)         */}
      {/* ========================================= */}
      <div className="fixed bottom-6 inset-x-0 z-[60] flex justify-center lg:hidden pointer-events-none px-3">
        {/* Sky Blue themed capsule */}
        <nav className="pointer-events-auto flex items-center gap-1 sm:gap-2 bg-blue-100/90 backdrop-blur-md p-1.5 rounded-full shadow-[0_8px_30px_rgba(29,78,216,0.15)] border border-blue-200/60">
          {mobileNavLinks.map((item) => {
            const routeTab = {
              '/results': 'results',
              '/certificate': 'certificate',
            }[location.pathname];
            const isActive = routeTab
              ? routeTab === item.id
              : activeMobileTab === item.id;
            const Icon = item.icon;
            
            const buttonClass = `transition-all duration-300 ease-in-out flex items-center justify-center whitespace-nowrap ${
              isActive 
                ? 'bg-blue-700 text-white rounded-full px-4 sm:px-5 py-3 gap-2 shadow-md' 
                : 'bg-transparent text-blue-900/60 hover:text-blue-900 hover:bg-blue-200/60 w-11 h-11 sm:w-12 sm:h-12 rounded-full'
            }`;

            return item.path.startsWith('#') ? (
              <button
                key={item.id}
                onClick={() => handleMobileNavClick(item.id, item.path)}
                className={buttonClass}
              >
                <Icon className={isActive ? "w-4 h-4" : "w-5 h-5"} />
                {isActive && <span className="text-xs sm:text-sm font-bold">{item.label}</span>}
              </button>
            ) : (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => handleMobileNavClick(item.id, item.path)}
                className={buttonClass}
              >
                <Icon className={isActive ? "w-4 h-4" : "w-5 h-5"} />
                {isActive && <span className="text-xs sm:text-sm font-bold">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Navbar;