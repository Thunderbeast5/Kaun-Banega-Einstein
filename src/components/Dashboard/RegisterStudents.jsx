import { useState } from 'react';
import { FiPlus, FiDownload, FiUploadCloud, FiFileText, FiImage } from 'react-icons/fi';

const RegisterStudents = ({ schoolInfo }) => {
  const [photoError, setPhotoError] = useState('');

  const handlePhotoChange = (event) => {
    const photo = event.target.files[0];

    if (photo && photo.size > 1024 * 1024) {
      event.target.value = '';
      setPhotoError('Photo must be 1 MB or smaller.');
      return;
    }

    setPhotoError('');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Register Students</h2>
        <p className="text-slate-600 font-medium">Add individual students or bulk upload your entire class roster.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* ================= LEFT: SINGLE STUDENT FORM ================= */}
        <div className="lg:col-span-3 relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-100 overflow-hidden h-fit">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          
          <form className="relative z-10 p-6 sm:p-8 flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
            
            {/* 1. Academic Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b border-white/50 pb-3 mb-4">1. Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputField label="Student Full Name" placeholder="e.g. Aarav Sharma" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-800 ml-1">Class</label>
                  <select className="w-full bg-white/80 border border-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm font-medium">
                    <option value="">Select Class</option>
                    <option value="9">9th Grade</option>
                    <option value="10">10th Grade</option>
                  </select>
                </div>
                
                <SelectField label="Division" name="division" required>
                  <option value="">Select Division</option>
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((division) => (
                    <option key={division} value={division}>{division}</option>
                  ))}
                </SelectField>
                <div className="md:col-span-2">
                  <InputField
                    label="Roll Number / Unique ID"
                    name="rollNumber"
                    placeholder="Letters and numbers only"
                    pattern="[A-Za-z0-9]+"
                    title="Use letters and numbers only"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <InputField label="School Name" placeholder="Name of the institution" defaultValue={schoolInfo.name} readOnly />
                </div>
                <div className="md:col-span-2">
                  <InputField label="School UDISE" placeholder="11-digit UDISE code" defaultValue={schoolInfo.udise} readOnly />
                </div>
              </div>
            </div>

            {/* 2. Parent/Guardian Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b border-white/50 pb-3 mb-4">2. Parent / Guardian Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputField label="Parent/Guardian Name" placeholder="Full name" required />
                </div>
                <SelectField label="Relation" name="relation" required>
                    <option value="">Select Relation</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Guardian</option>
                  </SelectField>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="student-mobile" className="text-sm font-bold text-slate-800 ml-1">Mobile Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-xl border border-r-0 border-white bg-slate-100/80 px-3 text-sm font-bold text-slate-700">+91</span>
                      <input
                        id="student-mobile"
                        name="mobileNumber"
                        type="tel"
                        placeholder="10-digit mobile number"
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        title="Enter exactly 10 digits after +91"
                        required
                        className="w-full rounded-r-xl border border-white bg-white/80 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm font-medium"
                      />
                    </div>
                </div>
              </div>
            </div>

            {/* 3. Photo Upload */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b border-white/50 pb-3 mb-4">3. Student Photo</h3>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white border-dashed rounded-2xl cursor-pointer bg-white/40 hover:bg-white/60 transition-colors shadow-sm">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiImage className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-sm text-slate-600 font-medium"><span className="font-bold text-blue-700">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 1MB</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </label>
              {photoError && <p role="alert" className="mt-2 text-sm font-semibold text-red-700">{photoError}</p>}
            </div>

            <button type="submit" className="w-full py-4 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 transition-all shadow-md flex items-center justify-center gap-2 mt-2">
              <FiPlus className="w-5 h-5" />
              <span>Register Single Student</span>
            </button>
          </form>
        </div>

        {/* ================= RIGHT: BULK UPLOAD ================= */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Download Template Card */}
          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-200 overflow-hidden h-fit">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-8 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 border border-slate-100">
                <FiFileText className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Bulk Format Template</h3>
              <p className="text-slate-700 text-sm font-medium mb-6">
                Download the official Excel template. Fill in the student and parent details accurately before uploading.
              </p>
              <button className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-white border border-slate-200 text-blue-700 font-bold hover:bg-blue-50 transition-colors shadow-sm">
                <FiDownload className="w-4 h-4" />
                <span>Download .XLSX Format</span>
              </button>
            </div>
          </div>

          {/* Upload Excel Card (Made more compact) */}
          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-400 overflow-hidden h-fit">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            {/* Decorative element */}
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-500/40 rounded-full -z-10" />
            
            <div className="relative z-10 p-8 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Roster</h3>
              <p className="text-blue-900 text-sm font-medium mb-5">
                Upload your completed Excel format here.
              </p>

              {/* Compact Drag & Drop Zone */}
              <label className="flex flex-col items-center justify-center py-6 border-2 border-white/60 border-dashed rounded-2xl cursor-pointer bg-white/30 hover:bg-white/50 transition-colors shadow-sm group">
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <FiUploadCloud className="w-8 h-8 text-blue-700 mb-2 group-hover:-translate-y-1 transition-transform" />
                  <p className="text-sm text-slate-900 font-bold mb-1">Drag & Drop Excel File</p>
                  <p className="text-xs text-blue-900 font-medium">.xlsx or .csv supported</p>
                </div>
                <input type="file" className="hidden" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
              </label>

              <button className="flex items-center justify-center gap-2 w-full py-3 mt-4 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 transition-colors shadow-md text-sm">
                <FiUploadCloud className="w-4 h-4" />
                <span>Process Upload</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Reusable form field components
const SelectField = ({ label, name, children, required = false }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm font-bold text-slate-800 ml-1">{label}</label>
    <select
      name={name}
      required={required}
      className="w-full bg-white/80 border border-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm font-medium"
    >
      {children}
    </select>
  </div>
);

const InputField = ({ label, placeholder, type = "text", defaultValue, readOnly, name, pattern, title, required = false }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm font-bold text-slate-800 ml-1">{label}</label>
    <input 
      type={type}
      name={name}
      placeholder={placeholder} 
      defaultValue={defaultValue}
      readOnly={readOnly}
      pattern={pattern}
      title={title}
      required={required}
      className={`w-full border rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm font-medium transition-all ${
        readOnly 
          ? 'bg-white/40 border-transparent text-slate-600 cursor-not-allowed' 
          : 'bg-white/80 border-white focus:bg-white'
      }`}
    />
  </div>
);

export default RegisterStudents;