import React, { useEffect, useRef, useState } from 'react';
import './roboflow-upload.css';

const MAX_FILE_BYTES = 12 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function prepareImage(file) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Please select a JPG, PNG, or WebP image.');
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('Choose an image smaller than 12 MB.');
  }
  const objectUrl = URL.createObjectURL(file);
  let source;
  try {
    source = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not read this image.'));
      img.src = objectUrl;
    });
    const originalWidth = source.naturalWidth;
    const originalHeight = source.naturalHeight;
    if (!originalWidth || !originalHeight) throw new Error('The image has invalid dimensions.');
    let scale = Math.min(1, 1440 / Math.max(originalWidth, originalHeight));
    let dataUrl = '';
    let width = 0;
    let height = 0;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      width = Math.max(1, Math.round(originalWidth * scale));
      height = Math.max(1, Math.round(originalHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Image processing is not supported in this browser.');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(source, 0, 0, width, height);
      dataUrl = canvas.toDataURL('image/jpeg', attempt > 1 ? 0.75 : 0.84);
      if (dataUrl.length <= 3_400_000) break;
      scale *= 0.72;
    }
    if (dataUrl.length > 3_400_000) throw new Error('This image is too large even after resizing.');
    return {
      name: file.name,
      dataUrl,
      base64: dataUrl.split(',')[1],
      width,
      height,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function Icon({ name, size = 20 }) {
  const paths = {
    upload: <><path d="M12 16V3m-5 5 5-5 5 5"/><path d="M4 15v5h16v-5"/></>,
    scan: <><path d="M8 3H4a1 1 0 0 0-1 1v4m13-5h4a1 1 0 0 1 1 1v4M3 16v4a1 1 0 0 0 1 1h4m13-5v4a1 1 0 0 1-1 1h-4"/><rect x="8" y="8" width="8" height="8" rx="1"/></>,
    cloud: <path d="M6 19a4 4 0 0 1-.4-8A7 7 0 0 1 19 9a5 5 0 0 1 0 10z"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 10A7 7 0 0 1 18 7l2 5M4 12l2 5a7 7 0 0 0 12.5-3"/></>,
    alert: <><path d="M12 3 2 21h20z"/><path d="M12 9v5m0 4h.01"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="9" r="1.5"/><path d="m21 16-5-5L5 21"/></>,
    close: <path d="M5 5 19 19M19 5 5 19"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.scan}</svg>;
}

export default function RoboflowUpload() {
  const fileInputRef = useRef(null);
  const controllerRef = useRef(null);
  const requestRef = useRef(0);
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [showBoxes, setShowBoxes] = useState(true);
  const [selectedBox, setSelectedBox] = useState(null);

  useEffect(() => () => { controllerRef.current?.abort(); requestRef.current += 1; }, []);

  async function analyze(prepared, sequence) {
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: prepared.base64 }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Detection failed (HTTP ${response.status}).`);
      if (!Array.isArray(data.detections)) throw new Error('Roboflow did not return a list of detections.');
      if (sequence !== requestRef.current) return;
      setResult(data);
    } catch (err) {
      if (err.name === 'AbortError' || sequence !== requestRef.current) return;
      setError(err.message || 'Could not analyze this image.');
    } finally {
      if (sequence === requestRef.current) setBusy(false);
    }
  }

  async function loadFile(file) {
    if (!file) return;
    controllerRef.current?.abort();
    const sequence = ++requestRef.current;
    setBusy(true);
    setError('');
    setResult(null);
    setSelectedBox(null);
    try {
      const prepared = await prepareImage(file);
      if (sequence !== requestRef.current) return;
      setPhoto(prepared);
      setBusy(false);
    } catch (err) {
      if (sequence !== requestRef.current) return;
      setError(err.message || 'Could not process the image.');
      setBusy(false);
    }
  }

  function rerun() {
    if (!photo || busy) return;
    controllerRef.current?.abort();
    const sequence = ++requestRef.current;
    setResult(null);
    setError('');
    setSelectedBox(null);
    setBusy(true);
    analyze(photo, sequence);
  }

  function clear() {
    controllerRef.current?.abort();
    requestRef.current += 1;
    setPhoto(null);
    setResult(null);
    setError('');
    setBusy(false);
    setSelectedBox(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const visible = (result?.detections || [])
    .sort((a, b) => b.confidence - a.confidence);
  const counts = visible.reduce((map, d) => {
    map.set(d.label, (map.get(d.label) || 0) + 1);
    return map;
  }, new Map());
  const modelWidth = result?.imageWidth || photo?.width || 1;
  const modelHeight = result?.imageHeight || photo?.height || 1;

  return <div className="gc-ai-page">
    <div className="gc-page-intro">
      <div>
        <span className="gc-overline">REAL CLOUD INFERENCE</span>
        <h1>AI Cleanup Detection</h1>
        <p>Upload a parking garage photo. GarageGuard sends it to your Roboflow Cloud workflow and highlights the objects your model identifies.</p>
      </div>
      <div className="gc-ai-cloud-pill"><Icon name="cloud" size={17}/><span>ROBOFLOW CLOUD</span></div>
    </div>

    <section className="gc-ai-upload-panel">
      <div className="gc-ai-upload-header"><span><Icon name="upload" size={18}/> IMAGE INPUT</span><span>JPG · PNG · WEBP</span></div>
      <input ref={fileInputRef} className="gc-ai-file-input" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload a garage photo" onChange={e => { const f = e.target.files?.[0]; e.target.value = ''; loadFile(f); }}/>
      <div className={`gc-ai-dropzone ${dragging ? 'is-dragging' : ''}`} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={e => { e.preventDefault(); setDragging(false); }} onDrop={e => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files?.[0]); }}>
        <span className="gc-ai-drop-icon"><Icon name="image" size={27}/></span>
        <div><strong>{photo ? photo.name : 'Drop an image here or choose a file'}</strong><small>{photo ? `${photo.width} × ${photo.height} · ready for analysis` : 'Your image is resized locally before being sent for detection.'}</small></div>
        <div className="gc-ai-upload-actions">
          <button className="gc-ai-choose" type="button" onClick={() => fileInputRef.current?.click()}><Icon name="upload" size={16}/> {photo ? 'Change image' : 'Choose image'}</button>
        </div>
      </div>
      <div className="gc-ai-action-bar">
        <div className="gc-ai-action-note"><Icon name="scan" size={16}/> {busy ? 'Preparing your photo…' : result ? 'Detection complete. Choose another photo or run detection again.' : photo ? 'Photo ready. Click Detect Litter to process it.' : 'Upload a photo, then click Detect Litter.'}</div>
        <div className="gc-ai-action-buttons">
          {photo && <button className="gc-ai-clear" type="button" onClick={clear} disabled={busy}><Icon name="close" size={15}/> Clear</button>}
          <button className="gc-ai-analyze" type="button" disabled={!photo || busy} onClick={rerun}>{busy ? <span className="gc-ai-spinner"/> : <Icon name="scan" size={17}/>} {busy ? 'Detecting…' : 'Detect Litter'}</button>
        </div>
      </div>
    </section>

    {error && <div className="gc-ai-error" role="alert"><Icon name="alert" size={19}/><span>{error}</span><button type="button" onClick={() => setError('')} aria-label="Dismiss error"><Icon name="close" size={16}/></button></div>}

    <div className="gc-ai-results-grid">
      <section className="gc-ai-visual-panel">
        <div className="gc-ai-panel-head"><div><span className="gc-ai-panel-eyebrow">VISUAL ANALYSIS</span><h2>Detection Preview</h2></div><span className={`gc-ai-status ${busy ? 'processing' : result ? 'complete' : ''}`}><span/>{busy ? 'PROCESSING' : result ? 'ANALYSIS COMPLETE' : 'AWAITING IMAGE'}</span></div>
        <div className="gc-ai-visual-area">
          {photo ? <div className="gc-ai-image-stage" style={{aspectRatio: `${photo.width} / ${photo.height}`, width: `min(100%, ${Math.round(620 * photo.width / photo.height)}px)`}}>
            <img src={photo.dataUrl} alt="Uploaded garage photo for object detection"/>
            {showBoxes && visible.map((d, index) => {
              const left = Math.max(0, Math.min(100, (d.x - d.width / 2) / modelWidth * 100));
              const top = Math.max(0, Math.min(100, (d.y - d.height / 2) / modelHeight * 100));
              const right = Math.max(0, Math.min(100, (d.x + d.width / 2) / modelWidth * 100));
              const bottom = Math.max(0, Math.min(100, (d.y + d.height / 2) / modelHeight * 100));
              return <div key={`${d.id}-${index}`} className={`gc-ai-bounding-box ${selectedBox === d.id ? 'is-highlighted' : ''}`} style={{left: `${left}%`, top: `${top}%`, width: `${Math.max(0, right - left)}%`, height: `${Math.max(0, bottom - top)}%`}}><span>{d.label} {Math.round(d.confidence * 100)}%</span></div>;
            })}
            {busy && <div className="gc-ai-processing"><span className="gc-ai-scanner"/><div><span className="gc-ai-spinner"/> SCANNING IMAGE</div></div>}
          </div> : <div className="gc-ai-empty-visual"><div><Icon name="scan" size={47}/><h3>Your image will appear here</h3><p>Detected objects will be outlined with bounding boxes.</p></div></div>}
        </div>
        <div className="gc-ai-preview-footer"><span>{photo ? `${photo.width} × ${photo.height} px` : 'NO IMAGE SELECTED'}</span><label className="gc-ai-show-boxes"><input type="checkbox" checked={showBoxes} onChange={e => setShowBoxes(e.target.checked)}/> Show bounding boxes</label></div>
      </section>

      <section className="gc-ai-insights-panel">
        <div className="gc-ai-panel-head"><div><span className="gc-ai-panel-eyebrow">MODEL OUTPUT</span><h2>Detection Results</h2></div><Icon name="scan" size={23}/></div>
        <div className="gc-ai-summary"><span>OBJECTS DETECTED</span><strong>{result ? visible.length.toString().padStart(2, '0') : '—'}</strong><small>{result ? `${counts.size} ${counts.size === 1 ? 'class' : 'classes'} identified` : 'Waiting for analysis'}</small></div>
        <div className="gc-ai-detection-list" aria-live="polite">
          {visible.map((d, index) => <button type="button" key={`${d.id}-${index}`} className={`gc-ai-detection-item ${selectedBox === d.id ? 'is-active' : ''}`} onMouseEnter={() => setSelectedBox(d.id)} onMouseLeave={() => setSelectedBox(null)} onFocus={() => setSelectedBox(d.id)} onBlur={() => setSelectedBox(null)}><span className="gc-ai-item-number">{String(index + 1).padStart(2, '0')}</span><span className="gc-ai-item-text"><b>{d.label}</b><small>Object detection</small></span><span className="gc-ai-item-confidence">{Math.round(d.confidence * 100)}%</span></button>)}
          {result && !visible.length && <div className="gc-ai-no-results"><Icon name="check" size={30}/><b>No objects detected</b><p>Try another photo. Results depend on the classes your model recognizes.</p></div>}
          {!result && <div className="gc-ai-waiting"><Icon name={busy ? 'refresh' : 'image'} size={26}/><p>{busy ? 'Roboflow is processing the image…' : photo ? 'Click Detect Litter to see predictions.' : 'Upload a photo to see real model predictions.'}</p></div>}
        </div>
        <div className="gc-ai-insights-foot"><Icon name="cloud" size={16}/><span>Results come from your configured Roboflow workflow, not the sample dashboard data. Detected classes depend on how your model was trained.</span></div>
      </section>
    </div>
  </div>;
}
