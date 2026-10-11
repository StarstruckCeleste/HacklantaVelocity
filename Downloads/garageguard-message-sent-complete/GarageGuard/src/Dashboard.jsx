import React, { useEffect, useMemo, useState } from 'react';
import './dashboard.css';
import RoboflowUpload from './RoboflowUpload.jsx';

const initialDetections = [
  { id: 'D-101', time: '9:40 PM', camera: '3B', floor: 3, zone: 'B', type: 'Plastic Bag', confidence: 92, priority: 'High', status: 'Pending', x: 46, y: 24, image: 'bag' },
  { id: 'D-102', time: '9:38 PM', camera: '2A', floor: 2, zone: 'A', type: 'Paper Cup', confidence: 87, priority: 'Medium', status: 'Assigned', x: 24, y: 33, image: 'cup' },
  { id: 'D-103', time: '9:35 PM', camera: '3E', floor: 3, zone: 'E', type: 'Food Wrapper', confidence: 85, priority: 'Medium', status: 'Pending', x: 42, y: 63, image: 'wrapper' },
  { id: 'D-104', time: '9:33 PM', camera: '1C', floor: 1, zone: 'C', type: 'Cardboard Box', confidence: 78, priority: 'Low', status: 'Completed', x: 82, y: 27, image: 'cardboard' },
  { id: 'D-105', time: '9:30 PM', camera: '3B', floor: 3, zone: 'B', type: 'Plastic Bottle', confidence: 90, priority: 'Medium', status: 'Assigned', x: 59, y: 28, image: 'bottle' },
  { id: 'D-106', time: '9:27 PM', camera: '3A', floor: 3, zone: 'A', type: 'Oil Spill', confidence: 96, priority: 'High', status: 'Pending', x: 24, y: 36, image: 'wrapper' },
  { id: 'D-107', time: '9:22 PM', camera: '3F', floor: 3, zone: 'F', type: 'Paper Cup', confidence: 84, priority: 'Medium', status: 'Pending', x: 71, y: 64, image: 'cup' },
  { id: 'D-108', time: '9:18 PM', camera: '3D', floor: 3, zone: 'D', type: 'Food Wrapper', confidence: 81, priority: 'Low', status: 'Completed', x: 32, y: 72, image: 'wrapper' },
  { id: 'D-109', time: '9:10 PM', camera: '2D', floor: 2, zone: 'D', type: 'Plastic Bag', confidence: 94, priority: 'High', status: 'Assigned', x: 31, y: 68, image: 'bag' },
  { id: 'D-110', time: '8:58 PM', camera: '4C', floor: 4, zone: 'C', type: 'Paper Cup', confidence: 82, priority: 'Medium', status: 'Completed', x: 79, y: 26, image: 'cup' },
  { id: 'D-111', time: '8:45 PM', camera: '1F', floor: 1, zone: 'F', type: 'Plastic Bottle', confidence: 88, priority: 'Low', status: 'Completed', x: 72, y: 72, image: 'bottle' },
  { id: 'D-112', time: '8:32 PM', camera: '4A', floor: 4, zone: 'A', type: 'Cardboard Box', confidence: 75, priority: 'Low', status: 'Completed', x: 24, y: 35, image: 'cardboard' },
  // Historical demo detections: same floor + zone + item type means a recurring hotspot.
  { id: 'D-113', time: '8:20 PM', camera: '3B', floor: 3, zone: 'B', type: 'Plastic Bag', confidence: 91, priority: 'High', status: 'Completed', x: 46, y: 24, image: 'bag' },
  { id: 'D-114', time: '7:15 PM', camera: '3B', floor: 3, zone: 'B', type: 'Plastic Bag', confidence: 88, priority: 'High', status: 'Completed', x: 46, y: 24, image: 'bag' },
  { id: 'D-115', time: '8:05 PM', camera: '3E', floor: 3, zone: 'E', type: 'Food Wrapper', confidence: 89, priority: 'Medium', status: 'Completed', x: 42, y: 63, image: 'wrapper' },
  { id: 'D-116', time: '7:38 PM', camera: '3E', floor: 3, zone: 'E', type: 'Food Wrapper', confidence: 86, priority: 'Medium', status: 'Completed', x: 42, y: 63, image: 'wrapper' },
  { id: 'D-117', time: '8:10 PM', camera: '2A', floor: 2, zone: 'A', type: 'Paper Cup', confidence: 85, priority: 'Medium', status: 'Completed', x: 24, y: 33, image: 'cup' },
  { id: 'D-118', time: '7:35 PM', camera: '2A', floor: 2, zone: 'A', type: 'Paper Cup', confidence: 82, priority: 'Medium', status: 'Completed', x: 24, y: 33, image: 'cup' },
  { id: 'D-119', time: '8:10 PM', camera: '3A', floor: 3, zone: 'A', type: 'Oil Spill', confidence: 94, priority: 'High', status: 'Completed', x: 24, y: 36, image: 'wrapper' },
  { id: 'D-120', time: '7:35 PM', camera: '3A', floor: 3, zone: 'A', type: 'Oil Spill', confidence: 94, priority: 'High', status: 'Completed', x: 24, y: 36, image: 'wrapper' },
];
const initialTasks = [
  { id: 'T-001', detectionId: 'D-101', title: 'Pickup plastic bag', status: 'Pending', created: '9:40 PM' },
  { id: 'T-002', detectionId: 'D-103', title: 'Remove food wrapper', status: 'Pending', created: '9:35 PM' },
  { id: 'T-003', detectionId: 'D-102', title: 'Collect paper cup', status: 'Assigned', created: '9:38 PM' },
  { id: 'T-004', detectionId: 'D-104', title: 'Remove cardboard box', status: 'Completed', created: '9:33 PM' },
];
const navItems = [
  { name: 'Dashboard', icon: 'home' }, { name: 'AI Detection', icon: 'scan' }, { name: 'Repeated Incidents', icon: 'repeat' },
  { name: 'Floor Map', icon: 'map' }, { name: 'Tasks', icon: 'clipboard' },
  { name: 'Analytics', icon: 'bars' }, { name: 'Settings', icon: 'settings' },
];
const asset = (name) => `/demo-assets/${name}.jpg`;
const statusOptions = ['Pending', 'Assigned', 'In Progress', 'Completed'];

