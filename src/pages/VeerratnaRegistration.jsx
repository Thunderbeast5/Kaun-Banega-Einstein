import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, runTransaction, serverTimestamp, where } from 'firebase/firestore';
import { FiArrowLeft, FiCheckCircle, FiX, FiLock, FiAward, FiUser, FiHome, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import schools from '../../data/schools.json';
import { firestore } from '../lib/firebase';

const schoolByUdise = new Map(schools.map((school) => [school.udise_code, school]));

const VeerratnaRegistration = () => {
  const [registrationsOpen, setRegistrationsOpen] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Form states
  const [udiseNumber, setUdiseNumber] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [lookupMessage, setLookupMessage] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if registrations are open
  useEffect(() => {
    getDoc(doc(firestore, 'settings', 'platformControls'))
      .then(snap => {
        const data = snap.exists() ? snap.data() : {};
        setRegistrationsOpen(data.registrationsOpen !== false); // default true
      })
      .catch(() => setRegistrationsOpen(true)) // fail open
      .finally(() => setCheckingStatus(false));
  }, []);

  const handleUdiseChange = (event) => {
    const nextUdise = event.target.value.replace(/\D/g, '').slice(0, 11);
    const school = schoolByUdise.get(nextUdise);

    setUdiseNumber(nextUdise);
    setSchoolName(school?.school_name ?? '');
    setLookupMessage(
      nextUdise.length === 11 && !school
        ? 'No school was found for this UDISE number. You can still enter your school name manually below.'
        : '',
    );
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    setSubmitMessage('');

    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const cleanUdise = (formData.udiseNumber || '').trim();
    const cleanEmail = (formData.coordinatorEmail || '').toLowerCase().trim();
    const cleanMobile = (formData.coordinatorMobile || '').trim();
    const cleanWhatsapp = (formData.coordinatorWhatsapp || '').trim();

    if (!cleanUdise || cleanUdise.length !== 11) {
      setSubmitMessage('Enter a valid 11-digit UDISE number.');
      return;
    }

    if (!cleanEmail) {
      setSubmitMessage('Please provide a valid coordinator email address.');
      return;
    }

    if (!cleanMobile) {
      setSubmitMessage('Please provide a valid coordinator mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Duplicate Check across the collection (Unique per applicant - email and mobile)
      const veerratnaCol = collection(firestore, 'veerratna');

      // Check by Coordinator Email
      const emailQuery = query(veerratnaCol, where('coordinatorEmail', '==', cleanEmail));
      const emailSnap = await getDocs(emailQuery);
      if (!emailSnap.empty) {
        throw new Error(`An application with coordinator email "${cleanEmail}" has already been submitted.`);
      }

      // Check by Coordinator Mobile
      const mobileQuery = query(veerratnaCol, where('coordinatorMobile', '==', cleanMobile));
      const mobileSnap = await getDocs(mobileQuery);
      if (!mobileSnap.empty) {
        throw new Error(`An application with coordinator mobile number "${cleanMobile}" has already been submitted.`);
      }

      // 2. Atomic Transaction with unique ID per applicant (sanitized email)
      const docId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
      const veerratnaRef = doc(firestore, 'veerratna', docId);

      const resolvedSchoolName = schoolName || formData.schoolName || schoolByUdise.get(cleanUdise)?.school_name || 'Unknown School';

      const entryPayload = {
        coordinatorName: (formData.coordinatorName || '').trim(),
        coordinatorEmail: cleanEmail,
        coordinatorMobile: cleanMobile,
        coordinatorWhatsapp: cleanWhatsapp,
        experience: (formData.experience || '').trim(),
        aboutYourself: (formData.aboutYourself || '').trim(),
        address: (formData.address || formData.workAddress || '').trim(),
        workAddress: (formData.address || formData.workAddress || '').trim(),
        udiseNumber: cleanUdise,
        schoolName: resolvedSchoolName,
        schoolAddress: (formData.schoolAddress || '').trim(),
        taluka: (formData.taluka || '').trim(),
        district: (formData.district || '').trim(),
        pinCode: (formData.pinCode || '').trim(),
        createdAt: serverTimestamp(),
        status: 'submitted',
      };

      await runTransaction(firestore, async (transaction) => {
        const existingEntry = await transaction.get(veerratnaRef);
        if (existingEntry.exists()) {
          throw new Error(`An application with email "${cleanEmail}" has already been registered.`);
        }
        transaction.set(veerratnaRef, entryPayload);
      });

      setSubmittedData({
        ...entryPayload,
        submittedAt: new Date().toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      if (error.code === 'permission-denied') {
        setSubmitMessage('Firestore blocked this registration. Please verify security rules in Firebase.');
      } else {
        setSubmitMessage(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking status
  if (checkingStatus) {
    return (
      <main className="relative min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  // Registrations closed screen
  if (!registrationsOpen) {
    return (
      <main className="relative min-h-screen bg-slate-50 overflow-hidden flex items-center justify-center px-6">
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-400/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-cyan-400/10 rounded-full blur-[100px]" />
        </div>
        <Link to="/" className="fixed left-6 top-6 z-50 inline-flex rounded-full p-3 text-slate-700 hover:bg-white hover:text-blue-700 transition-colors shadow-sm">
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FiLock className="w-7 h-7 text-slate-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">Registrations Closed</h1>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">
            Veerratna Award registrations are currently closed. Please check back later or contact the KBE team for assistance.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // Success Confirmation Screen
  if (isSubmitted && submittedData) {
    return (
      <main className="relative min-h-screen bg-slate-50 overflow-hidden py-24 px-6 flex items-center justify-center z-0">
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-amber-400/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-400/15 rounded-full blur-[100px]" />
        </div>

        <Link to="/" className="fixed left-6 top-6 z-50 inline-flex rounded-full p-3 text-slate-700 hover:bg-white hover:text-blue-700 transition-colors shadow-sm">
          <FiArrowLeft className="w-5 h-5" />
        </Link>

        <div className="relative z-10 max-w-2xl w-full">
          <div className="relative rounded-[2.5rem] border border-white/60 shadow-xl bg-white/80 backdrop-blur-xl p-8 md:p-12 text-center overflow-hidden">
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20 text-white">
              <FiAward className="w-10 h-10" />
            </div>

            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-3">
              Application Submitted
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Veerratna Award 2026
            </h1>
            <p className="text-slate-600 font-medium leading-relaxed max-w-lg mx-auto mb-8">
              Thank you, <span className="font-bold text-slate-900">{submittedData.coordinatorName}</span>. Your nomination has been securely submitted and recorded in the database.
            </p>

            <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 mb-8 space-y-3 font-medium text-sm text-slate-700">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">School Name</span>
                <span className="font-bold text-slate-900 text-right">{submittedData.schoolName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">UDISE Number</span>
                <span className="font-mono font-bold text-blue-700">{submittedData.udiseNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Coordinator Email</span>
                <span className="text-slate-900">{submittedData.coordinatorEmail}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Experience</span>
                <span className="font-bold text-slate-900">{submittedData.experience} Years</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Submission Date</span>
                <span className="text-slate-900">{submittedData.submittedAt}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-md"
              >
                <FiHome className="w-4 h-4" />
                <span>Return to Home</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setSubmittedData(null);
                  setUdiseNumber('');
                  setSchoolName('');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-sm"
              >
                <span>Submit Another Application</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-slate-50 overflow-hidden py-24 z-0">
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-400/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-amber-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <Link to="/" aria-label="Back to home" title="Back to home" className="fixed left-6 top-6 z-50 inline-flex rounded-full p-3 text-slate-700 hover:bg-white hover:text-blue-700 transition-colors shadow-sm">
          <FiArrowLeft className="w-5 h-5" />
        </Link>

        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs uppercase tracking-wider mb-4 border border-amber-200/60 shadow-sm">
            <FiAward className="w-4 h-4" />
            <span>KBE Excellence Award</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Veerratna Award</h1>
          <p className="text-slate-600 font-medium max-w-2xl mx-auto">
            Honoring exceptional coordinators, teachers, and educators for their invaluable contributions to student empowerment.
          </p>
        </div>

        <form onSubmit={handleRegistration} className="space-y-8">

          {/* SECTION 1: Coordinator Details */}
          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-200 overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6 border-b border-white/40 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  1
                </div>
                <h2 className="text-xl font-bold text-slate-900">Coordinator / Nominee Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  name="coordinatorName"
                  label="Full Name"
                  type="text"
                  placeholder="e.g. Prof. Rajesh Sharma"
                  required
                />
                <InputField
                  name="coordinatorEmail"
                  label="Email Address"
                  type="email"
                  placeholder="coordinator@example.com"
                  required
                />
                <InputField
                  name="coordinatorMobile"
                  label="Phone / Mobile Number"
                  type="tel"
                  placeholder="+91 9876543210"
                  required
                />
                <InputField
                  name="coordinatorWhatsapp"
                  label="WhatsApp Number"
                  type="tel"
                  placeholder="+91 9876543210"
                  required
                />
                <InputField
                  name="experience"
                  label="Years of Experience"
                  type="number"
                  placeholder="e.g. 8"
                  min="0"
                  step="0.5"
                  required
                />
                <div className="md:col-span-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-800 ml-1">Your Address</label>
                    <textarea
                      name="address"
                      required
                      rows="2"
                      placeholder="Your complete residential or street address"
                      className="w-full bg-white/60 border border-white rounded-xl px-4 py-3 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all shadow-sm resize-none font-medium text-sm"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-800 ml-1">About Yourself & Key Contributions</label>
                    <textarea
                      name="aboutYourself"
                      required
                      rows="4"
                      placeholder="Briefly describe your teaching journey, notable accomplishments, student mentorship, and why you are applying for the Veerratna Award."
                      className="w-full bg-white/60 border border-white rounded-xl px-4 py-3 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all shadow-sm resize-none font-medium text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: School Information */}
          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-100 overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6 border-b border-white/40 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  2
                </div>
                <h2 className="text-xl font-bold text-slate-900">Associated School Information</h2>
              </div>

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
                  {lookupMessage && <p className="mt-2 text-sm font-semibold text-blue-800">{lookupMessage}</p>}
                </div>

                <div>
                  <InputField
                    label="School Name"
                    type="text"
                    placeholder="School name will appear after UDISE lookup"
                    value={schoolName}
                    onChange={(event) => setSchoolName(event.target.value)}
                    readOnly={Boolean(schoolByUdise.get(udiseNumber))}
                    name="schoolName"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-800 ml-1">School Address</label>
                    <textarea
                      name="schoolAddress"
                      required
                      rows="3"
                      placeholder="Complete street address of the school"
                      className="w-full bg-white/60 border border-white rounded-xl px-4 py-3 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all shadow-sm resize-none font-medium text-sm"
                    />
                  </div>
                </div>

                <InputField name="taluka" label="Taluka" type="text" placeholder="e.g. Niphad" required />
                <InputField name="district" label="District" type="text" placeholder="e.g. Nashik" required />
                <InputField name="pinCode" label="PIN Code" type="text" placeholder="6-digit PIN" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required />
              </div>
            </div>
          </div>

          {/* SECTION 3: Confirmation & Submit */}
          <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-100 overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-8 md:p-10">
              <div className="bg-white/60 border border-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    name="termsAccepted"
                    value="true"
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                    required
                  />
                  <span className="text-sm font-medium text-slate-700 max-w-md">
                    I confirm that the coordinator and school details submitted for the Veerratna Award are accurate, and I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setIsTermsOpen(true)}
                      className="text-blue-700 font-bold hover:underline"
                    >
                      Terms & Conditions
                    </button>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-10 py-4 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{isSubmitting ? 'Submitting Application...' : 'Submit Veerratna Application'}</span>
                  <FiCheckCircle className="w-5 h-5" />
                </button>
              </div>

              {submitMessage && (
                <div role="alert" className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-center text-sm font-semibold text-red-700">
                  {submitMessage}
                </div>
              )}
            </div>
          </div>

        </form>
      </div>

      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-6 py-10" role="dialog" aria-modal="true" aria-labelledby="terms-title">
          <div className="relative max-h-full w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/60 bg-white p-8 shadow-2xl md:p-10">
            <button
              type="button"
              onClick={() => setIsTermsOpen(false)}
              aria-label="Close terms and conditions"
              className="absolute right-6 top-6 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
            <h2 id="terms-title" className="pr-10 text-2xl font-bold text-slate-900">Veerratna Award Terms & Conditions</h2>
            <div className="mt-6 space-y-4 text-slate-700 leading-relaxed text-sm">
              <p>1. The Veerratna Award is presented to acknowledge educational coordinators and teachers demonstrating extraordinary commitment to learning and student guidance.</p>
              <p>2. Coordinators and teachers are eligible to register individually. Each applicant may register once using their unique email and phone number.</p>
              <p>3. Information submitted in this form may be reviewed by the KBE evaluation committee to determine award recipients.</p>
              <p>4. All decisions by the evaluation committee are final and binding.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsTermsOpen(false)}
              className="mt-8 rounded-full bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

// Reusable Input Component to keep styling unified
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
      className="w-full bg-white/60 border border-white rounded-xl px-4 py-3 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all shadow-sm font-medium text-sm"
    />
  </div>
);

export default VeerratnaRegistration;
