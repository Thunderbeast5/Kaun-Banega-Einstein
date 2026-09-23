/**
 * Shared PDF generation utility for KBE Hall Tickets.
 * Used by both AdminTickets (admin side) and HallTickets (school coordinator side).
 * Renders each student's hall ticket off-screen via HallTicketPage,
 * captures with html2canvas, and stitches into a multi-page jsPDF.
 */
import ReactDOM from 'react-dom/client';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import HallTicketPage from '../components/HallTicketPage';

/**
 * Render one HallTicketPage off-screen and return an html2canvas Canvas.
 * @param {{ name, school, grade, division, rollNumber, applicationNumber, photoUrl }} studentData
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function renderTicketCanvas(studentData) {
  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    container.style.cssText =
      'position:fixed;left:-9999px;top:-9999px;z-index:-1;pointer-events:none;';
    document.body.appendChild(container);

    const root = ReactDOM.createRoot(container);
    root.render(<HallTicketPage studentData={studentData} />);

    requestAnimationFrame(async () => {
      // Give Cloudinary photo URLs time to load before capturing.
      // 600 ms is enough for most photos; increase if photos still appear blank.
      await new Promise((r) => setTimeout(r, 600));
      try {
        const el = container.firstElementChild;
        const canvas = await html2canvas(el, {
          scale: 3,               // match HallTicket.jsx (higher = sharper, matches single-ticket quality)
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          // Read the element's actual rendered size (Tailwind w-[210mm] h-[297mm])
          // instead of hardcoded pixels — this is what causes the layout mismatch.
          windowWidth:  el.scrollWidth,
          windowHeight: el.scrollHeight,
        });
        resolve(canvas);
      } catch (err) {
        reject(err);
      } finally {
        root.unmount();
        document.body.removeChild(container);
      }
    });
  });
}

/**
 * Build a multi-page A4 PDF for an array of students.
 * Each student gets one page.
 *
 * @param {Array<object>} students   - Firestore student records
 * @param {string}        schoolName - Fallback school name
 * @param {function}      onProgress - Called with (current, total) after each page
 * @returns {Promise<{ blob: Blob, blobUrl: string }>}
 */
export async function generateSchoolPDF(students, schoolName, onProgress) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pdfW = 210, pdfH = 297;

  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const studentData = {
      name: s.name || '—',
      school: s.schoolName || schoolName,
      grade: s.grade || '',
      division: s.division || '',
      rollNumber: s.rollNumber || s.rollNo || '—',
      applicationNumber: s.applicationNumber || s.id,
      photoUrl: s.photoUrl || null,
    };

    const canvas = await renderTicketCanvas(studentData);
    const imgData = canvas.toDataURL('image/jpeg', 0.85);

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH, undefined, 'FAST');

    onProgress?.(i + 1, students.length);
  }

  const blob = pdf.output('blob');
  const blobUrl = URL.createObjectURL(blob);
  return { blob, blobUrl };
}

/**
 * Trigger a browser file download from a Blob URL.
 * @param {string} blobUrl
 * @param {string} fileName
 */
export function downloadBlob(blobUrl, fileName) {
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = fileName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
