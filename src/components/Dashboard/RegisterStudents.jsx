import { useRef, useState } from 'react';
import {
  FiPlus, FiDownload, FiUploadCloud,
  FiFileText, FiImage, FiCheck, FiAlertCircle,
  FiLoader, FiX, FiClipboard,
} from 'react-icons/fi';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { uploadStudentPhoto, generateApplicationNumber } from '../../lib/cloudinary';

// ─── Initial form state ───────────────────────────────────────────────────────
const INITIAL_FORM = {
  name: '',
  grade: '',
  division: '',
  rollNumber: '',
  parentName: '',
  relation: '',
  mobile: '',
};

// ─── Main component ───────────────────────────────────────────────────────────
const RegisterStudents = ({ schoolInfo }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState(null); // { applicationNumber, photoUrl }
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  // ── Derived application number (shown live as teacher types) ─────────────
  const applicationNumber =
    form.rollNumber.trim()
      ? generateApplicationNumber(schoolInfo.udise, form.rollNumber.trim())
      : null;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setPhotoError('Photo must be 1 MB or smaller.');
      e.target.value = '';
      return;
    }

    setPhotoError('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyAppNum = async () => {
    if (!successInfo?.applicationNumber) return;
    await navigator.clipboard.writeText(successInfo.applicationNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    handleRemovePhoto();
    setStatus('idle');
    setSuccessInfo(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('uploading');
    setErrorMsg('');

    try {
      const appNum = generateApplicationNumber(schoolInfo.udise, form.rollNumber.trim());

      // 1. Upload photo to Cloudinary (if provided)
      let photoUrl = null;
      if (photoFile) {
        photoUrl = await uploadStudentPhoto(photoFile, schoolInfo.udise, appNum);
      }

      // 2. Write to Firestore: students/{udise}/roster/{applicationNumber}
      const studentDocRef = doc(
        collection(
          doc(firestore, 'students', String(schoolInfo.udise)),
          'roster'
        ),
        appNum
      );

      await setDoc(studentDocRef, {
        applicationNumber: appNum,
        name: form.name.trim(),
        grade: form.grade,
        division: form.division,
        rollNumber: form.rollNumber.trim().toUpperCase(),
        parentName: form.parentName.trim(),
        relation: form.relation,
        mobile: form.mobile.trim(),
        schoolName: schoolInfo.name,
        udise: String(schoolInfo.udise),
        photoUrl: photoUrl ?? null,
        registeredAt: serverTimestamp(),
      });

      setSuccessInfo({ applicationNumber: appNum, photoUrl });
      setStatus('success');
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (status === 'success' && successInfo) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Register Students</h2>
          <p className="text-slate-600 font-medium">Add individual students or bulk upload your entire class roster.</p>
        </div>

        <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-100 overflow-hidden max-w-lg mx-auto">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          <div className="relative z-10 p-10 flex flex-col items-center text-center gap-6">

            {/* Success icon */}
            <div className="w-20 h-20 rounded-full bg-green-100 border-4 border-green-200 flex items-center justify-center shadow-sm">
              <FiCheck className="w-9 h-9 text-green-600" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Student Registered!</h3>
              <p className="text-slate-600 font-medium text-sm">The student has been added to your school's roster.</p>
            </div>

            {/* Photo thumbnail */}
            {successInfo.photoUrl && (
              <img
                src={successInfo.photoUrl}
                alt="Student"
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
              />
            )}

            {/* Application number */}
            <div className="w-full bg-white/70 rounded-2xl p-5 border border-white shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Application Number</p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl font-black text-blue-700 tracking-wider">
                  {successInfo.applicationNumber}
                </span>
                <button
                  onClick={handleCopyAppNum}
                  title="Copy application number"
                  className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  {copied ? <FiCheck className="w-4 h-4 text-green-600" /> : <FiClipboard className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={handleReset}
                className="flex-1 py-3.5 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <FiPlus className="w-5 h-5" />
                Register Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Register Students</h2>
        <p className="text-slate-600 font-medium">Add individual students or bulk upload your entire class roster.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* ── LEFT: SINGLE STUDENT FORM ────────────────────────────────── */}
        <div className="lg:col-span-3 relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-100 overflow-hidden h-fit">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />

          <form className="relative z-10 p-6 sm:p-8 flex flex-col gap-8" onSubmit={handleSubmit}>

            {/* 1. Academic Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b border-white/50 pb-3 mb-4">1. Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="md:col-span-2">
                  <InputField
                    label="Student Full Name"
                    name="name"
                    placeholder="e.g. Aarav Sharma"
                    value={form.name}
                    onChange={handleInput}
                    required
                  />
                </div>

                <SelectField
                  label="Class"
                  name="grade"
                  value={form.grade}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Class</option>
                  <option value="9">9th Grade</option>
                  <option value="10">10th Grade</option>
                </SelectField>

                <SelectField
                  label="Division"
                  name="division"
                  value={form.division}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Division</option>
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </SelectField>

                <div className="md:col-span-2">
                  <InputField
                    label="Roll Number"
                    name="rollNumber"
                    placeholder="Letters and numbers only (e.g. 30A)"
                    value={form.rollNumber}
                    onChange={handleInput}
                    pattern="[A-Za-z0-9]+"
                    title="Use letters and numbers only"
                    required
                  />
                  {/* Live application number preview */}
                  {applicationNumber && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Application No:</span>
                      <span className="font-mono font-bold text-blue-700 text-sm">{applicationNumber}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <InputField label="School Name" name="schoolName" defaultValue={schoolInfo.name} readOnly />
                </div>
                <div className="md:col-span-2">
                  <InputField label="School UDISE" name="udise" defaultValue={schoolInfo.udise} readOnly />
                </div>
              </div>
            </div>

            {/* 2. Parent / Guardian Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b border-white/50 pb-3 mb-4">2. Parent / Guardian Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="md:col-span-2">
                  <InputField
                    label="Parent/Guardian Name"
                    name="parentName"
                    placeholder="Full name"
                    value={form.parentName}
                    onChange={handleInput}
                    required
                  />
                </div>

                <SelectField
                  label="Relation"
                  name="relation"
                  value={form.relation}
                  onChange={handleInput}
                  required
                >
                  <option value="">Select Relation</option>
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="guardian">Guardian</option>
                </SelectField>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="student-mobile" className="text-sm font-bold text-slate-800 ml-1">
                    Mobile Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-xl border border-r-0 border-white bg-slate-100/80 px-3 text-sm font-bold text-slate-700">
                      +91
                    </span>
                    <input
                      id="student-mobile"
                      name="mobile"
                      type="tel"
                      placeholder="10-digit mobile number"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      title="Enter exactly 10 digits"
                      required
                      value={form.mobile}
                      onChange={handleInput}
                      className="w-full rounded-r-xl border border-white bg-white/80 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Student Photo */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b border-white/50 pb-3 mb-4">3. Student Photo</h3>

              {photoPreview ? (
                /* ── Preview ── */
                <div className="flex items-center gap-5 p-4 bg-white/60 border border-white rounded-2xl shadow-sm">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{photoFile?.name}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {(photoFile?.size / 1024).toFixed(0)} KB
                    </p>
                    {applicationNumber && (
                      <p className="text-xs text-blue-600 font-bold mt-1">
                        Will be stored as: <span className="font-mono">{applicationNumber}</span>
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    title="Remove photo"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                /* ── Upload zone ── */
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white border-dashed rounded-2xl cursor-pointer bg-white/40 hover:bg-white/60 transition-colors shadow-sm">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiImage className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-sm text-slate-600 font-medium">
                      <span className="font-bold text-blue-700">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 1 MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handlePhotoChange}
                  />
                </label>
              )}

              {photoError && (
                <p role="alert" className="mt-2 text-sm font-semibold text-red-700 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" /> {photoError}
                </p>
              )}
            </div>

            {/* Error banner */}
            {status === 'error' && errorMsg && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold">{errorMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'uploading'}
              className="w-full py-4 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {status === 'uploading' ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  <span>Registering Student…</span>
                </>
              ) : (
                <>
                  <FiPlus className="w-5 h-5" />
                  <span>Register Student</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── RIGHT: BULK UPLOAD ────────────────────────────────────────── */}
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

          {/* Upload Excel Card */}
          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-400 overflow-hidden h-fit">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-500/40 rounded-full -z-10" />

            <div className="relative z-10 p-8 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Roster</h3>
              <p className="text-blue-900 text-sm font-medium mb-5">Upload your completed Excel format here.</p>

              <label className="flex flex-col items-center justify-center py-6 border-2 border-white/60 border-dashed rounded-2xl cursor-pointer bg-white/30 hover:bg-white/50 transition-colors shadow-sm group">
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <FiUploadCloud className="w-8 h-8 text-blue-700 mb-2 group-hover:-translate-y-1 transition-transform" />
                  <p className="text-sm text-slate-900 font-bold mb-1">Drag &amp; Drop Excel File</p>
                  <p className="text-xs text-blue-900 font-medium">.xlsx or .csv supported</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
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

// ─── Reusable controlled field components ─────────────────────────────────────

const SelectField = ({ label, name, value, onChange, children, required = false }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm font-bold text-slate-800 ml-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-white/80 border border-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm font-medium"
    >
      {children}
    </select>
  </div>
);

const InputField = ({
  label, name, placeholder, type = 'text',
  value, onChange, defaultValue, readOnly,
  pattern, title, required = false,
}) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm font-bold text-slate-800 ml-1">{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
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