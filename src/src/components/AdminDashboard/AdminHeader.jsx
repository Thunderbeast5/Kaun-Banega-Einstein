import { Link } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';
import logo from '../../assets/KBE.png';

const AdminHeader = ({ adminInfo }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 z-50 shadow-sm">

      {/* Left: Brand home link */}
      <Link to="/" className="flex items-center gap-4" aria-label="Go to KBE home">
        <img src={logo} alt="Kaun Banega Einstein logo" className="w-12 h-12 rounded-full object-cover shadow-sm" />
        <span className="text-xl font-extrabold text-slate-900 leading-tight">Kaun Banega Einstein</span>
      </Link>

      {/* Right: Admin identity */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <h1 className="text-base font-extrabold text-slate-900 leading-tight">
            {adminInfo?.name || 'Admin'}
          </h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
            Administrator
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
          <FiShield className="w-5 h-5 text-white" />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