// A repeated hotspot is a new sighting of the same type of debris on the same floor
// and zone. Individual sightings remain in the log; a repeat isn't automatically
// treated as the exact same physical object or an unsolved cleanup task.
const incidentKey = d => `${d.floor}|${d.zone}|${d.type.trim().toLowerCase()}`;
function incidentGroups(detections) {
  const groups = new Map();
  detections.forEach(d => {
    const key = incidentKey(d);
    if (!groups.has(key)) groups.set(key, { key, floor: d.floor, zone: d.zone, type: d.type, items: [] });
    groups.get(key).items.push(d);
  });
  return [...groups.values()]
    .filter(g => g.items.length > 1)
    .map(g => ({ ...g, count: g.items.length, latest: g.items[0], active: g.items.filter(d => d.status !== 'Completed').length }))
    .sort((a,b) => b.count - a.count || b.active - a.active || a.floor - b.floor);
}


function Icon({ name, size = 21, ...props }) {
  const paths = {
    scan: <><path d="M8 3H4a1 1 0 0 0-1 1v4m13-5h4a1 1 0 0 1 1 1v4M3 16v4a1 1 0 0 0 1 1h4m13-5v4a1 1 0 0 1-1 1h-4"/><rect x="8" y="8" width="8" height="8" rx="1"/></>,
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9M9 21v-7h6v7"/></>,
    video: <><rect x="2" y="5" width="14" height="14" rx="2"/><path d="m16 10 6-4v12l-6-4"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15m6-12v15"/></>,
    clipboard: <><rect x="4" y="4" width="16" height="18" rx="2"/><rect x="8" y="2" width="8" height="5" rx="1"/><path d="M8 12h8m-8 4h6"/></>,
    bars: <><path d="M4 20v-6m5 6V8m5 12v-9m5 9V4" strokeWidth="3.2" strokeLinecap="round"/></>,
    settings: <><path d="M10 3h4l.5 2.1 2 .9 2-.9 2.8 2.8-1 2 1 2-.9 2 1 2-2.8 2.8-2-.9-2 .9L14 21h-4l-.5-2.1-2-.9-2 .9-2.8-2.8 1-2-1-2 .9-2-1-2L5.5 5l2 .9 2-.9z"/><circle cx="12" cy="12" r="3"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v7m4-7v7"/></>,
    check: <path d="m4 12 5 5L20 6"/>,
    warning: <><path d="M12 3 2 21h20z"/><path d="M12 9v5m0 4h.01"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
    layers: <><path d="m12 3 10 5-10 5L2 8zM2 12l10 5 10-5M2 16l10 5 10-5"/></>,
    arrow: <path d="M3 12h17m-6-6 6 6-6 6"/>,
    left: <path d="m15 5-7 7 7 7"/>, right: <path d="m9 5 7 7-7 7"/>,
    filter: <><path d="M3 5h18M6 12h12m-9 7h6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>,
    close: <path d="M5 5 19 19M19 5 5 19"/>,
    plus: <path d="M12 4v16M4 12h16"/>,
    refresh: <><path d="M21 5v5h-5M3 19v-5h5"/><path d="M20 10a8 8 0 0 0-14-4L3 9m1 5a8 8 0 0 0 14 4l3-3"/></>,
    repeat: <><path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></>,
    car: <><path d="m4 14 2-8h12l2 8M3 14h18v6H3zM6 20v2m12-2v2M7 17h2m6 0h2"/></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 8-3 8-3 10h18c0-2-3-2-3-10M10 21h4"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/></>,
    download: <><path d="M12 3v13m-4-4 4 4 4-4M4 19v2h16v-2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] ?? paths.info}</svg>;
}

function Label({ priority, status }) {
  const value = priority || status;
  return <span className={`gc-badge ${priority ? `priority-${value.toLowerCase()}` : `status-${value.toLowerCase().replace(/ /g, '-')}`}`}>{value}</span>;
}
function Photo({ name, ...props }) { return <img loading="lazy" src={asset(name)} alt={`${name} sample`} {...props} />; }
function SectionTitle({ name, icon, action, children }) {
  return <div className="gc-section-heading"><div className="gc-section-name"><span className={`gc-section-icon tone-${icon}`}><Icon name={icon} size={23} /></span><h2>{name}</h2></div>{action && <div>{action}</div>}{children}</div>;
}

function FloorPlan({ floor, detections, selectedId, onSelect, all = false }) {
  const visible = detections.filter(d => d.floor === floor);
  const clustered = [...visible.reduce((map,d) => {
    const key = incidentKey(d);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(d);
    return map;
  },new Map()).values()];
  return <div className={`gc-plan-wrap ${all ? 'gc-plan-expanded' : ''}`}>
    <svg className="gc-plan" viewBox="0 0 980 390" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Interactive floor ${floor} garage blueprint with ${visible.length} detections`}>
      <defs>
        <pattern id="concrete" width="70" height="70" patternUnits="userSpaceOnUse"><rect width="70" height="70" fill="#adb2b6"/><path d="M0 0h70v70" fill="none" stroke="#717b83" strokeWidth="1" opacity=".13"/><circle cx="13" cy="22" r="1" fill="#69727b" opacity=".2"/><circle cx="62" cy="45" r="1" fill="#d6dadb" opacity=".4"/></pattern>
        <pattern id="parking" width="39" height="48" patternUnits="userSpaceOnUse"><path d="M0 0v48" stroke="#e8edf0" strokeWidth="2" opacity=".85" /></pattern>
        <linearGradient id="blueprint" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#c4c7cb"/><stop offset="1" stopColor="#858c92"/></linearGradient>
        <filter id="blurDot"><feGaussianBlur stdDeviation="10"/></filter>
        <filter id="grain"><feTurbulence baseFrequency=".35" numOctaves="2" seed="9" stitchTiles="stitch" type="fractalNoise"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".09"/></feComponentTransfer></filter>
      </defs>
      <rect x="2" y="2" width="976" height="386" rx="6" fill="url(#blueprint)" stroke="#3e464b" strokeWidth="5"/>
      <rect x="18" y="18" width="944" height="354" fill="url(#concrete)" opacity=".73"/>
      <path d="M18 16H963 M18 372H963" stroke="#42494d" strokeWidth="7"/>
      <path d="M38 40 H938 M38 351 H938" stroke="#5b6267" strokeWidth="2"/>
      <rect x="132" y="74" width="696" height="92" fill="url(#parking)" opacity=".9"/>
      <rect x="132" y="234" width="696" height="90" fill="url(#parking)" opacity=".9"/>
      <g stroke="#e6ecee" strokeWidth="2" opacity=".9"><path d="M132 74h696 M132 166h696 M132 234h696 M132 324h696"/><path d="M121 180H861" strokeDasharray="22 30" opacity=".8"/><path d="M120 220H861" strokeDasharray="22 30" opacity=".8"/></g>
      <g fill="#92989e" stroke="#313b41" strokeWidth="4">
        <path d="M18 18h108v62H88v34H18z"/><path d="M18 288h92v84H18z"/><path d="M850 18h112v92h-50V75h-62z"/><path d="M886 265h76v107h-105v-33h29z"/><path d="M441 18h92v58h-92z"/><path d="M439 315h94v57h-94z"/>
      </g>
      <g stroke="#596168" strokeWidth="2" fill="none" opacity=".85"><path d="M45 22v55m8-55v55m8-55v55M30 303h56m-56 9h56m-56 9h56M922 27v63m8-63v63m8-63v63M908 300h45m-45 9h45m-45 9h45"/></g>
      <g fill="#636b72" opacity=".72"><rect x="190" y="179" width="27" height="40"/><rect x="391" y="179" width="28" height="40"/><rect x="598" y="179" width="28" height="40"/><rect x="779" y="179" width="29" height="40"/></g>
      <path d="M43 208h83m730 0h83" stroke="#eef2f3" strokeWidth="3" strokeDasharray="8 8" opacity=".7"/>
      <rect x="2" y="2" width="976" height="386" rx="6" filter="url(#grain)" opacity=".25"/>
      {['A', 'B', 'C', 'D', 'E', 'F'].map((zone, i) => {
        const cx = [213, 490, 768, 213, 490, 768][i]; const y = i < 3 ? 54 : 343;
        return <g key={zone}><rect x={cx - 40} y={y - 15} width="80" height="30" rx="5" fill="#2D0000" opacity=".96"/><text x={cx} y={y + 5} fontSize="15" fill="#fff" textAnchor="middle" fontFamily="Arial">Zone {zone}</text></g>;
      })}
      {clustered.map(group => { const d = group[0]; const x = d.x * 9.8; const y = d.y * 3.9; const active = group.some(item => item.status !== 'Completed'); const focused = group.some(item => item.id === selectedId); const color = !active ? '#2D0000' : d.priority === 'High' ? '#6D0808' : d.priority === 'Medium' ? '#757D6F' : '#EEEAD7';
        return <g key={incidentKey(d)} role="button" tabIndex="0" aria-label={`${group.length} ${d.type} detections at zone ${d.zone}, ${d.priority} priority`} onClick={() => onSelect(d.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(d.id); } }} className="gc-map-hotspot" style={{ cursor: 'pointer' }}>
          <circle cx={x} cy={y} r={focused ? 38 : 29} fill={color} opacity=".22" filter="url(#blurDot)"/>
          {focused && <circle cx={x} cy={y} r="18" fill="none" stroke={color} strokeWidth="2" strokeDasharray="3 5" className="gc-map-ring"/>}
          <circle cx={x} cy={y} r={focused ? 12 : 10} fill={color} stroke="#2D0000" strokeWidth="2"/>
          {group.length > 1 && <g><rect x={x + 8} y={y - 30} width="26" height="20" rx="9" fill="#2D0000" stroke="#fff" strokeWidth="1"/><text x={x + 21} y={y - 16} fontFamily="Arial" fontSize="12" textAnchor="middle" fill="#fff">×{group.length}</text></g>}
          <circle cx={x} cy={y} r="20" fill="transparent"/>
          <title>{`${d.type}: floor ${floor}, zone ${d.zone}, ${group.length} sightings`}</title>
        </g>;
      })}
    </svg>
    <div className="gc-plan-corner">F{String(floor).padStart(2,'0')} / GARAGE LEVEL PLAN <span>•</span> CLICK A MARKER</div>
  </div>;
}
function FloorPicker({ floor, setFloor }) {
  return <div className="gc-floor-picker" role="group" aria-label="Garage floor">{[1,2,3,4].map(f => <button key={f} className={floor === f ? 'active' : ''} onClick={() => setFloor(f)} aria-pressed={floor === f}>Floor {f}</button>)}</div>;
}
function MapLegend() { return <div className="gc-legend">{[['High priority','high'],['Medium priority','medium'],['Low priority','low'],['Resolved','resolved']].map(([label,color]) => <span key={label}><i className={`gc-legend-dot ${color}`}/>{label}</span>)}</div>; }
function Metric({ icon, count, label, note, color }) { return <article className="gc-metric"><div className={`gc-metric-icon color-${color}`}><Icon name={icon} size={32}/></div><div className="gc-metric-body"><strong>{count}</strong><span>{label}</span><small className={color === 'red' ? 'red-text' : color === 'amber' ? 'amber-text' : 'navy-text'}>{note}</small></div></article>; }

function exportCSV(detections) {
  const escape = v => `"${String(v).replaceAll('"', '""')}"`;
  const counts = new Map(); detections.forEach(d => counts.set(incidentKey(d),(counts.get(incidentKey(d))||0)+1));
  const rows = [['ID','Time','Camera','Floor','Zone','Type','Confidence','Repeat Count','Priority','Status'], ...detections.map(d => [d.id,d.time,d.camera,d.floor,d.zone,d.type,`${d.confidence}%`,counts.get(incidentKey(d)),d.priority,d.status])];
  const blob = new Blob([rows.map(row => row.map(escape).join(',')).join('\r\n')], {type:'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'garageguard-detections-demo.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Dashboard() {
  const [page, setPage] = useState('Dashboard');
  const [floor, setFloor] = useState(3);
  const [detections, setDetections] = useState(initialDetections);
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedId, setSelectedId] = useState('D-101');
  const [cameraId, setCameraId] = useState('3B');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [taskFilter, setTaskFilter] = useState('All');
  const [repeatFilter, setRepeatFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [notice, setNotice] = useState('');
  const [settings, setSettings] = useState({ alerts: true, autoTasks: false, sound: false });
  const [now, setNow] = useState(new Date());
  const selected = detections.find(d => d.id === selectedId) || detections[0];
  const repeatedGroups = useMemo(() => incidentGroups(detections), [detections]);
  const repeatedCount = repeatedGroups.reduce((total,g) => total + g.count - 1, 0);
  const selectedRepeat = repeatedGroups.find(g => g.key === incidentKey(selected));
  const notify = message => {
    if (settings.alerts) setNotice(message);
    if (settings.sound) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const context = new AudioContext();
          const oscillator = context.createOscillator(); const gain = context.createGain();
          oscillator.connect(gain); gain.connect(context.destination);
          oscillator.type = 'sine'; oscillator.frequency.value = 660;
          gain.gain.setValueAtTime(.04, context.currentTime);
          gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .12);
          oscillator.start(); oscillator.stop(context.currentTime + .13);
          oscillator.onended = () => context.close();
        }
      } catch { /* audio is optional and browser permission-dependent */ }
    }
  };
  const simulateRepeat = (base = selected) => {
    // Demo-only new sighting. Keep the old record in history, updating hotspot counts.
    const nextNumber = Math.max(...detections.map(d => Number(d.id.replace('D-', '')) || 0)) + 1;
    const next = {...base, id:`D-${nextNumber}`, time:new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}), status:'Pending', confidence:Math.min(99,base.confidence + 1)};
    setDetections(prev => [next,...prev]);
    if (settings.autoTasks) setTasks(prev => [{id:`T-${Date.now()}`, detectionId:next.id,title:`Clean ${next.type.toLowerCase()}`,status:'Pending',created:next.time},...prev]);
    setFloor(next.floor);setSelectedId(next.id);setCameraId(next.camera);
    notify(`Repeat sighting logged: Floor ${next.floor}, Zone ${next.zone} · ${next.type}.`);
  };
  const simulateDetection = () => {
    const next = Math.max(...detections.map(d => Number(d.id.replace('D-', '')) || 0)) + 1;
    const floorNum = [3, 2, 4, 1][next % 4];
    const zone = ['A', 'B', 'C', 'D', 'E', 'F'][next % 6];
    const positions = {A:[22,31],B:[47,24],C:[78,32],D:[26,70],E:[51,65],F:[77,70]};
    const [x,y] = positions[zone];
    const newDetection = {id:`D-${next}`,time:new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}),camera:`${floorNum}${zone}`,floor:floorNum,zone,type:'Liquid Spill',confidence:95,priority:'High',status:'Pending',x,y,image:'wrapper'};
    setDetections(prev => [newDetection,...prev]);
    if (settings.autoTasks) setTasks(prev => [{id:`T-${String(Date.now()).slice(-6)}`,detectionId:newDetection.id,title:'Clean liquid spill',status:'Pending',created:newDetection.time},...prev]);
    setFloor(floorNum); setSelectedId(newDetection.id); setCameraId(newDetection.camera);
    notify(`New sample spill detected: Floor ${floorNum}, Zone ${zone}.`);
  };
  const openTasks = tasks.filter(t => t.status !== 'Completed').length;
  const highPriority = detections.filter(d => d.priority === 'High' && d.status !== 'Completed').length;
  const completed = 7 + tasks.filter(t => t.status === 'Completed').length;

  useEffect(() => { const timer = setInterval(() => setNow(new Date()),60000); return () => clearInterval(timer); },[]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''),4200); return () => clearTimeout(timer); },[notice]);
  useEffect(() => { const prev = document.body.style.background; document.body.style.background = '#F7F6ED'; return () => { document.body.style.background = prev; }; },[]);

  const chooseDetection = (id, navigate = false) => {
    const d = detections.find(x => x.id === id); if (!d) return;
    setSelectedId(id); setFloor(d.floor); setCameraId(d.camera);
    if (navigate) setPage('Dashboard');
  };
  const createTask = (id) => {
    const d = detections.find(x => x.id === id); if (!d) return;
    const existing = tasks.find(t => t.detectionId === id);
    if (existing) { setPage('Tasks'); notify('Task already exists. Opened the task queue.'); return; }
    const task = {id:`T-${String(Date.now()).slice(-6)}`, detectionId:id, title:`Clean ${d.type.toLowerCase()}`, status:'Pending',created:new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})};
    setTasks(prev => [task,...prev]); setDetections(prev => prev.map(x => x.id === id ? {...x,status:'Pending'} : x));
    notify(`Cleaning task created for Floor ${d.floor}, Zone ${d.zone}.`);
  };
  const updateTask = (id,status) => {
    const task = tasks.find(t => t.id === id); if (!task) return;
    setTasks(prev => prev.map(t => t.id === id ? {...t,status} : t));
    setDetections(prev => prev.map(d => d.id === task.detectionId ? {...d,status} : d));
    notify(`Task ${id} marked ${status.toLowerCase()}.`);
  };
  const filteredDetections = useMemo(() => detections.filter(d => (`${d.type} ${d.camera} ${d.zone} ${d.floor}`.toLowerCase().includes(search.toLowerCase()) && (priorityFilter === 'All' || d.priority === priorityFilter))),[detections,search,priorityFilter]);
  const cardDetections = showAll ? filteredDetections : filteredDetections.slice(0,5);

  const details = <section className="gc-panel gc-details"><SectionTitle name="Detected Item Details" icon="trash"/><div className="gc-details-grid"><Photo name={selected.image}/><div className="gc-detail-facts"><div><span>Type:</span><b>{selected.type}</b></div><div><span>Location:</span><b>Floor {selected.floor}, Zone {selected.zone}</b></div><div><span>Camera:</span><b>{selected.camera}</b></div><div><span>Confidence:</span><b>{selected.confidence}%</b></div><div><span>Time:</span><b>{selected.time}</b></div></div><div className="gc-details-priority"><Label priority={selected.priority}/></div></div>{selectedRepeat && <button className="gc-repeat-inline" onClick={() => {setRepeatFilter('All');setPage('Repeated Incidents');}}><Icon name="repeat" size={15}/> Recurring hotspot · {selectedRepeat.count} sightings <Icon name="arrow" size={15}/></button>}<div className="gc-details-actions"><button className="gc-primary" onClick={() => createTask(selected.id)}>{tasks.some(t => t.detectionId === selected.id) ? 'View Cleaning Task' : 'Create Cleaning Task'}</button><button className="gc-secondary" onClick={() => {setPage('Floor Map');setFloor(selected.floor);}}>View on Map</button></div></section>;
  const taskList = <section className="gc-panel gc-tasks-panel"><SectionTitle name="Cleaning Tasks" icon="clipboard" action={<button className="gc-text-action" onClick={() => setPage('Tasks')}>View All <Icon name="arrow" size={16}/></button>}/><div className="gc-short-tasks">{tasks.slice(0,4).map(t => { const d = detections.find(d=>d.id===t.detectionId); return <button key={t.id} className="gc-task-short" onClick={() => { chooseDetection(t.detectionId); setPage('Tasks'); }}><Photo name={d?.image || 'bag'}/><div className="gc-short-task-title"><b>{t.title}</b><span>Floor {d?.floor}, Zone {d?.zone}</span></div><Label priority={d?.priority || 'Low'}/><Label status={t.status}/><small>{t.created}</small></button>; })}</div></section>;
  const mapPanel = <section className="gc-panel gc-map-panel"><SectionTitle name="Garage Map" icon="layers" action={<FloorPicker floor={floor} setFloor={setFloor}/>}/><FloorPlan floor={floor} detections={detections} selectedId={selectedId} onSelect={chooseDetection}/><MapLegend/></section>;
  const repeatPanel = <section className="gc-panel gc-repeat-panel"><SectionTitle name="Repeated Incidents" icon="repeat" action={<button className="gc-text-action" onClick={() => setPage('Repeated Incidents')}>Explore Hotspots <Icon name="arrow" size={16}/></button>}/><p className="gc-repeat-description">Same waste type, floor and zone detected more than once. Historical demo sightings are grouped by hotspot.</p><div className="gc-repeat-quick-grid">{repeatedGroups.slice(0,3).map(g=><button className="gc-repeat-quick" key={g.key} onClick={()=>{chooseDetection(g.latest.id);setPage('Repeated Incidents');}}><span className="gc-repeat-mini-icon"><Icon name="repeat" size={17}/></span><span className="gc-repeat-quick-copy"><b>Floor {g.floor} · Zone {g.zone}</b><small>{g.type}</small></span><span className="gc-repeat-count">×{g.count}</span></button>)}</div><div className="gc-repeat-panel-foot"><span>{repeatedGroups.length} recurring hotspots · {repeatedCount} repeat sightings</span><button onClick={()=>simulateRepeat(repeatedGroups[0]?.latest || selected)}><Icon name="plus" size={15}/> Simulate Repeat</button></div></section>;
  const detectionPanel = <section className="gc-panel gc-detections-panel"><SectionTitle name="Recent Detections" icon="trash" action={<div className="gc-top-actions"><button className="gc-simulate" onClick={simulateDetection}><Icon name="plus" size={14}/> Simulate Detection</button><button className="gc-text-action" onClick={() => setShowAll(x=>!x)}>{showAll ? 'Show Less' : 'View All'} <Icon name="arrow" size={16}/></button></div>}/><div className="gc-table-scroll"><table className="gc-table"><thead><tr><th></th><th>Time</th><th>Camera</th><th>Location</th><th>Type</th><th>Confidence</th><th>Repeat</th><th>Priority</th><th>Status</th></tr></thead><tbody>{cardDetections.map(d => <tr key={d.id} onClick={() => chooseDetection(d.id)} className={selectedId === d.id ? 'gc-row-selected' : ''} tabIndex="0" onKeyDown={e => { if (e.key==='Enter') chooseDetection(d.id); }}><td><Photo name={d.image}/></td><td>{d.time}</td><td>{d.camera}</td><td>Floor {d.floor}, Zone {d.zone}</td><td>{d.type}</td><td>{d.confidence}%</td><td>{repeatedGroups.some(g=>g.key===incidentKey(d)) ? <span className="gc-repeat-table-tag"><Icon name="repeat" size={12}/> ×{repeatedGroups.find(g=>g.key===incidentKey(d)).count}</span> : <span className="gc-single-tag">New</span>}</td><td><Label priority={d.priority}/></td><td><Label status={d.status}/></td></tr>)}</tbody></table>{cardDetections.length === 0 && <div className="gc-empty">No detections match your filter.</div>}</div></section>;

  return <div className="gc-app">
    <header className="gc-header"><a className="gc-logo gc-logo-image-wrap" href="#/" title="Return to the 3D experience"><img className="gc-logo-image" src="/garageguard-header-logo.png" alt="GarageGuard logo" /></a><div className="gc-header-right"><span className="gc-online"><i/> System Online <em>DEMO</em></span><span className="gc-date">{now.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})}<small>{now.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}</small></span><a className="gc-back" href="#/">← 3D Experience</a></div></header>
    <aside className="gc-sidebar"><div className="gc-sidebar-nav">{navItems.map(n => <button key={n.name} className={`gc-side-link ${page===n.name ? 'is-active' : ''}`} onClick={()=>setPage(n.name)} aria-current={page === n.name ? 'page' : undefined}><Icon name={n.icon} size={23}/><span>{n.name}</span>{n.name==='Tasks' && openTasks>0 && <span className="gc-side-count">{openTasks}</span>}</button>)}</div><div className="gc-sidebar-foot"><div className="gc-side-pulse"><i/> Demo environment</div><span>GARAGEGUARD / SYSTEM v1.1</span></div></aside>
    <main className="gc-main">
      {page==='Dashboard' && <><div className="gc-ai-dashboard-cta"><div><Icon name="scan" size={22}/><span><strong>Try real AI detection</strong><small>Upload a garage image and see your Roboflow model find litter.</small></span></div><button onClick={() => setPage('AI Detection')}>Open AI Detector <Icon name="arrow" size={15}/></button></div><div className="gc-dashboard-grid"><div className="gc-main-column"><div className="gc-stats"><Metric icon="trash" count={detections.length} label="Items Detected" note="Sample detection log" color="red"/><Metric icon="check" count={completed} label="Tasks Completed" note="Sample task history" color="navy"/><Metric icon="warning" count={highPriority} label="High Priority" note="Needs attention" color="red"/><Metric icon="repeat" count={repeatedGroups.length} label="Repeat Hotspots" note={`${repeatedCount} repeat sightings`} color="amber"/></div>{mapPanel}{repeatPanel}{detectionPanel}</div><div className="gc-right-column">{details}{taskList}</div></div></>}
      {page==='AI Detection' && <RoboflowUpload/>}
      {page==='Repeated Incidents' && <>
        <div className="gc-page-intro gc-repeat-intro"><div><span className="gc-overline">RECURRENCE MONITOR / SIMULATED DATA</span><h1>Repeated Incidents</h1><p>Spot places that repeatedly collect the same waste. Matching means same floor, zone, and item type—not necessarily the same physical object.</p></div><button className="gc-primary" onClick={()=>simulateRepeat(repeatedGroups[0]?.latest || selected)}><Icon name="plus" size={17}/> Simulate Repeat</button></div>
        <div className="gc-repeat-summary"><article><span>RECURRING HOTSPOTS</span><b>{repeatedGroups.length}</b><small>Locations with repeat sightings</small></article><article><span>REPEATED SIGHTINGS</span><b>{repeatedCount}</b><small>Beyond the first detection</small></article><article><span>OPEN INCIDENTS IN HOTSPOTS</span><b>{repeatedGroups.reduce((n,g)=>n+g.active,0)}</b><small>Pending, assigned or in progress</small></article><article><span>MOST FREQUENT ZONE</span><b>{repeatedGroups[0] ? `F${repeatedGroups[0].floor} · ${repeatedGroups[0].zone}` : '—'}</b><small>{repeatedGroups[0]?.count || 0} matching sightings</small></article></div>
        <section className="gc-panel gc-repeat-workspace"><div className="gc-workspace-tools"><div className="gc-section-name"><span className="gc-section-icon tone-repeat"><Icon name="repeat" size={23}/></span><h2>Recurring Hotspot History</h2></div><div className="gc-filter-tabs">{['All','1','2','3','4'].map(f=><button key={f} className={repeatFilter===f?'active':''} onClick={()=>setRepeatFilter(f)}>{f==='All'?'All Floors':`Floor ${f}`}</button>)}</div></div><div className="gc-repeat-history-grid">{repeatedGroups.filter(g=>repeatFilter==='All'||g.floor===Number(repeatFilter)).map(g=><article key={g.key} className="gc-repeat-history-card"><div className="gc-repeat-card-top"><span className="gc-repeat-location">FLOOR {g.floor} <span>·</span> ZONE {g.zone}</span><span className="gc-repeat-count">{g.count} SIGHTINGS</span></div><div className="gc-repeat-card-main"><Photo name={g.latest.image}/><div><h3>{g.type}</h3><p>{g.active > 0 ? `${g.active} open detection${g.active!==1?'s':''}` : 'All logged sightings resolved'}</p><small>Camera {g.latest.camera} · Last seen {g.latest.time}</small></div></div><div className="gc-repeat-timeline"><span className="gc-repeat-timeline-title">SIGHTING HISTORY</span>{g.items.map((d,i)=><button key={d.id} className={`gc-repeat-timeline-row ${selectedId===d.id?'is-selected':''}`} onClick={()=>chooseDetection(d.id,true)} title="Open this detection on Dashboard"><span className={`gc-repeat-timeline-dot ${d.status==='Completed'?'closed':'open'}`}/><span>{i===0?'Latest sighting':`Previous sighting ${i}`}</span><b>{d.time}</b><Label status={d.status}/><Icon name="arrow" size={15}/></button>)}</div><div className="gc-repeat-card-footer"><button className="gc-secondary" onClick={()=>{chooseDetection(g.latest.id);setPage('Floor Map');}}>View Map</button><button className="gc-primary" onClick={()=>simulateRepeat(g.latest)}><Icon name="plus" size={15}/> Add Repeat</button></div></article>)}{repeatedGroups.filter(g=>repeatFilter==='All'||g.floor===Number(repeatFilter)).length===0 && <div className="gc-empty">No repeated incidents on this floor yet. Simulate a repeat to create one.</div>}</div></section>
      </>}

      {page==='Floor Map' && <><div className="gc-page-intro"><div><span className="gc-overline">SPATIAL OVERVIEW / FOUR FLOORS</span><h1>Floor Map</h1><p>Select a floor, then select any color-coded marker to inspect its detection.</p></div><FloorPicker floor={floor} setFloor={setFloor}/></div><div className="gc-floor-grid"><section className="gc-panel gc-full-map"><SectionTitle name={`Level ${floor} · Zone Overview`} icon="map"/><FloorPlan floor={floor} detections={detections} selectedId={selectedId} onSelect={chooseDetection} all/><MapLegend/></section><section className="gc-panel gc-floor-items"><SectionTitle name="Detections on This Floor" icon="warning"/><div className="gc-floor-item-list">{detections.filter(d=>d.floor===floor).map(d=><button key={d.id} className={selectedId===d.id?'selected':''} onClick={()=>chooseDetection(d.id)}><Photo name={d.image}/><span><b>{d.type}</b><small>Zone {d.zone} · Camera {d.camera}</small></span><Label priority={d.priority}/></button>)}</div><button className="gc-primary gc-wide" onClick={()=>setPage('Dashboard')}>View Selected Detection</button></section></div></>}
      {page==='Tasks' && <><div className="gc-page-intro"><div><span className="gc-overline">CREW WORKFLOW / TASK QUEUE</span><h1>Cleaning Tasks</h1><p>Assign, start, and complete cleaning jobs. Changes update the dashboard and detections.</p></div><div className="gc-summary-pills"><span>{openTasks} open</span><span>{completed} completed</span></div></div><div className="gc-panel gc-task-workspace"><div className="gc-workspace-tools"><div className="gc-section-name"><span className="gc-section-icon tone-clipboard"><Icon name="clipboard"/></span><h2>Task Queue</h2></div><div className="gc-filter-tabs">{['All',...statusOptions].map(s=><button key={s} onClick={()=>setTaskFilter(s)} className={taskFilter===s?'active':''}>{s}</button>)}</div></div><div className="gc-task-rows">{tasks.filter(t=>taskFilter==='All'||t.status===taskFilter).map(t=>{const d=detections.find(d=>d.id===t.detectionId);return <article className="gc-task-row" key={t.id}><Photo name={d?.image||'bag'}/><div className="gc-task-row-name"><small>{t.id} · {t.created}</small><b>{t.title}</b><span>Floor {d?.floor}, Zone {d?.zone} · Camera {d?.camera}</span></div><Label priority={d?.priority||'Low'}/><Label status={t.status}/><div className="gc-task-row-actions"><select aria-label={`Update ${t.title} status`} value={t.status} onChange={e=>updateTask(t.id,e.target.value)}>{statusOptions.map(x=><option key={x}>{x}</option>)}</select><button onClick={()=>{chooseDetection(t.detectionId,true);}} title="Open detection"><Icon name="arrow" size={18}/></button></div></article>;})}{tasks.filter(t=>taskFilter==='All'||t.status===taskFilter).length===0 && <div className="gc-empty">No tasks in this status.</div>}</div></div></>}
      {page==='Analytics' && <><div className="gc-page-intro"><div><span className="gc-overline">OPERATIONAL INSIGHTS / DEMO DATA</span><h1>Analytics</h1><p>Explore detection volume, recurring hotspots and risk distribution across floors.</p></div><button className="gc-secondary gc-export" onClick={()=>exportCSV(detections)}><Icon name="download" size={17}/> Export CSV</button></div><div className="gc-stats gc-analytics-stats"><Metric icon="trash" count={detections.length} label="Total Detections" note="Last sample period" color="red"/><Metric icon="check" count={completed} label="Tasks Completed" note="Across all floors" color="navy"/><Metric icon="warning" count={highPriority} label="High Priority" note="Needs attention" color="red"/><Metric icon="repeat" count={repeatedGroups.length} label="Repeat Hotspots" note={`${repeatedCount} extra sightings`} color="amber"/></div><div className="gc-analytics-grid"><section className="gc-panel gc-chart-panel"><SectionTitle name="Detections by Floor" icon="bars"/><div className="gc-bar-chart">{[1,2,3,4].map(f=>{const n=detections.filter(d=>d.floor===f).length;return <button key={f} title={`View floor ${f}`} onClick={()=>{setFloor(f);setPage('Floor Map');}}><span className="gc-chart-value">{n}</span><span className="gc-chart-track"><span style={{height:`${Math.max(7,n / Math.max(...[1,2,3,4].map(f=>detections.filter(d=>d.floor===f).length)) * 100)}%`}}/></span><b>Floor {f}</b></button>;})}</div></section><section className="gc-panel gc-chart-panel"><SectionTitle name="Priority Distribution" icon="warning"/><div className="gc-priority-breakdown">{['High','Medium','Low'].map(p=>{const n=detections.filter(d=>d.priority===p).length;return <div key={p}><div><b>{p} Priority</b><strong>{n} detections</strong></div><span className="gc-break-track"><span className={`bar-${p.toLowerCase()}`} style={{width:`${n/detections.length*100}%`}}/></span></div>;})}</div></section></div></>}
      {page==='Settings' && <><div className="gc-page-intro"><div><span className="gc-overline">ENVIRONMENT PREFERENCES</span><h1>Settings</h1><p>Customize the behavior of this interactive demonstration.</p></div></div><section className="gc-panel gc-settings-panel"><SectionTitle name="Detection Preferences" icon="settings"/>{[['alerts','Show incident notifications','Show a confirmation after task updates.'],['autoTasks','Auto-create tasks','Automatically create a cleaning task for newly simulated detections.'],['sound','Sound alerts','Play a brief sound for simulated events and task updates (not camera audio).']].map(([key,title,desc])=><label className="gc-setting-row" key={key}><span><b>{title}</b><small>{desc}</small></span><input type="checkbox" checked={settings[key]} onChange={e=>setSettings(prev=>({...prev,[key]:e.target.checked}))}/><span className="gc-toggle" aria-hidden="true"/></label>)}<div className="gc-settings-reset"><p>Reset restores the original sample detections, tasks and metrics.</p><button className="gc-secondary" onClick={()=>{setDetections(initialDetections);setTasks(initialTasks);setSelectedId('D-101');setCameraId('3B');setFloor(3);notify('Demo data reset to its initial state.');}}>Reset demo data <Icon name="refresh" size={17}/></button></div></section></>}
      <footer className="gc-footer">GarageGuard AI · Dashboard incident history is sample data. Upload an image in AI Detection to scan it with Roboflow Cloud.</footer>
    </main>
    {notice && <div className="gc-toast" role="status"><Icon name="check" size={20}/>{notice}<button onClick={()=>setNotice('')} aria-label="Dismiss notification"><Icon name="close" size={16}/></button></div>}
  </div>;
}
