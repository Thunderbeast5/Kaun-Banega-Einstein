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
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
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
