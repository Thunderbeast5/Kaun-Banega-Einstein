import { FiUser, FiCalendar, FiAlertTriangle } from 'react-icons/fi';
import kbeLogo from '../assets/KBE.png';
import kawaleLogo from '../assets/kawle.png';

/**
 * Pure-visual hall ticket — NO buttons, NO download logic.
 * Used for headless off-screen rendering in the bulk PDF generator.
 *
 * Uses IDENTICAL Tailwind markup to HallTicket.jsx so the output matches
 * the single-ticket preview exactly. (Previous inline-pixel-style version
 * produced a different layout because html2canvas clips to pixel dimensions
 * rather than the browser's mm-to-px conversion used by Tailwind.)
 *
 * Props:
 *   studentData: {
 *     name, school, grade, division, rollNumber,
 *     applicationNumber, photoUrl (optional)
 *   }
 */
const HallTicketPage = ({ studentData = {} }) => {
  const {
    name           = 'Student Name',
    school         = 'School Name',
    grade          = '',
    division       = '',
    rollNumber     = '—',
    applicationNumber = 'KBE-26-0000',
    photoUrl       = null,
  } = studentData;

  const standard = grade
    ? `${grade}${division ? ` – ${division}` : ''}`
    : '—';

  return (
    /* Outer wrapper must match HallTicket.jsx exactly */
    <div className="hall-ticket font-manrope w-[210mm] h-[297mm] bg-white relative overflow-hidden flex flex-col border border-slate-200 box-border">

      {/* Decorative Top Border */}
      <div className="h-3 w-full bg-blue-900" />

      <div className="px-8 py-5 flex-1 flex flex-col">

        {/* ── HEADER ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <img
            src={kbeLogo}
            alt="Kaun Banega Einstein logo"
            className="w-24 h-24 object-contain shrink-0"
            crossOrigin="anonymous"
          />

          <div className="text-center flex-1 px-4">
            <h1 className="text-xl font-extrabold text-blue-900 uppercase tracking-wide">
              B. K. Kawale Jr. College of Science
            </h1>
            <p className="text-sm font-medium text-slate-700 mt-1">in association with</p>
            <h2 className="text-lg font-bold text-blue-800 mt-1">Swami Vivekananda Institute</h2>
            <p className="text-sm font-medium text-slate-700 mt-1 mb-1">Organises</p>

            <div className="inline-block mb-1">
              <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tight" style={{ WebkitTextStroke: '1px #1e3a8a' }}>
                Kaun Banega Einstein 2026
              </h2>
            </div>

            <div className="bg-yellow-400 py-1 px-3 rounded-full border-2 border-blue-900 mx-auto">
              <p className="text-xs font-bold text-blue-900 uppercase whitespace-nowrap">
                Inter-School Science &amp; Innovation Examination
              </p>
            </div>
          </div>

          <img
            src={kawaleLogo}
            alt="B.K Kawale Jr. College of Science"
            className="w-24 h-24 object-contain shrink-0"
            crossOrigin="anonymous"
          />
        </div>

        {/* ── HALL TICKET BANNER & APP NO ───────────────────────────── */}
        <div className="flex items-end justify-between border-b-4 border-blue-900 pb-2 mb-4">
          <div className="bg-blue-900 text-white px-10 py-2 rounded-t-xl rounded-br-xl inline-block">
            <h2 className="text-3xl font-black tracking-widest uppercase">Hall Ticket</h2>
          </div>
          <div className="border-2 border-blue-900 p-2 text-center rounded-lg bg-slate-50 min-w-[140px]">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Application No.</p>
            <p className="text-lg font-black text-blue-900">{applicationNumber}</p>
          </div>
        </div>

        {/* ── STUDENT DETAILS ───────────────────────────────────────── */}
        <div className="mb-4 relative border-2 border-blue-100 rounded-2xl p-5 pt-7">
          <div className="absolute -top-4 left-6 bg-blue-900 text-white px-4 py-1.5 rounded-full flex items-center gap-2">
            <FiUser className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wider uppercase">Student Details</span>
          </div>

          <div className="flex justify-between gap-6">
            <div className="flex-1 space-y-4 text-sm">
              <div className="flex items-end border-b border-dashed border-slate-300 pb-1">
                <span className="w-32 font-bold text-slate-700">Student Name</span>
                <span className="font-bold text-slate-900 pl-4">{name}</span>
              </div>
              <div className="flex items-end border-b border-dashed border-slate-300 pb-1">
                <span className="w-32 font-bold text-slate-700">School Name</span>
                <span className="font-bold text-slate-900 pl-4">{school}</span>
              </div>
              <div className="flex items-end border-b border-dashed border-slate-300 pb-1">
                <span className="w-32 font-bold text-slate-700">Standard</span>
                <span className="font-bold text-slate-900 pl-4">{standard}</span>
              </div>
              <div className="flex items-end border-b border-dashed border-slate-300 pb-1">
                <span className="w-32 font-bold text-slate-700">Roll No.</span>
                <span className="font-bold text-slate-900 pl-4">{rollNumber}</span>
              </div>
              <div className="flex items-end border-b border-dashed border-slate-300 pb-1">
                <span className="w-32 font-bold text-slate-700">Application No.</span>
                <span className="font-bold text-slate-900 pl-4">{applicationNumber}</span>
              </div>
            </div>

            {/* Photo Box — real photo if available, placeholder otherwise */}
            <div className="w-[120px] h-[150px] border-2 border-slate-400 border-dashed rounded-lg flex flex-col items-center justify-center bg-slate-50 shrink-0 overflow-hidden">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Candidate"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <FiUser className="w-12 h-12 text-slate-300 mb-2" />
                  <span className="text-[10px] text-slate-400 font-bold text-center">
                    Paste Passport<br />Size Photo Here
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── EXAMINATION DETAILS ───────────────────────────────────── */}
        <div className="mb-4 relative border-2 border-blue-100 rounded-2xl p-5 pt-7">
          <div className="absolute -top-4 left-6 bg-blue-900 text-white px-4 py-1.5 rounded-full flex items-center gap-2">
            <FiCalendar className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wider uppercase">Examination Details</span>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div className="flex items-end border-b border-dashed border-slate-300 pb-1">
              <span className="w-28 font-bold text-slate-700">Exam Date</span>
              <span className="font-bold text-blue-900 pl-2">24 November 2026</span>
            </div>
            <div className="flex items-end border-b border-dashed border-slate-300 pb-1 col-span-2">
              <span className="w-28 font-bold text-slate-700">Reporting Time</span>
              <span className="font-bold text-blue-900 pl-2">09:30 AM</span>
            </div>
            <div className="flex items-end border-b border-dashed border-slate-300 pb-1">
              <span className="w-28 font-bold text-slate-700">Exam Time</span>
              <span className="font-bold text-blue-900 pl-2">10:00 AM – 12:00 PM</span>
            </div>
            <div className="flex items-end border-b border-dashed border-slate-300 pb-1 col-span-2">
              <span className="w-28 font-bold text-slate-700">Venue</span>
              <span className="font-bold text-slate-900 pl-2">B. K. Kawale Jr. College of Science Campus</span>
            </div>
          </div>
        </div>

        {/* ── INSTRUCTIONS ─────────────────────────────────────────── */}
        <div className="mb-4 relative border-2 border-yellow-400 bg-yellow-50/30 rounded-2xl p-5 pt-7">
          <div className="absolute -top-4 left-6 bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-full flex items-center gap-2">
            <FiAlertTriangle className="w-4 h-4" />
            <span className="text-sm font-black tracking-wider uppercase">Important Instructions</span>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-800 font-medium leading-relaxed pl-2">
            <li>Bring this Hall Ticket along with a valid school ID card to the examination centre.</li>
            <li>Reach the venue at least <strong>30 minutes</strong> before the examination starts.</li>
            <li>Mobile phones, smartwatches, and electronic gadgets are strictly prohibited inside the hall.</li>
            <li>Use only a blue or black ballpoint pen for writing the examination.</li>
            <li>Keep this Hall Ticket safely until the completion of the examination process.</li>
          </ol>
        </div>

        {/* ── SIGNATURES ───────────────────────────────────────────── */}
        <div className="flex justify-between items-end px-4 mt-auto">
          {["Student's Signature", 'Class Teacher', 'Exam Coordinator'].map((label) => (
            <div key={label} className="flex flex-col items-center">
              <div className="w-40 border-b border-slate-400 mb-2" />
              <span className="text-xs font-bold text-slate-600">{label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Decorative Bottom Banner */}
      <div className="w-full bg-blue-900 py-2 text-center shrink-0">
        <p className="text-yellow-400 text-xs font-bold italic tracking-wide whitespace-nowrap">
          "Think. Question. Discover. Become the next Einstein!"
        </p>
      </div>
    </div>
  );
};

export default HallTicketPage;
