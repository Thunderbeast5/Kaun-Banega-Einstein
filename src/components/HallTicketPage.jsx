import kbeLogo from '../assets/KBE.png';
import kawaleLogo from '../assets/kawle.png';

/**
 * A pure-visual hall ticket page — no buttons, no download logic.
 * Used for headless rendering (html2canvas → jsPDF bulk generation).
 * Mount off-screen, capture with html2canvas, then unmount.
 *
 * Props:
 *   studentData: {
 *     name, school, grade, division, rollNumber,
 *     applicationNumber, photoUrl (optional)
 *   }
 */
const HallTicketPage = ({ studentData = {} }) => {
  const {
    name = 'Student Name',
    school = 'School Name',
    grade = '',
    division = '',
    rollNumber = '—',
    applicationNumber = 'KBE-26-0000',
    photoUrl = null,
  } = studentData;

  const standard = grade ? `${grade}th${division ? ` – ${division}` : ''}` : '—';

  const sectionLabel = (text) => ({
    position: 'absolute', top: '-14px', left: '20px',
    background: '#1e3a8a', color: '#fff',
    padding: '5px 14px', borderRadius: '999px',
    fontSize: '11px', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.05em',
  });

  return (
    <div
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: '#ffffff',
        display: 'flex', flexDirection: 'column',
        border: '1px solid #e2e8f0',
        boxSizing: 'border-box',
        overflow: 'hidden',
        width: '794px',
        height: '1123px',
      }}
    >
      {/* Decorative Top Border */}
      <div style={{ height: '12px', background: '#1e3a8a', flexShrink: 0 }} />

      <div style={{ padding: '28px 36px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <img src={kbeLogo} alt="KBE" crossOrigin="anonymous" style={{ width: '88px', height: '88px', objectFit: 'contain' }} />

          <div style={{ flex: 1, textAlign: 'center', padding: '0 16px' }}>
            <div style={{ fontSize: '17px', fontWeight: 900, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              B. K. Kawale Jr. College of Science
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>in association with</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1d4ed8', marginTop: '3px' }}>
              Swami Vivekananda Institute
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '3px', marginBottom: '4px' }}>Organises</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              Kaun Banega Einstein 2026
            </div>
            <div style={{ display: 'inline-block', background: '#facc15', padding: '3px 12px', borderRadius: '999px', border: '2px solid #1e3a8a', marginTop: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Inter-School Science &amp; Innovation Examination
              </span>
            </div>
          </div>

          <img src={kawaleLogo} alt="Kawale College" crossOrigin="anonymous" style={{ width: '88px', height: '88px', objectFit: 'contain' }} />
        </div>

        {/* HALL TICKET BANNER */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '4px solid #1e3a8a', paddingBottom: '8px', marginBottom: '16px' }}>
          <div style={{ background: '#1e3a8a', color: '#fff', padding: '6px 36px', borderRadius: '10px 10px 10px 0', display: 'inline-block' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Hall Ticket</span>
          </div>
          <div style={{ border: '2px solid #1e3a8a', padding: '6px 12px', textAlign: 'center', borderRadius: '8px', background: '#f8fafc', minWidth: '140px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Application No.</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#1e3a8a' }}>{applicationNumber}</div>
          </div>
        </div>

        {/* STUDENT DETAILS */}
        <div style={{ position: 'relative', border: '2px solid #dbeafe', borderRadius: '16px', padding: '20px', paddingTop: '28px', marginBottom: '14px' }}>
          <div style={sectionLabel()}>Student Details</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              {[
                ['Student Name', name],
                ['School Name', school],
                ['Standard', standard],
                ['Roll No.', rollNumber],
                ['Application No.', applicationNumber],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-end', borderBottom: '1px dashed #cbd5e1', paddingBottom: '4px' }}>
                  <span style={{ width: '130px', fontWeight: 700, color: '#475569', flexShrink: 0 }}>{label}</span>
                  <span style={{ fontWeight: 700, color: '#0f172a', paddingLeft: '12px' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Photo Box */}
            <div style={{
              width: '110px', height: '140px', flexShrink: 0,
              border: photoUrl ? '2px solid #e2e8f0' : '2px dashed #94a3b8',
              borderRadius: '8px', overflow: 'hidden', background: '#f8fafc',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {photoUrl ? (
                <img src={photoUrl} alt="Candidate" crossOrigin="anonymous"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', padding: '8px' }}>
                  <div style={{ fontSize: '36px', color: '#cbd5e1', marginBottom: '6px' }}>👤</div>
                  <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 700 }}>Paste Passport<br />Size Photo Here</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* EXAMINATION DETAILS */}
        <div style={{ position: 'relative', border: '2px solid #dbeafe', borderRadius: '16px', padding: '20px', paddingTop: '28px', marginBottom: '14px' }}>
          <div style={sectionLabel()}>Examination Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
            {[
              ['Exam Date', '24 November 2026', false],
              ['Reporting Time', '09:30 AM', false],
              ['Exam Time', '10:00 AM – 12:00 PM', true],
              ['Venue', 'B. K. Kawale Jr. College of Science Campus', true],
            ].map(([label, value, span]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-end', borderBottom: '1px dashed #cbd5e1', paddingBottom: '4px', gridColumn: span ? 'span 2' : 'span 1' }}>
                <span style={{ width: '130px', fontWeight: 700, color: '#475569', flexShrink: 0 }}>{label}</span>
                <span style={{ fontWeight: 700, color: '#1e3a8a', paddingLeft: '8px' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div style={{ position: 'relative', border: '2px solid #facc15', borderRadius: '16px', padding: '16px', paddingTop: '26px', marginBottom: '14px', background: 'rgba(254,252,232,0.3)' }}>
          <div style={{ position: 'absolute', top: '-14px', left: '20px', background: '#facc15', color: '#1e3a8a', padding: '5px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Important Instructions
          </div>
          <ol style={{ paddingLeft: '18px', margin: 0, fontSize: '12px', color: '#1e293b', fontWeight: 500, lineHeight: '1.7' }}>
            <li>Bring this Hall Ticket along with a valid school ID card to the examination centre.</li>
            <li>Reach the venue at least <strong>30 minutes</strong> before the examination starts.</li>
            <li>Mobile phones, smartwatches, and electronic gadgets are strictly prohibited inside the hall.</li>
            <li>Use only a blue or black ballpoint pen for writing the examination.</li>
            <li>Keep this Hall Ticket safely until the completion of the examination process.</li>
          </ol>
        </div>

        {/* SIGNATURES */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 16px', marginTop: 'auto' }}>
          {["Student's Signature", 'Class Teacher', 'Exam Coordinator'].map((label) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '150px', borderBottom: '1px solid #94a3b8', marginBottom: '6px' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Bottom Banner */}
      <div style={{ background: '#1e3a8a', padding: '8px', textAlign: 'center', flexShrink: 0 }}>
        <p style={{ color: '#facc15', fontSize: '11px', fontWeight: 700, fontStyle: 'italic', letterSpacing: '0.04em', margin: 0 }}>
          "Think. Question. Discover. Become the next Einstein!"
        </p>
      </div>
    </div>
  );
};

export default HallTicketPage;
