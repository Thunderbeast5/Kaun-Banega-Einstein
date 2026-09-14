import { Link } from 'react-router-dom';
import logo from '../../assets/KBE.png';

const AdminHeader = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 z-50 shadow-sm">
      
      {/* Left: Brand home link */}
      <Link to="/" className="flex items-center gap-4" aria-label="Go to KBE home">
        <img src={logo} alt="Kaun Banega Einstein logo" className="w-12 h-12 rounded-full object-cover shadow-sm" />
        <span className="text-xl font-extrabold text-slate-900 leading-tight">Kaun Banega Einstein</span>
      </Link>

      {/* Right: Admin identity */}
      <div className="text-right">
        <h1 className="text-xl font-extrabold text-slate-900 leading-tight">Superadmin Hub</h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Global Access</p>
      </div>
    </header>
  );
};

export default AdminHeader;