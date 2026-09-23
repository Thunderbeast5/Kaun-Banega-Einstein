// StudentAuthSelection.jsx
import { FiArrowLeft, FiLogIn, FiUserPlus, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const StudentAuthSelection = () => {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden py-24 z-0">
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
        {/* Back link updated to return to main selection */}
        <Link to="/auth" aria-label="Back to selection" title="Back to selection" className="fixed left-6 top-6 z-50 inline-flex rounded-full p-3 text-slate-700 hover:bg-white hover:text-blue-700 transition-colors shadow-sm">
          <FiArrowLeft className="w-5 h-5" />
        </Link>

        <div className="text-center mb-16">
          <span className="block italic text-sm font-bold tracking-[0.2em] text-blue-700 uppercase mb-4">
            Student Portal
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold italic text-slate-900 tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
            For Individual Students
          </h1>
        </div>

        {/* Card styles and layouts preserved exactly from AuthSelection.jsx[cite: 1] */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Login Card */}
          <Link to="/student/login" className="group relative rounded-[2.5rem] border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-indigo-200 block text-left">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-300/50 rounded-full -z-10 group-hover:scale-110 transition-transform duration-700 ease-out" />
            
            <div className="relative z-10 p-8 md:p-10 flex flex-col h-full justify-between min-h-[280px]">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/80 border border-white flex items-center justify-center mb-6 shadow-sm">
                  <FiLogIn className="w-7 h-7 text-indigo-700" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Student Login</h2>
                <p className="text-slate-800 font-medium text-sm">Access your personal dashboard to download your hall ticket.</p>
              </div>
              <div className="mt-6 flex items-center text-indigo-800 font-bold gap-2 group-hover:gap-4 transition-all">
                <span>Access Portal</span>
                <FiArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Student Register Card */}
          <Link to="/student/register" className="group relative rounded-[2.5rem] border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-indigo-400 block text-left hover:-translate-y-2">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-8 md:p-10 flex flex-col h-full justify-between min-h-[280px]">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/80 border border-white flex items-center justify-center mb-6 shadow-sm">
                  <FiUserPlus className="w-7 h-7 text-indigo-800" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Student Registration</h2>
                <p className="text-slate-900 font-medium text-sm">School not participating? Register individually here.</p>
              </div>
              <div className="mt-6 flex items-center text-slate-900 font-bold gap-2 group-hover:gap-4 transition-all">
                <span>Start Registration</span>
                <FiArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default StudentAuthSelection;