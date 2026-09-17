/**
 * Excel utilities for KBE bulk student upload.
 * Uses SheetJS (xlsx) for both template generation and file parsing.
 */
import * as XLSX from 'xlsx';

// Column definitions — order matches template columns
export const BULK_COLUMNS = [
  { header: 'Student Full Name',    field: 'name',       example: 'Aarav Sharma',  note: 'Required — Full name of the student' },
  { header: 'Date of Birth',        field: 'dob',        example: '2008-05-15',    note: 'Required — YYYY-MM-DD' },
  { header: 'Class',                field: 'grade',      example: '10',            note: 'Required — Enter 9 or 10 only' },
  { header: 'Division',             field: 'division',   example: 'A',             note: 'Required — A, B, C, D, E or F' },
  { header: 'Roll Number',          field: 'rollNumber', example: '30A',           note: 'Required — Alphanumeric, e.g. 30 or 30A' },
  { header: 'Parent/Guardian Name', field: 'parentName', example: 'Rajesh Sharma', note: 'Required — Full name of parent or guardian' },
  { header: 'Relation',             field: 'relation',   example: 'father',        note: 'Required — father, mother or guardian' },
  { header: 'Mobile',               field: 'mobile',     example: '9876543210',    note: 'Required — 10-digit number without +91' },
  { header: 'Photo Filename',       field: 'photoFile',  example: 'aarav.jpg',     note: 'Optional — Exact filename of the student\'s photo' },
];

/**
 * Generates and triggers download of the official KBE bulk upload template.
 * Row 1: Column headers
 * Row 2: Hint/note per column (will be auto-skipped on upload)
 * Row 3: Sample data row
 */
export function downloadBulkTemplate() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    BULK_COLUMNS.map(c => c.header),   // Row 1 — Headers
    BULK_COLUMNS.map(c => c.note),     // Row 2 — Notes (auto-skipped on parse)
    BULK_COLUMNS.map(c => c.example),  // Row 3 — Sample row
  ]);

  // Set column widths
  ws['!cols'] = BULK_COLUMNS.map(() => ({ wch: 30 }));

  XLSX.utils.book_append_sheet(wb, ws, 'Students');
  XLSX.writeFile(wb, 'KBE_Bulk_Upload_Template.xlsx');
}

/**
 * Parses an uploaded .xlsx or .csv file into an array of raw row objects.
 * Automatically skips the hint/notes row if present.
 *
 * @param {File} file
 * @returns {Promise<Array<{name, grade, division, rollNumber, parentName, relation, mobile, photoFile, _rowNum}>>}
 */
export async function parseBulkFile(file) {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

  if (!raw.length) throw new Error('The file appears to be empty.');

  // Map header row to field names (case-insensitive)
  const headerRow = raw[0].map(h => String(h).trim());
  const colMap = {};
  BULK_COLUMNS.forEach(({ header, field }) => {
    const idx = headerRow.findIndex(h => h.toLowerCase() === header.toLowerCase());
    if (idx !== -1) colMap[field] = idx;
  });

  // Check all required columns are present
  const required = ['name', 'dob', 'grade', 'division', 'rollNumber', 'parentName', 'relation', 'mobile'];
  const missing = required
    .filter(f => colMap[f] === undefined)
    .map(f => BULK_COLUMNS.find(c => c.field === f)?.header);
  if (missing.length) {
    throw new Error(`Missing required columns: ${missing.join(', ')}`);
  }

  // Skip header row + notes row if second row starts with "Required" or "Optional"
  let dataStart = 1;
  if (raw.length > 1) {
    const secondCell = String(raw[1]?.[0] ?? '').toLowerCase();
    if (
      secondCell.includes('required') ||
      secondCell.includes('optional') ||
      secondCell.includes('full name') ||
      secondCell.startsWith('required')
    ) {
      dataStart = 2;
    }
  }

  return raw
    .slice(dataStart)
    .filter(row => row.some(cell => String(cell).trim() !== '')) // skip blank rows
    .map((row, i) => {
      const r = {};
      Object.entries(colMap).forEach(([field, ci]) => {
        r[field] = String(row[ci] ?? '').trim();
      });
      r._rowNum = dataStart + i + 2; // 1-indexed Excel row number
      return r;
    });
}
