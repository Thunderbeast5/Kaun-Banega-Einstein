import { useState, useRef } from 'react';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FiArrowLeft, FiCheckCircle, FiImage, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../lib/firebase';
import { uploadStudentPhoto, generateApplicationNumber } from '../lib/cloudinary';
import schools from '../../data/schools.json';

const schoolByUdise = new Map(schools.map((school) => [school.udise_code, school]));
const schoolByName = new Map(schools.map((school) => [school.school_name, school]));

const StudentRegistration = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [form, setForm] = useState({
    name: '',
    dob: '',
    grade: '',
    division: '',
    rollNumber: '',
    udiseNumber: '',
    schoolName: '',
    parentName: '',
    relation: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUdiseChange = (e) => {
    const nextUdise = e.target.value.replace(/\D/g, '').slice(0, 11);
    const school = schoolByUdise.get(nextUdise);
    
    setForm((prev) => ({
      ...prev,
      udiseNumber: nextUdise,
      ...(school ? { schoolName: school.school_name } : {})
    }));
  };

  const handleSchoolNameChange = (e) => {
    const nextName = e.target.value;
    const school = schoolByName.get(nextName);

    setForm((prev) => ({
      ...prev,
      schoolName: nextName,
      ...(school ? { udiseNumber: school.udise_code } : {})
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoError('');

    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setPhotoError('Only JPG, PNG, or WEBP images are allowed.');
      return;
    }

    if (file.size > 1024 * 1024) {
      setPhotoError('Image size must be less than 1 MB.');
      return;
    }

    setPhotoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);
  };

  const handleRemovePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    setSubmitMessage('');

    if (form.password !== form.confirmPassword) {
      setSubmitMessage('Password and confirm password must match.');
      return;
    }

    setIsSubmitting(true);
    let createdUser;
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      createdUser = userCredential.user;

      // 0. Check if the school is already officially registered
      const schoolRef = doc(firestore, 'schools', form.udiseNumber);
      const schoolSnap = await getDoc(schoolRef);

      if (schoolSnap.exists()) {
        const schoolData = schoolSnap.data();
        const coordinatorName = schoolData.coordinatorName || 'the School Coordinator';
        throw new Error(`already_registered||Your school is already officially registered. Please contact ${coordinatorName} to register you.`);
      }

      const appNumber = generateApplicationNumber(form.udiseNumber, form.rollNumber);

      let photoUrl = null;
      if (photoFile) {
        // uploadStudentPhoto expects (file, udise, appNumber)
        photoUrl = await uploadStudentPhoto(photoFile, form.udiseNumber, appNumber);
      }

      const studentReference = doc(firestore, 'individual_students', createdUser.uid);

      await setDoc(studentReference, {
        name: form.name,
        dob: form.dob,
        standard: form.grade === '9' ? '9th Grade' : '10th Grade',
        grade: form.grade,
        division: form.division,
        rollNo: form.rollNumber,
        udise: form.udiseNumber,
        school: form.schoolName,
        parentName: form.parentName,
        relation: form.relation,
        phone: form.mobile,
        email: form.email,
        applicationNumber: appNumber,
        photoUrl: photoUrl,
        createdAt: serverTimestamp(),
      });

      navigate('/student/dashboard', { state: { uid: createdUser.uid } });
    } catch (error) {
      if (createdUser) {
        await deleteUser(createdUser).catch(() => undefined);
      }

      if (error.message && error.message.startsWith('already_registered||')) {
        setSubmitMessage(error.message.split('||')[1]);
      } else if (error.code === 'auth/email-already-in-use') {
        setSubmitMessage('This email is already registered.');
      } else {
        setSubmitMessage(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-50 overflow-hidden py-24 z-0">
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-400/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-purple-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <Link to="/auth" aria-label="Back to account options" title="Back to account options" className="fixed left-6 top-6 z-50 inline-flex rounded-full p-3 text-slate-700 hover:bg-white hover:text-indigo-700 transition-colors shadow-sm">
          <FiArrowLeft className="w-5 h-5" />
        </Link>

        
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Student Registration</h1>
          <p className="text-slate-600 font-medium">Register independently to participate in KBE.</p>
        </div>

        <form onSubmit={handleRegistration} className="space-y-8">
          
          {/* 1. Academic Details */}
          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-indigo-100 overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-8 md:p-10">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-white/40 pb-4">1. Academic Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2">
                  <InputField name="name" label="Student Full Name" type="text" placeholder="e.g. Aarav Sharma" value={form.name} onChange={handleInput} required />
                </div>

                <div className="md:col-span-2">
                  <InputField name="dob" label="Date of Birth" type="date" value={form.dob} onChange={handleInput} required />
                </div>

                <SelectField name="grade" label="Class" value={form.grade} onChange={handleInput} required>
                  <option value="">Select Class</option>
                  <option value="9">9th Grade</option>
                  <option value="10">10th Grade</option>
                </SelectField>

                <SelectField name="division" label="Division" value={form.division} onChange={handleInput} required>
                  <option value="">Select Division</option>
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </SelectField>

                <div className="md:col-span-2">
                  <InputField 
                    name="rollNumber" 
                    label="Roll Number" 
                    type="text" 
                    placeholder="Letters and numbers only (e.g. 30A)" 
                    value={form.rollNumber} 
                    onChange={handleInput} 
                    pattern="[A-Za-z0-9]+"
                    title="Use letters and numbers only"
                    required 
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    name="udiseNumber" 
                    label="UDISE Number" 
                    type="text" 
                    placeholder="11-digit UDISE code" 
                    value={form.udiseNumber} 
                    onChange={handleUdiseChange} 
                    inputMode="numeric"
                    maxLength={11}
                    pattern="[0-9]{11}"
                    required 
                  />
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-sm font-bold text-slate-800 ml-1">School Name</label>
                    <input 
                      name="schoolName"
                      type="text" 
                      placeholder="Name of your school" 
                      value={form.schoolName}
                      onChange={handleSchoolNameChange}
                      required
                      list="school-names"
                      className="w-full bg-white/60 border border-white rounded-xl px-4 py-3 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-sm font-medium"
                    />
                    <datalist id="school-names">
                      {schools.map(s => (
                        <option key={s.udise_code} value={s.school_name} />
                      ))}
                    </datalist>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          {/* 2. Parent / Guardian Details */}
          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-indigo-100 overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-8 md:p-10">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-white/40 pb-4">2. Parent / Guardian Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2">
                  <InputField name="parentName" label="Parent/Guardian Name" type="text" placeholder="Full name" value={form.parentName} onChange={handleInput} required />
                </div>

                <SelectField name="relation" label="Relation" value={form.relation} onChange={handleInput} required>
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
                    <span className="inline-flex items-center rounded-l-xl border border-r-0 border-white bg-white/40 px-3 text-sm font-bold text-slate-700">
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
                      className="w-full rounded-r-xl border border-white bg-white/60 px-4 py-3 text-slate-900 placeholder-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm font-medium"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* 3. Student Photo */}
          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-indigo-100 overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-8 md:p-10">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-white/40 pb-4">3. Student Photo</h2>
              
              {photoPreview ? (
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
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white border-dashed rounded-2xl cursor-pointer bg-white/40 hover:bg-white/60 transition-colors shadow-sm">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiImage className="w-8 h-8 text-indigo-600 mb-2" />
                    <p className="text-sm text-slate-600 font-medium">
                      <span className="font-bold text-indigo-700">Click to upload</span> or drag and drop
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
                <p role="alert" className="mt-2 text-sm font-semibold text-red-700">{photoError}</p>
              )}
            </div>
          </div>

          {/* Account Security */}
          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-indigo-50 overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-8 md:p-10">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-white/40 pb-4">Account Login Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="md:col-span-2">
                  <InputField name="email" label="Email Address" type="email" placeholder="your@email.com" value={form.email} onChange={handleInput} required />
                </div>
                <InputField name="password" label="Password" type="password" placeholder="Create a strong password" value={form.password} onChange={handleInput} required />
                <InputField name="confirmPassword" label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={handleInput} required />
              </div>

              <div className="bg-white/60 border border-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-10 py-4 rounded-full bg-indigo-700 text-white font-bold hover:bg-indigo-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60">
                  <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
                  <FiCheckCircle className="w-5 h-5" />
                </button>
              </div>
              {submitMessage && <p role="alert" className="mt-4 text-center text-sm font-semibold text-red-700">{submitMessage}</p>}

            </div>
          </div>

        </form>
      </div>
    </main>
  );
};

const InputField = ({ label, type, placeholder, value, onChange, readOnly, required = false, ...inputProps }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm font-bold text-slate-800 ml-1">{label}</label>
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      required={required}
      {...inputProps}
      className="w-full bg-white/60 border border-white rounded-xl px-4 py-3 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-sm font-medium"
    />
  </div>
);

const SelectField = ({ label, value, onChange, required = false, children, ...selectProps }) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm font-bold text-slate-800 ml-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      required={required}
      {...selectProps}
      className="w-full bg-white/60 border border-white rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all shadow-sm font-medium"
    >
      {children}
    </select>
  </div>
);

export default StudentRegistration;
