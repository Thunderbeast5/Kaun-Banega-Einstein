import React, { useState, useRef, useCallback } from 'react';
import {
  FiUploadCloud, FiCheck, FiX, FiAlertCircle,
  FiLoader, FiCheckCircle,
} from 'react-icons/fi';
import { doc, collection, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../lib/firebase';
import { uploadStudentPhoto, generateApplicationNumber } from '../../lib/cloudinary';
import { parseBulkFile } from '../../lib/excel';

// ─── Row validation & normalisation ──────────────────────────────────────────
function processRow(raw, udise, photoMap) {
  const name       = String(raw.name       ?? '').trim();
  const grade      = String(raw.grade      ?? '').trim();
  const division   = String(raw.division   ?? '').toUpperCase().trim();
  const rollNumber = String(raw.rollNumber ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const parentName = String(raw.parentName ?? '').trim();
  const relation   = String(raw.relation   ?? '').toLowerCase().trim();
  const mobile     = String(raw.mobile     ?? '').replace(/\D/g, '');
  const photoFile  = String(raw.photoFile  ?? '').trim();

  const errors = [];
  if (!name)                                  errors.push('Name required');
  if (!['9','10'].includes(grade))            errors.push('Class must be 9 or 10');
  if (!['A','B','C','D','E','F'].includes(division)) errors.push('Division invalid (A–F)');
  if (!rollNumber)                            errors.push('Roll number required');
  if (!parentName)                            errors.push('Parent name required');
  if (!['father','mother','guardian'].includes(relation)) errors.push('Relation: father/mother/guardian');
  if (!/^\d{10}$/.test(mobile))              errors.push('Mobile must be 10 digits');

  const appNumber = rollNumber ? generateApplicationNumber(udise, rollNumber) : null;
  const photoKey  = photoFile.toLowerCase();
  const photoMatched = photoKey ? photoMap.has(photoKey) : false;

  return {
    name, grade, division, rollNumber, parentName, relation, mobile, photoFile,
    _rowNum: raw._rowNum,
    appNumber,
    photoMatched,
    errors,
    isValid: errors.length === 0 && !!appNumber,
  };
}

// ─── Per-row status icon ──────────────────────────────────────────────────────
const StatusIcon = ({ status }) => {
  if (status === 'pending')    return <span className="w-4 h-4 rounded-full border-2 border-slate-300 inline-block flex-shrink-0" />;
  if (status === 'processing') return <FiLoader   className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />;
  if (status === 'registered') return <FiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
  if (status === 'skipped')    return <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full flex-shrink-0">SKIP</span>;
  if (status === 'failed')     return <FiX        className="w-4 h-4 text-red-500 flex-shrink-0" />;
  if (status === 'invalid')    return <FiAlertCircle className="w-4 h-4 text-slate-300 flex-shrink-0" />;
  return null;
};

// ─── Main BulkUpload component ────────────────────────────────────────────────
const BulkUpload = ({ schoolInfo }) => {
  const [stage, setStage]             = useState('idle'); // idle | parsing | previewing | processing | done
  const [rows, setRows]               = useState([]);
  const [photoMap, setPhotoMap]       = useState(new Map());
  const [rowStatuses, setRowStatuses] = useState([]);
  const [progress, setProgress]       = useState({ current: 0, total: 0 });
  const [results, setResults]         = useState({ registered: 0, skipped: 0, failed: 0 });
  const [parseError, setParseError]   = useState('');
  const [isDragOver, setIsDragOver]   = useState(false);
  const fileInputRef                  = useRef(null);

  const validRows    = rows.filter(r => r.isValid);
  const invalidCount = rows.length - validRows.length;

  // ── File ingestion (drop or browse) ────────────────────────────────────────
  const ingestFiles = useCallback(async (files) => {
    const arr        = Array.from(files);
    const excelFile  = arr.find(f => /\.(xlsx|csv)$/i.test(f.name));
    const imageFiles = arr.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f.name));

    if (!excelFile) {
      setParseError('Please include an Excel (.xlsx) or CSV (.csv) file in your selection.');
      return;
    }

    // Build photo lookup map (key = lowercase filename)
    const map = new Map();
    imageFiles.forEach(f => map.set(f.name.toLowerCase(), f));
    setPhotoMap(map);

    setStage('parsing');
    setParseError('');

    try {
      const rawRows   = await parseBulkFile(excelFile);
      const processed = rawRows.map(r => processRow(r, String(schoolInfo.udise), map));
      setRows(processed);
      setStage('previewing');
    } catch (err) {
      setParseError(err.message || 'Could not parse the file.');
      setStage('idle');
    }
  }, [schoolInfo?.udise]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    ingestFiles(e.dataTransfer.files);
  }, [ingestFiles]);

  const handleBrowse = (e) => {
    if (e.target.files?.length) ingestFiles(e.target.files);
    e.target.value = '';
  };

  // ── Bulk processing loop ───────────────────────────────────────────────────
  const handleProcess = async () => {
    const toProcess = rows.filter(r => r.isValid);

    const initial = rows.map(r => ({
      ...r,
      status: r.isValid ? 'pending' : 'invalid',
      reason: r.isValid ? '' : r.errors.join(', '),
    }));
    setRowStatuses(initial);
    setProgress({ current: 0, total: toProcess.length });
    setStage('processing');

    let registered = 0, skipped = 0, failed = 0;

    for (let i = 0; i < toProcess.length; i++) {
      const row     = toProcess[i];
      const rowIdx  = rows.findIndex(r => r._rowNum === row._rowNum);
      const udise   = String(schoolInfo.udise);
      const rosterRef = collection(doc(firestore, 'students', udise), 'roster');
      const docRef    = doc(rosterRef, row.appNumber);

      // Mark as processing
      setRowStatuses(prev => {
        const next = [...prev];
        next[rowIdx] = { ...next[rowIdx], status: 'processing' };
        return next;
      });

      try {
        // ── Duplicate check ──────────────────────────────────────────────────
        const existing = await getDoc(docRef);
        if (existing.exists()) {
          skipped++;
          setRowStatuses(prev => {
            const next = [...prev];
            next[rowIdx] = { ...next[rowIdx], status: 'skipped', reason: 'Already registered' };
            return next;
          });
        } else {
          // ── Photo upload (best-effort) ──────────────────────────────────────
          let photoUrl = null;
          if (row.photoFile && photoMap.has(row.photoFile.toLowerCase())) {
            try {
              photoUrl = await uploadStudentPhoto(
                photoMap.get(row.photoFile.toLowerCase()),
                udise,
                row.appNumber,
              );
            } catch {
              // Photo upload failed — continue without photo, don't fail the row
            }
          }

          // ── Firestore write ─────────────────────────────────────────────────
          await setDoc(docRef, {
            applicationNumber: row.appNumber,
            name:       row.name,
            grade:      row.grade,
            division:   row.division,
            rollNumber: row.rollNumber,
            parentName: row.parentName,
            relation:   row.relation,
            mobile:     row.mobile,
            schoolName: schoolInfo.name,
            udise,
            photoUrl,
            registeredAt: serverTimestamp(),
          });

          registered++;
          setRowStatuses(prev => {
            const next = [...prev];
            next[rowIdx] = { ...next[rowIdx], status: 'registered' };
            return next;
          });
        }
      } catch (err) {
        failed++;
        setRowStatuses(prev => {
          const next = [...prev];
          next[rowIdx] = { ...next[rowIdx], status: 'failed', reason: err.message };
          return next;
        });
      }

      setProgress({ current: i + 1, total: toProcess.length });
    }

    setResults({ registered, skipped, failed });
    setStage('done');
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setStage('idle');
    setRows([]);
    setPhotoMap(new Map());
    setRowStatuses([]);
    setProgress({ current: 0, total: 0 });
    setResults({ registered: 0, skipped: 0, failed: 0 });
    setParseError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Upload zone (idle / parsing states) ───────────────────────────────────
  const uploadZone = (
    <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-400 overflow-hidden h-fit">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-500/40 rounded-full -z-10" />

      <div className="relative z-10 p-8 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-1">Upload Roster</h3>
        <p className="text-blue-900 text-sm font-medium mb-5">
          Select your Excel <span className="font-bold">+</span> all student photos in one go — we'll match them automatically.
        </p>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${
            isDragOver
              ? 'border-blue-700 bg-white/60 scale-[1.01]'
              : 'border-white/60 bg-white/30 hover:bg-white/50'
          }`}
        >
          {stage === 'parsing' ? (
            <>
              <FiLoader className="w-9 h-9 text-blue-700 animate-spin mb-3" />
              <p className="text-sm text-slate-900 font-bold">Parsing Excel…</p>
            </>
          ) : (
            <>
              <FiUploadCloud className="w-9 h-9 text-blue-700 mb-3 group-hover:-translate-y-1 transition-transform" />
              <p className="text-sm text-slate-900 font-bold mb-1 text-center px-2">
                {isDragOver ? 'Release to upload' : 'Drop Excel + Photos Here'}
              </p>
              <p className="text-xs text-blue-900 font-medium text-center px-4">
                .xlsx / .csv &nbsp;+&nbsp; .jpg / .png / .webp
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept=".xlsx,.csv,image/jpeg,image/png,image/webp"
            onChange={handleBrowse}
            disabled={stage === 'parsing'}
          />
        </div>

        {parseError && (
          <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-semibold">{parseError}</p>
          </div>
        )}
      </div>
    </div>
  );

  // ── Full-screen modal (previewing / processing / done) ────────────────────
  const modal = ['previewing', 'processing', 'done'].includes(stage) && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {stage === 'previewing'  && 'Review Before Processing'}
              {stage === 'processing'  && 'Registering Students…'}
              {stage === 'done'        && 'Batch Complete ✅'}
            </h3>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              {stage === 'previewing' && `${rows.length} rows · ${validRows.length} valid · ${invalidCount} with errors · ${photoMap.size} photo${photoMap.size !== 1 ? 's' : ''} uploaded`}
              {stage === 'processing' && `${progress.current} of ${progress.total} processed`}
              {stage === 'done'       && `${results.registered} registered · ${results.skipped} skipped · ${results.failed} failed`}
            </p>
          </div>
          {stage !== 'processing' && (
            <button onClick={handleReset} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {stage === 'processing' && (
          <div className="h-1.5 bg-slate-100 flex-shrink-0">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: progress.total > 0 ? `${(progress.current / progress.total) * 100}%` : '0%' }}
            />
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-8 py-4">

          {/* PREVIEWING TABLE */}
          {stage === 'previewing' && (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-sm text-left border-collapse min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                  <tr>
                    {['Row', 'App No.', 'Student Name', 'Class', 'Photo', 'Validity'].map(h => (
                      <th key={h} className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className={`border-b border-slate-50 transition-colors ${!row.isValid ? 'bg-red-50/50' : 'hover:bg-slate-50/60'}`}>
                      <td className="py-3 px-4 text-slate-400 font-mono text-xs">{row._rowNum}</td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700 text-xs">{row.appNumber ?? '—'}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {row.name || <em className="text-slate-400 font-normal">empty</em>}
                      </td>
                      <td className="py-3 px-4">
                        {row.grade && row.division
                          ? <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">{row.grade}th – {row.division}</span>
                          : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {row.photoFile
                          ? (row.photoMatched
                              ? <span className="flex items-center gap-1 text-green-600 font-semibold"><FiCheck className="w-3 h-3" />{row.photoFile}</span>
                              : <span className="flex items-center gap-1 text-amber-600 font-semibold"><FiAlertCircle className="w-3 h-3" />Not found</span>)
                          : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {row.isValid
                          ? <span className="flex items-center gap-1 text-green-600 font-bold"><FiCheck className="w-3 h-3" />Valid</span>
                          : <span className="text-red-600 font-semibold" title={row.errors.join(', ')}>
                              ❌ {row.errors[0]}{row.errors.length > 1 ? ` +${row.errors.length - 1}` : ''}
                            </span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PROCESSING LIST */}
          {stage === 'processing' && (
            <div className="space-y-1.5">
              {rowStatuses.map((row, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                    row.status === 'processing'  ? 'bg-blue-50 border border-blue-100 shadow-sm' :
                    row.status === 'registered'  ? 'bg-green-50' :
                    row.status === 'skipped'     ? 'bg-amber-50' :
                    row.status === 'failed'      ? 'bg-red-50' :
                    row.status === 'invalid'     ? 'opacity-40' : ''
                  }`}
                >
                  <StatusIcon status={row.status} />
                  <span className="font-mono text-xs text-blue-700 font-bold w-32 flex-shrink-0 truncate">{row.appNumber ?? '—'}</span>
                  <span className="font-bold text-slate-900 flex-1 truncate">{row.name}</span>
                  <span className="text-xs text-slate-500 font-medium text-right flex-shrink-0">
                    {row.status === 'registered' && 'Registered'}
                    {row.status === 'processing' && 'Registering…'}
                    {row.status === 'pending'    && 'Waiting'}
                    {row.status === 'skipped'    && `Skipped — ${row.reason}`}
                    {row.status === 'failed'     && `Failed — ${row.reason}`}
                    {row.status === 'invalid'    && `Skipped — ${row.reason}`}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* DONE SUMMARY */}
          {stage === 'done' && (
            <div className="py-2">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-6 rounded-2xl bg-green-50 border border-green-100">
                  <FiCheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-4xl font-black text-green-700">{results.registered}</p>
                  <p className="text-sm font-bold text-green-600 mt-1">Registered</p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-amber-50 border border-amber-100">
                  <span className="text-4xl block mb-2">⏭</span>
                  <p className="text-4xl font-black text-amber-700">{results.skipped}</p>
                  <p className="text-sm font-bold text-amber-600 mt-1">Skipped (duplicates)</p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-red-50 border border-red-100">
                  <FiX className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-4xl font-black text-red-700">{results.failed}</p>
                  <p className="text-sm font-bold text-red-600 mt-1">Failed</p>
                </div>
              </div>

              {/* Detail rows for non-registered */}
              {rowStatuses.filter(r => ['skipped','failed','invalid'].includes(r.status)).length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Details</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {rowStatuses
                      .filter(r => ['skipped','failed','invalid'].includes(r.status))
                      .map((row, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                          row.status === 'skipped' ? 'bg-amber-50 border border-amber-100' :
                          row.status === 'failed'  ? 'bg-red-50 border border-red-100' :
                                                     'bg-slate-50 border border-slate-100'
                        }`}>
                          <span className="font-mono font-bold text-xs w-32 flex-shrink-0 text-blue-700">{row.appNumber ?? `Row ${row._rowNum}`}</span>
                          <span className="font-bold text-slate-900 flex-1 truncate">{row.name || '—'}</span>
                          <span className="text-xs font-semibold text-slate-500">{row.reason}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 flex-shrink-0 flex items-center justify-between gap-4">
          {stage === 'previewing' && (
            <>
              <button onClick={handleReset} className="px-6 py-3 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <div className="flex items-center gap-4">
                {invalidCount > 0 && (
                  <p className="text-sm text-amber-700 font-semibold">
                    {invalidCount} row{invalidCount > 1 ? 's' : ''} with errors will be skipped
                  </p>
                )}
                <button
                  onClick={handleProcess}
                  disabled={validRows.length === 0}
                  className="px-8 py-3 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  Process {validRows.length} Student{validRows.length !== 1 ? 's' : ''} →
                </button>
              </div>
            </>
          )}

          {stage === 'processing' && (
            <p className="text-sm text-slate-500 font-medium mx-auto animate-pulse">
              Please wait — do not close this window…
            </p>
          )}

          {stage === 'done' && (
            <button
              onClick={handleReset}
              className="w-full py-3.5 rounded-full bg-blue-700 text-white font-bold hover:bg-blue-800 transition-all shadow-md"
            >
              Upload Another Batch
            </button>
          )}
        </div>

      </div>
    </div>
  );

  return (
    <>
      {modal}
      {uploadZone}
    </>
  );
};

export default BulkUpload;
