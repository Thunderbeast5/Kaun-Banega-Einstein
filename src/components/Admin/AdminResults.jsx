import React, { useState, useRef } from 'react';
import { FiAward, FiStar, FiDownload, FiTrendingUp, FiUploadCloud, FiLoader, FiAlertCircle, FiCheck } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { collectionGroup, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';

const AdminResults = () => {
  const [stage, setStage] = useState('idle'); // idle | parsing | fetching | ready | publishing | published
  const [topPerformers, setTopPerformers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStage('parsing');
    setErrorMsg('');
    setTopPerformers([]);

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(ws);

      if (!raw.length) throw new Error('File is empty.');

      // Normalize keys to lowercase for finding application number and score
      const rows = raw.map(row => {
        const normalized = {};
        for (const key in row) {
          normalized[key.trim().toLowerCase()] = row[key];
        }
        return normalized;
      });

      // Find the exact column names
      const sampleRow = rows[0];
      const appKey = Object.keys(sampleRow).find(k => k.includes('application') || k.includes('app no') || k === 'id');
      const scoreKey = Object.keys(sampleRow).find(k => k.includes('score') || k.includes('marks'));

      if (!appKey || !scoreKey) {
        throw new Error('Could not find Application Number or Score columns.');
      }

      // Map and sort by score descending
      const mapped = rows
        .map(r => ({
          applicationNumber: String(r[appKey] || '').trim(),
          score: Number(r[scoreKey] || 0)
        }))
        .filter(r => r.applicationNumber)
        .sort((a, b) => b.score - a.score);

      const top6 = mapped.slice(0, 6);
      if (top6.length === 0) throw new Error('No valid rows found.');

      setStage('fetching');

      // Fetch student details from Firestore via collectionGroup
      const appNumbers = top6.map(r => r.applicationNumber);
      const rosterQuery = query(
        collectionGroup(firestore, 'roster'),
        where('applicationNumber', 'in', appNumbers)
      );
      
      const rosterSnap = await getDocs(rosterQuery);
      const studentMap = new Map();
      rosterSnap.forEach(d => {
        studentMap.set(d.data().applicationNumber, d.data());
      });

      // Assemble final array, fetching region from school if needed
      const finalPerformers = [];
      let rank = 1;
      
      for (const t of top6) {
        const student = studentMap.get(t.applicationNumber);
        if (!student) {
          finalPerformers.push({
            rank,
            applicationNumber: t.applicationNumber,
            name: 'Unknown Student',
            school: 'Unknown School',
            region: 'Unknown',
            marks: t.score,
            image: null
          });
        } else {
          // Fetch school to get taluka/region
          let region = 'Unknown';
          if (student.udise) {
            const schoolDoc = await getDoc(doc(firestore, 'schools', student.udise));
            if (schoolDoc.exists()) {
              region = schoolDoc.data().taluka || schoolDoc.data().district || 'Unknown';
            }
          }

          finalPerformers.push({
            rank,
            applicationNumber: t.applicationNumber,
            name: student.name,
            school: student.schoolName || 'Unknown School',
            region,
            marks: t.score,
            image: student.photoUrl || null
          });
        }
        rank++;
      }

      setTopPerformers(finalPerformers);
      setStage('ready');

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to process file.');
      setStage('idle');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const publishResults = async () => {
    if (!topPerformers.length) return;
    setStage('publishing');
    setErrorMsg('');
    try {
      await setDoc(doc(firestore, 'settings', 'topWinners'), {
        winners: topPerformers,
        publishedAt: new Date().toISOString()
      });
      setStage('published');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to publish results. Check Firestore permissions.');
      setStage('ready');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Examination Results</h2>
          <p className="text-slate-600 font-medium">Process final scores and manage the ISRO prize winners.</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-10 flex flex-col items-center justify-center text-center">
        <input 
          type="file" 
          accept=".xlsx, .csv" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
        />
        
        {stage === 'idle' || stage === 'published' ? (
          <>
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <FiUploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Score Sheet</h3>
            <p className="text-slate-500 mb-6 max-w-md">
              Upload an Excel (.xlsx) file with columns for <b>Application Number</b> and <b>Score</b>. 
              The system will automatically find the top 6 students and fetch their profiles.
            </p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-bold shadow-md transition-all"
            >
              Select Excel File
            </button>
            {stage === 'published' && (
              <p className="mt-4 text-green-600 font-bold flex items-center gap-2">
                <FiCheck className="w-5 h-5" /> Results published successfully!
              </p>
            )}
          </>
        ) : stage === 'parsing' || stage === 'fetching' || stage === 'publishing' ? (
          <div className="py-10 flex flex-col items-center">
            <FiLoader className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="font-bold text-slate-900 text-lg">
              {stage === 'parsing' && 'Analyzing spreadsheet...'}
              {stage === 'fetching' && 'Retrieving student profiles from Firestore...'}
              {stage === 'publishing' && 'Publishing results to live website...'}
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Preview Top 6 Winners</h3>
              <div className="flex gap-3">
                <button 
                  onClick={() => setStage('idle')}
                  className="px-5 py-2 text-slate-600 font-bold border border-slate-200 rounded-full hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={publishResults}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full shadow-md flex items-center gap-2"
                >
                  <FiTrendingUp className="w-4 h-4" /> Publish to Website
                </button>
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3 text-left w-full max-w-2xl">
            <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-bold text-sm">{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Main Leaderboard Table Preview */}
      {(stage === 'ready' || stage === 'publishing') && topPerformers.length > 0 && (
        <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-50 overflow-hidden">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
          <div className="relative z-10 p-4 sm:p-8">
            <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                    <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Photo</th>
                    <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Details</th>
                    <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">School & Region</th>
                    <th className="pb-3 pt-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Final Score</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {topPerformers.map((student, i) => (
                    <tr key={i} className={`border-b border-slate-50 transition-colors ${student.rank <= 3 ? 'bg-amber-50/30' : 'hover:bg-slate-50'}`}>
                      <td className="py-4 px-5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${
                          student.rank === 1 ? 'bg-amber-400 text-white shadow-sm' :
                          student.rank === 2 ? 'bg-slate-300 text-slate-700 shadow-sm' :
                          student.rank === 3 ? 'bg-orange-300 text-orange-900 shadow-sm' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {student.rank}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        {student.image ? (
                          <img src={student.image} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-200" />
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{student.applicationNumber}</p>
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-semibold text-slate-700">{student.school}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{student.region}</p>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <span className="font-black text-blue-700 text-lg">{student.marks}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResults;