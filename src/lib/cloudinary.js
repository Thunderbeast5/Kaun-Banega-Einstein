/**
 * Cloudinary upload utility
 * Cloud:  vmolujqx
 * Preset: kbe2026  (unsigned)
 *
 * Image hierarchy mirrors Firestore:
 *   public_id → kbe2026/{udise}/{applicationNumber}
 *
 * @param {File}   file            - The image File object
 * @param {string} udise           - School UDISE code
 * @param {string} applicationNumber - Generated KBE application number
 * @returns {Promise<string>}      - Secure Cloudinary URL
 */
export async function uploadStudentPhoto(file, udise, applicationNumber) {
  const CLOUD_NAME = 'vmolujqx';
  const UPLOAD_PRESET = 'kbe2026';
  const PUBLIC_ID = `kbe2026/${udise}/${applicationNumber}`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('public_id', PUBLIC_ID);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Cloudinary upload failed.');
  }

  const data = await res.json();
  return data.secure_url;
}

/**
 * Upload a hall-ticket PDF blob to Cloudinary as a raw file.
 * Stored at: kbe2026/halltickets/{udise}/halltickets_{udise}
 *
 * Unsigned uploads only allow: upload_preset, public_id, tags, context, etc.
 * access_mode / overwrite / invalidate / folder (when public_id has a path) → all 400.
 *
 * Public access = set Delivery Type to "Upload" in Cloudinary Dashboard:
 *   Settings → Upload → Upload Presets → kbe2026 → Delivery Type: Upload
 *
 * @param {Blob}   pdfBlob  - The generated PDF blob
 * @param {string} udise    - School UDISE code
 * @returns {Promise<{ viewUrl: string, downloadUrl: string }>}
 *   viewUrl     — plain HTTPS URL (for Google Docs viewer / preview)
 *   downloadUrl — fl_attachment URL (forces browser file-download, no viewer extension)
 */
export async function uploadHallTicketPDF(pdfBlob, udise) {
  const CLOUD_NAME = 'vmolujqx';
  const UPLOAD_PRESET = 'kbe2026';

  // public_id already contains the full path.
  // NEVER set `folder` alongside this — Cloudinary prepends folder to public_id,
  // doubling the path: .../27200405804/kbe2026/halltickets/27200405804/...
  const PUBLIC_ID = `kbe2026/halltickets/${udise}/halltickets_${udise}`;

  const formData = new FormData();
  formData.append('file', pdfBlob, `halltickets_${udise}.pdf`);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('public_id', PUBLIC_ID);
  // ↑ That is all. No folder, no access_mode, no overwrite, no invalidate.

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Cloudinary PDF upload failed.');
  }

  const data = await res.json();

  // Plain URL — used by Google Docs viewer for preview.
  const viewUrl = data.secure_url;
  console.log('[HallTicket] Uploaded PDF →', viewUrl);

  // fl_attachment is a Cloudinary URL transformation (NOT an upload param).
  // It tells browsers to download the file instead of opening it inline,
  // which bypasses Chrome's PDF viewer extension (which was 401-ing).
  const fileName = `halltickets_${udise}`;
  const downloadUrl = viewUrl.replace('/upload/', `/upload/fl_attachment:${fileName}/`);

  return { viewUrl, downloadUrl };
}

/**
 * Derive application number from school UDISE and student roll number.
 *
 * Format: KBE + last5ofUDISE(zero-padded) + rollNumber(uppercase, alphanumeric)
 * Example: UDISE=27270100101, roll=30A  →  KBE0010130A
 *
 * @param {string} udise
 * @param {string} rollNumber
 * @returns {string}
 */
export function generateApplicationNumber(udise, rollNumber) {
  const last5 = String(udise).slice(-5).padStart(5, '0');
  const cleanRoll = String(rollNumber).toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `KBE${last5}${cleanRoll}`;
}
