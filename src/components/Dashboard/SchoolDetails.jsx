import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import SchoolDetailsSkeleton from './skeletons/SchoolDetailsSkeleton';

const SchoolDetails = ({ schoolInfo, loading }) => {
  if (loading || !schoolInfo) return <SchoolDetailsSkeleton />;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">School Profile</h2>
        <p className="text-slate-600 font-medium">Verify your registered institutional details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Basic Info Block */}
        <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-100 overflow-hidden">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          <div className="relative z-10 p-8">
            <h3 className="text-lg font-bold text-slate-900 border-b border-white/50 pb-4 mb-6">Institution Details</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">School Name</p>
                <p className="text-slate-900 font-bold text-lg">{schoolInfo.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">UDISE Code</p>
                <p className="text-slate-800 font-mono font-medium bg-white/60 px-3 py-1 rounded-lg inline-block">{schoolInfo.udise}</p>
              </div>
              <div className="flex items-start gap-3 mt-4">
                <FiMapPin className="w-5 h-5 text-blue-700 mt-1" />
                <div>
                  <p className="text-sm font-bold text-slate-800">Address</p>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {schoolInfo.schoolAddress || 'Not provided'}<br />
                    {schoolInfo.taluka}, {schoolInfo.district}<br />
                    PIN: {schoolInfo.pinCode || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Block */}
        <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-200 overflow-hidden">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          <div className="relative z-10 p-8">
            <h3 className="text-lg font-bold text-slate-900 border-b border-white/50 pb-4 mb-6">Key Contacts</h3>
            
            <div className="space-y-8">
              {/* Principal */}
              <div>
                <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Principal</p>
                <p className="text-slate-900 font-bold text-lg mb-2">{schoolInfo.principalName}</p>
                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium mb-1">
                  <FiPhone className="w-4 h-4 text-blue-700" />
                  <span>{schoolInfo.principalMobile}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <FiMail className="w-4 h-4 text-blue-700" />
                  <span>{schoolInfo.principalEmail}</span>
                </div>
              </div>

              {/* Coordinator */}
              <div className="pt-6 border-t border-white/40">
                <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Platform Coordinator</p>
                <p className="text-slate-900 font-bold text-lg mb-2">{schoolInfo.coordinatorName}</p>
                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <FiPhone className="w-4 h-4 text-blue-700" />
                  <span>{schoolInfo.coordinatorMobile}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SchoolDetails;