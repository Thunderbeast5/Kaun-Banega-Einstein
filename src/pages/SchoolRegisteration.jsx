import { useState } from 'react';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { FiArrowLeft, FiCheckCircle, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import schools from '../../data/schools.json';
import { auth, firestore } from '../lib/firebase';

const schoolByUdise = new Map(schools.map((school) => [school.udise_code, school]));

const SchoolRegistration = () => {
  const navigate = useNavigate();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [udiseNumber, setUdiseNumber] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [schoolNumber, setSchoolNumber] = useState('');
  const [lookupMessage, setLookupMessage] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUdiseChange = (event) => {
    const nextUdise = event.target.value.replace(/\D/g, '').slice(0, 11);
    const school = schoolByUdise.get(nextUdise);

    setUdiseNumber(nextUdise);
    setSchoolName(school?.school_name ?? '');
    setLookupMessage(
      nextUdise.length === 11 && !school
        ? 'No school was found for this UDISE number.'
        : '',
    );
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    setSubmitMessage('');

    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const matchedSchool = schoolByUdise.get(formData.udiseNumber);

    if (!matchedSchool) {
      setSubmitMessage('Enter a valid UDISE number from the school list.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setSubmitMessage('Password and confirm password must match.');
      return;
    }

    const schoolReference = doc(firestore, 'schools', formData.udiseNumber);
    const schoolData = Object.fromEntries(
      Object.entries(formData).filter(
        ([fieldName]) => !['password', 'confirmPassword', 'termsAccepted'].includes(fieldName),
      ),
    );

    setIsSubmitting(true);
    let createdUser;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.coordinatorEmail,
        formData.password,
      );
      createdUser = userCredential.user;

      await runTransaction(firestore, async (transaction) => {
        const existingSchool = await transaction.get(schoolReference);

        if (existingSchool.exists()) {
          throw new Error('A school with this UDISE number is already registered.');
        }

        transaction.set(schoolReference, {
          ...schoolData,
          schoolName: matchedSchool.school_name,
          loginEmail: formData.coordinatorEmail,
          authUid: createdUser.uid,
          createdAt: serverTimestamp(),
        });
      });

      navigate('/dashboard', { state: { udiseNumber: formData.udiseNumber } });
    } catch (error) {
      if (createdUser) {
        await deleteUser(createdUser).catch(() => undefined);
      }

      if (error.code === 'permission-denied') {
        setSubmitMessage('Firestore is blocking this registration. Publish the firestore.rules file in Firebase first.');
      } else if (error.code === 'auth/email-already-in-use') {
        setSubmitMessage('This principal email is already registered.');
      } else if (error.message?.includes('already registered')) {
        setSubmitMessage(error.message);
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
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-400/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-cyan-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <Link to="/auth" aria-label="Back to account options" title="Back to account options" className="fixed left-6 top-6 z-50 inline-flex rounded-full p-3 text-slate-700 hover:bg-white hover:text-blue-700 transition-colors shadow-sm">
          <FiArrowLeft className="w-5 h-5" />
        </Link>

        
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">School Registration</h1>
          <p className="text-slate-600 font-medium">Fill in the details below to enroll your institution in KBE.</p>
        </div>

        <form onSubmit={handleRegistration} className="space-y-8">
          
          {/* SECTION 1: School Details */}
          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-100 overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-8 md:p-10">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-white/40 pb-4">1. School Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <InputField
                    label="UDISE Number"
                    type="text"
                    placeholder="11-digit UDISE code"
                    value={udiseNumber}
                    onChange={handleUdiseChange}
                    name="udiseNumber"
                    inputMode="numeric"
                    maxLength={11}
                    pattern="[0-9]{11}"
                    required
                  />
                  {lookupMessage && <p className="mt-2 text-sm font-semibold text-red-700">{lookupMessage}</p>}
                </div>
                <InputField
                  label="School Number"
                  type="text"
                  placeholder="Enter school number"
                  value={schoolNumber}
                  onChange={(event) => setSchoolNumber(event.target.value)}
                  name="schoolNumber"
                  required
                />
                <div className="md:col-span-2">
                  <InputField
                    label="School Name"
                    type="text"
                    placeholder="School name will appear after UDISE lookup"
                    value={schoolName}
                    readOnly
                    name="schoolName"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-800 ml-1">School Address</label>
                    <textarea name="schoolAddress" required rows="3" placeholder="Complete street address" className="w-full bg-white/60 border border-white rounded-xl px-4 py-3 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all shadow-sm resize-none"></textarea>
                  </div>
                </div>
                <InputField name="taluka" label="Taluka" type="text" placeholder="e.g. Niphad" required />
                <InputField name="district" label="District" type="text" placeholder="e.g. Nashik" required />
                <InputField name="pinCode" label="PIN Code" type="text" placeholder="6-digit PIN" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required />
              </div>
            </div>
          </div>

          {/* SECTION 2: Principal & Coordinator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Principal Details */}
            <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-200 overflow-hidden">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
              <div className="relative z-10 p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-white/40 pb-4">2. Principal Details</h2>
                <div className="space-y-5">
                  <InputField name="principalName" label="Full Name" type="text" placeholder="Name of Principal" required />
                  <InputField name="principalMobile" label="Mobile Number" type="tel" placeholder="+91" required />
                  <InputField name="principalEmail" label="Email Address" type="email" placeholder="principal@school.edu" required />
                </div>
              </div>
            </div>

            {/* Coordinator Details */}
            <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-200 overflow-hidden">
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
              <div className="relative z-10 p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-white/40 pb-4">3. Coordinator Details</h2>
                <div className="space-y-5">
                  <InputField name="coordinatorName" label="Full Name" type="text" placeholder="Name of Coordinator" required />
                  <InputField name="coordinatorMobile" label="Mobile Number" type="tel" placeholder="+91" required />
                  <InputField name="coordinatorWhatsapp" label="WhatsApp Number" type="tel" placeholder="+91" required />
                  <InputField name="coordinatorEmail" label="Email Address" type="email" placeholder="coordinator@school.edu" required />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Logistics & Security */}
          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-100 overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-8 md:p-10">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-white/40 pb-4">4. Final Details & Security</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Expected Student Count</h3>
                  <div className="flex gap-4">
                    <InputField name="grade9Students" label="9th Grade" type="number" placeholder="0" min="0" required />
                    <InputField name="grade10Students" label="10th Grade" type="number" placeholder="0" min="0" required />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Set Portal Password</h3>
                  <div className="space-y-4">
                    <InputField name="password" label="Password" type="password" placeholder="Create a strong password" required />
                    <InputField name="confirmPassword" label="Confirm Password" type="password" placeholder="Repeat password" required />
                  </div>
                </div>
              </div>

              {/* T&C and Submit */}
              <div className="bg-white/60 border border-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input name="termsAccepted" value="true" type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1" required />
                  <span className="text-sm font-medium text-slate-700 max-w-md">
                    I confirm that the information provided is accurate and I agree to the <button type="button" onClick={() => setIsTermsOpen(true)} className="text-blue-700 font-bold hover:underline">Terms & Conditions</button> of the KBE platform.
                  </span>
                </label>
                
                <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-10 py-4 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60">
                  <span>{isSubmitting ? 'Registering...' : 'Register School'}</span>
                  <FiCheckCircle className="w-5 h-5" />
                </button>
              </div>
              {submitMessage && <p role="alert" className="mt-4 text-center text-sm font-semibold text-red-700">{submitMessage}</p>}

            </div>
          </div>

        </form>
      </div>

      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-6 py-10" role="dialog" aria-modal="true" aria-labelledby="terms-title">
          <div className="relative max-h-full w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/60 bg-white p-8 shadow-2xl md:p-10">
            <button type="button" onClick={() => setIsTermsOpen(false)} aria-label="Close terms and conditions" className="absolute right-6 top-6 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
              <FiX className="w-5 h-5" />
            </button>
            <h2 id="terms-title" className="pr-10 text-2xl font-bold text-slate-900">Terms & Conditions</h2>
            <div className="mt-6 space-y-4 text-slate-700 leading-relaxed">
              <p>By registering your school, you confirm that the information submitted is accurate and complete.</p>
              <p>The school is responsible for protecting its portal credentials and for the accuracy of student and coordinator details.</p>
              <p>Registration information may be used to manage examinations, hall tickets, results, certificates, and official communication for the KBE platform.</p>
              <p>Submitting this form confirms your acceptance of these terms and the platform's examination policies.</p>
            </div>
            <button type="button" onClick={() => setIsTermsOpen(false)} className="mt-8 rounded-full bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

// Reusable Input Component to keep code clean
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
      className="w-full bg-white/60 border border-white rounded-xl px-4 py-3 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all shadow-sm font-medium"
    />
  </div>
);

export default SchoolRegistration;