const XLSX = require('xlsx');

// Sample data with "Application Number" and "Score" columns
// (Adding some extra columns just to show the parser ignores them)
const data = [
  { 'Application Number': 'KBE-2733919-49A', 'Score': 98.5, 'Status': 'Passed' },
  { 'Application Number': 'KBE-2733919-12B', 'Score': 95.0, 'Status': 'Passed' },
  { 'Application Number': 'KBE-2733919-77C', 'Score': 92.5, 'Status': 'Passed' },
  { 'Application Number': 'KBE-2733919-19A', 'Score': 88.0, 'Status': 'Passed' },
  { 'Application Number': 'KBE-2733919-01X', 'Score': 85.5, 'Status': 'Passed' },
  { 'Application Number': 'KBE-2733919-99Z', 'Score': 81.0, 'Status': 'Passed' },
  { 'Application Number': 'KBE-2733919-44F', 'Score': 78.5, 'Status': 'Failed' },
  { 'Application Number': 'KBE-2733919-33D', 'Score': 45.0, 'Status': 'Failed' },
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data);

// Adjust column width
ws['!cols'] = [{ wch: 25 }, { wch: 10 }, { wch: 15 }];

XLSX.utils.book_append_sheet(wb, ws, 'Results');

// Write to the root of the project
XLSX.writeFile(wb, './sample_results.xlsx');
console.log('Successfully created sample_results.xlsx');
