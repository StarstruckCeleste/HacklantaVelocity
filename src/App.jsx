import React, { useCallback, useEffect, useRef, useState } from 'react';
import GarageScene from './GarageScene.jsx';

const chapters = [
  {
    short: 'INTRO',
    number: '01',
    eyebrow: '01. INTRO TO GARAGEGUARD',
    title: <>SAFER <em>GARAGES.</em></>,
    summary: 'AI-assisted hazard detection and more efficient cleaning for the people who keep our garages safe.',
    label: 'ENTER THE EXPERIENCE',
    metric: '360°',
    metricLabel: 'GARAGE VIEW',
    align: 'left',
    kind: 'hero',
    expandable: false,
  },
  {
    short: 'ABOUT US',
    number: '02',
    eyebrow: '02. ABOUT US',
    title: <>ABOUT <em>US.</em></>,
    fullHeading: 'A Cleaner Garage Starts With a Safer Worker.',
    summary: 'Cleaning crews keep garages safe, but often work with limited information and overlooked hazards.',
    label: 'MISSION / SAFER CLEANING',
    metric: 'AI',
    metricLabel: 'ASSISTED OPERATIONS',
    align: 'right',
    expandable: true,
    sections: [
      { type: 'paragraph', text: 'Every day, janitors and cleaning crews keep our parking garages clean, functional, and safe. Yet the people responsible for maintaining these spaces often work with limited information, face overlooked hazards, and spend valuable time searching for problems that could have been identified sooner.' },
      { type: 'emphasis', text: 'GarageGuard is changing how parking garages are cleaned and maintained.' },
      { type: 'paragraph', text: 'We envision a smarter approach to facility maintenance that uses AI to identify potential hazards, guide cleaning teams to the right locations, and help workers prioritize the tasks that matter most.' },
      { type: 'paragraph', text: 'Our mission is simple: make cleaning safer, more efficient, and more manageable for the people who do it every day.' },
      { type: 'emphasis', text: 'Because the people who take care of our spaces deserve spaces that take care of them, too.' },
    ],
  },
  {
    short: 'REALITY',
    number: '03',
    eyebrow: '03. THE REALITY OF CLEANING',
    title: <>HIDDEN <em>HAZARDS.</em></>,
    fullHeading: "The Problems You Don’t See Are the Ones That Matter.",
    summary: 'Spills, debris, wasted time, and missed reports can make everyday cleaning harder.',
    label: 'PAIN POINTS / CURRENT STATE',
    metric: '04',
    metricLabel: 'CORE CHALLENGES',
    align: 'left',
    expandable: true,
    kind: 'incident',
    sections: [
      { type: 'paragraph', text: 'A parking garage can span multiple floors, thousands of parking spaces, and countless areas that require constant attention. For cleaning crews, finding every problem is a challenge in itself.' },
      { type: 'bullet-title', text: 'HIDDEN HAZARDS' },
      { type: 'bullet-body', text: 'Oil spills, liquid puddles, broken glass, and scattered debris can create risks for both workers and drivers.' },
      { type: 'bullet-title', text: 'TIME LOST SEARCHING' },
      { type: 'bullet-body', text: 'Large facilities force workers to cover significant distances just to identify which areas need attention.' },
      { type: 'bullet-title', text: 'REACTIVE CLEANING' },
      { type: 'bullet-body', text: 'Problems may go unnoticed until someone complains or an incident occurs, leaving workers to respond after the fact.' },
      { type: 'bullet-title', text: 'DISCONNECTED COMMUNICATION' },
      { type: 'bullet-body', text: 'Without a clear way to report, assign, and track issues, important tasks can fall through the cracks.' },
      { type: 'paragraph', text: 'These aren\'t just operational inconveniences. They affect worker safety, cleaning efficiency, and the experience of everyone using the garage.' },
      { type: 'paragraph', text: 'The problem isn\'t that cleaning crews aren\'t working hard enough. It\'s that they don\'t always have the information and tools they need to work smarter.' },
    ],
  },
  {
    short: 'GARAGEGUARD',
    number: '04',
    eyebrow: '04. MEET GARAGEGUARD',
    title: <>MEET <em>GARAGEGUARD.</em></>,
    fullHeading: 'From Overlooked Problems to Actionable Solutions.',
    summary: 'AI-assisted detection turns overlooked maintenance problems into clear next steps.',
    label: 'DETECT / PRIORITIZE / RESPOND / RESOLVE',
    metric: '4X',
    metricLabel: 'WORKFLOW STEPS',
    align: 'right',
    expandable: true,
    sections: [
      { type: 'paragraph', text: 'GarageGuard transforms how parking facilities identify and respond to cleaning and maintenance needs.' },
      { type: 'paragraph', text: 'Using AI-assisted analysis of compatible camera feeds, GarageGuard can flag visible issues, organize them by priority, and help cleaning teams understand where their attention is needed most.' },
      { type: 'emphasis', text: 'DETECT. PRIORITIZE. RESPOND. RESOLVE.' },
      { type: 'bullet-title', text: 'DETECT' },
      { type: 'bullet-body', text: 'Identify potential spills, debris, and other visible maintenance concerns.' },
      { type: 'bullet-title', text: 'PRIORITIZE' },
      { type: 'bullet-body', text: 'Help teams distinguish urgent hazards from routine cleaning tasks.' },
      { type: 'bullet-title', text: 'RESPOND' },
      { type: 'bullet-body', text: 'Direct workers to the relevant garage floor or zone with clear task information.' },
      { type: 'bullet-title', text: 'RESOLVE' },
      { type: 'bullet-body', text: 'Track progress and record when issues have been addressed.' },
      { type: 'paragraph', text: 'Instead of relying entirely on routine inspections and incoming complaints, GarageGuard aims to help facilities take a more proactive approach to maintenance.' },
      { type: 'paragraph', text: 'Technology should not replace the people who keep our facilities running. It should give them better information, better coordination, and more time to do their jobs.' },
    ],
  },
  {
    short: 'WORKERS',
    number: '05',
    eyebrow: '05. THE WORKER EXPERIENCE',
    title: <>SMARTER <em>CLEANING.</em></>,
    fullHeading: 'Less Searching. Less Guesswork. Smarter Cleaning.',
    summary: 'Spend less time searching and more time addressing what matters.',
    label: 'WORKFLOW / ON-THE-GROUND IMPACT',
    metric: 'UX',
    metricLabel: 'WORKER-FIRST DESIGN',
    align: 'left',
    expandable: true,
    sections: [
      { type: 'paragraph', text: 'Cleaning a parking garage shouldn\'t mean spending valuable time looking for the next problem to solve.' },
      { type: 'paragraph', text: 'GarageGuard puts actionable information directly into the cleaning workflow, helping workers focus on what needs attention instead of figuring out where to start.' },
      { type: 'bullet-title', text: 'KNOW WHERE TO GO' },
      { type: 'bullet-body', text: 'Receive clear task locations so you can find the areas that need attention.' },
      { type: 'bullet-title', text: 'KNOW WHAT MATTERS FIRST' },
      { type: 'bullet-body', text: 'See higher-priority hazards before routine tasks when urgency requires it.' },
      { type: 'bullet-title', text: 'MOVE MORE EFFICIENTLY' },
      { type: 'bullet-body', text: 'Organize nearby tasks and plan more practical routes across the facility.' },
      { type: 'bullet-title', text: 'KNOW WHAT\'S BEEN DONE' },
      { type: 'bullet-body', text: '...' },
    ],
  },
  {
    short: 'LIVE DEMO',
    number: '06',
    eyebrow: '06. LIVE DEMO',
    title: <>LIVE <em>DEMO.</em></>,
    summary: 'Explore live-style detections, repeated incidents, floor maps, and cleaning tasks.',
    label: 'GARAGEGUARD / INTERACTIVE DEMO',
    metric: 'LIVE',
    metricLabel: 'PRODUCT WALKTHROUGH',
    align: 'right',
    kind: 'demo',
    expandable: false,
  },
];

const Arrow = ({ diagonal = false }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {diagonal ? <path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      : <path d="M4 12h16m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);

function RichCopy({ chapter, expanded, onToggle }) {
  if (!chapter.sections?.length) {
    return <p className="story-description">{chapter.summary}</p>;
  }

  return (
    <div className={`story-copy ${expanded ? 'is-expanded' : 'is-collapsed'}`}>
      {!expanded ? (
        <>
          <p className="story-description story-preview">
            {chapter.summary.replace(/\.\.\.$/, '.').trimEnd()}
          </p>
          <button
            type="button"
            className="story-ellipsis"
            onClick={onToggle}
            aria-label="Expand chapter text"
            aria-expanded={false}
            title="Read the full chapter"
          >[read more]</button>
        </>
      ) : (
        <>
          <div className="story-copy-inner" id={`chapter-copy-${chapter.number}`}>
            {chapter.fullHeading && <p className="story-full-heading">{chapter.fullHeading}</p>}
            {chapter.sections.map((section, index) => {
              if (section.type === 'paragraph') return <p className="story-paragraph" key={index}>{section.text}</p>;
              if (section.type === 'emphasis') return <p className="story-emphasis" key={index}>{section.text}</p>;
              if (section.type === 'bullet-title') return <h3 className="story-bullet-title" key={index}>{section.text}</h3>;
              if (section.type === 'bullet-body') return <p className="story-bullet-body" key={index}>{section.text}</p>;
              return null;
            })}
          </div>
          <button
            type="button"
            className="story-ellipsis story-collapse"
            onClick={onToggle}
            aria-label="Collapse chapter text"
            aria-expanded={true}
            aria-controls={`chapter-copy-${chapter.number}`}
            title="Collapse chapter"
          >[read less]</button>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [current, setCurrent] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});
  const scrollProgressRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const indexRef = useRef(0);

  const goTo = useCallback((index) => {
    const bounded = Math.max(0, Math.min(chapters.length - 1, index));
    document.getElementById(`chapter-${bounded}`)?.scrollIntoView({
      behavior: reducedMotionRef.current ? 'auto' : 'smooth', block: 'start',
    });
    setMenuOpen(false);
  }, []);

  const toggleChapter = useCallback((number) => {
    setExpandedChapters(prev => ({ ...prev, [number]: !prev[number] }));
  }, []);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => { reducedMotionRef.current = mql.matches; };
    updatePreference();
    mql.addEventListener?.('change', updatePreference);

    let raf = 0;
    const updateScroll = () => {
      raf = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const ratio = Math.max(0, Math.min(1, scrollY / maxScroll));
      scrollProgressRef.current = ratio;
      setScrollPercent(ratio * 100);
      const next = Math.max(0, Math.min(chapters.length - 1, Math.round(scrollY / Math.max(1, innerHeight))));
      if (indexRef.current !== next) {
        indexRef.current = next;
        setCurrent(next);
      }
    };
    const scrollListener = () => { if (!raf) raf = requestAnimationFrame(updateScroll); };
    window.addEventListener('scroll', scrollListener, { passive: true });
    window.addEventListener('resize', scrollListener);
    updateScroll();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', scrollListener);
      window.removeEventListener('resize', scrollListener);
      mql.removeEventListener?.('change', updatePreference);
    };
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') { setIncidentOpen(false); setMenuOpen(false); return; }
      if (incidentOpen || ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(indexRef.current + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(indexRef.current - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, incidentOpen]);

  useEffect(() => {
    if (window.location.hash === '#/about') {
      goTo(1);
    }
  }, [goTo]);

  return (
    <div className="app-shell">
      <GarageScene scrollProgressRef={scrollProgressRef} reducedMotionRef={reducedMotionRef} />
      <div className="ambient-light ambient-light-a" aria-hidden="true" />
      <div className="ambient-light ambient-light-b" aria-hidden="true" />
      <div className="screen-grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <header className="site-header">
        <a className="identity identity-image" href="#/" onClick={(e) => { e.preventDefault(); goTo(0); }} aria-label="Return to opening">
          <img className="identity-logo-image" src="/garageguard-header-logo.png" alt="GarageGuard logo" />
        </a>
        <div className="header-center">
          WORKER-FIRST FACILITY AI <span className="header-separator">/</span>{' '}
          <button
            type="button"
            className="header-demo-button"
            onClick={() => goTo(5)}
            title="Jump to slide 6"
            aria-label="Jump to slide 6"
          >
            DEMO BUILD
          </button>
        </div>
        <nav className={`header-nav ${menuOpen ? 'menu-open' : ''}`} aria-label="Main navigation">
          <a href="#/about" onClick={(e) => { e.preventDefault(); goTo(1); }}>ABOUT</a>
          <span className="nav-divider" aria-hidden="true" />
          <a
            href="#/contact"
            onClick={() => setMenuOpen(false)}
          >
            CONTACT US
          </a>
          <span className="nav-divider" aria-hidden="true" />
          <a
            href="#/demo"
            onClick={() => setMenuOpen(false)}
            aria-label="Launch Live Demo website"
          >
            LIVE DEMO <Arrow diagonal />
          </a>
        </nav>
        <button className="mobile-menu" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          <span /><span />
        </button>
      </header>

      <div className="frame-corner frame-top-left" aria-hidden="true" />
      <div className="frame-corner frame-top-right" aria-hidden="true" />
      <div className="frame-corner frame-bottom-left" aria-hidden="true" />
      <div className="frame-corner frame-bottom-right" aria-hidden="true" />

      <aside className="chapter-nav" aria-label="Chapter navigation">
        <div className="chapter-nav-label">CHAPTERS</div>
        {chapters.map((chapter, index) => (
          <button
            key={chapter.number}
            className={`chapter-dot ${index === current ? 'is-current' : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Jump to chapter ${index + 1}: ${chapter.short}`}
            aria-current={current === index ? 'step' : undefined}
          >
            <span className="chapter-dot-track" />
            <span className="chapter-dot-label">{chapter.short}</span>
            <span className="chapter-dot-number">{chapter.number}</span>
          </button>
        ))}
      </aside>

      <div className="side-caption side-caption-left" aria-hidden="true">GARAGEGUARD / WORKER SAFETY / SYSTEM</div>
      <div className="side-caption side-caption-right" aria-hidden="true">SCROLL TO ROTATE AROUND THE GARAGE</div>

      <main id="story" className="story">
        {chapters.map((chapter, index) => {
          const isExpanded = !!expandedChapters[chapter.number];
          return (
            <section className={`chapter chapter-${index} ${index === current ? 'is-active' : ''} align-${chapter.align} ${chapter.kind ?? ''}`} id={`chapter-${index}`} key={chapter.number} aria-label={`Chapter ${index + 1}: ${chapter.short}`}>
              <div className="chapter-content">
                <div className="story-eyebrow"><span className="eyebrow-dash" /> {chapter.eyebrow}</div>
                <h1 className="story-title">{chapter.title}</h1>
                <RichCopy chapter={chapter} expanded={isExpanded} onToggle={() => chapter.expandable && toggleChapter(chapter.number)} />
                <div className="story-rule" />
                <div className="chapter-meta">
                  <div><strong>{chapter.metric}</strong><small>{chapter.metricLabel}</small></div>
                  <span className="chapter-meta-tag">{/*<span className="pulse-indicator" />*/}{chapter.label}</span>
                </div>
                {chapter.kind === 'incident' && (
                  <button className="outline-action" onClick={() => setIncidentOpen(true)}>
                    VIEW INCIDENT REPORT <Arrow diagonal />
                  </button>
                )}
                {chapter.kind === 'demo' && (
                  <a className="outline-action demo-action" href="#/demo">
                    LAUNCH THE LIVE DASHBOARD <Arrow diagonal />
                  </a>
                )}
              </div>
              {chapter.kind === 'incident' && (
                <div className="floating-telemetry" aria-hidden="true">
                  <div className="telemetry-title"><span className="pink-dot" /> OBJECT IDENTIFIED</div>
                  <div>CAM_04 / OIL SPILL</div>
                  <div>FLOOR_04 · ZONE_B2</div>
                  <div className="telemetry-bars"><span /><span /><span /><span /><span /><span /><span /><span /></div>
                </div>
              )}
            </section>
          );
        })}
      </main>

      <div className="fixed-bottom left-bottom">
        <span className="online-chip"><span className="live-dot" /> SYSTEM ONLINE</span>
        <span className="bottom-minor">GG-001 / DEMONSTRATION EXPERIENCE</span>
      </div>
      <div className="fixed-bottom center-bottom">
        <span className="scroll-label">{current === chapters.length - 1 ? 'END OF EXPERIENCE' : 'SCROLL TO ORBIT'}</span>
        <span className="mouse-icon" aria-hidden="true"><i /></span>
      </div>
      <div className="fixed-bottom right-bottom">
        <span>VIEW <b>{String(current + 1).padStart(2, '0')}</b> / {String(chapters.length).padStart(2, '0')}</span>
        <div className="progress-track"><span style={{ width: `${scrollPercent}%` }} /></div>
        <button className="next-button" onClick={() => goTo((current + 1) % chapters.length)} aria-label="Next chapter"><Arrow /></button>
      </div>

      {incidentOpen && (
        <div className="modal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) setIncidentOpen(false); }}>
          <section className="incident-modal" role="dialog" aria-modal="true" aria-labelledby="incident-heading">
            <div className="modal-heading"><span><span className="pink-dot" /> LIVE INCIDENT REPORT</span><button onClick={() => setIncidentOpen(false)} aria-label="Close report">×</button></div>
            <div className="incident-code">INC — 0042</div>
            <h2 id="incident-heading">Oil spill detected.</h2>
            <p>Example incident used to demonstrate how GarageGuard AI can surface visible hazards in a garage operations workflow. No live camera or AI backend is connected.</p>
            <div className="incident-table">
              <div><span>STATUS</span><b className="status-warn">AWAITING REVIEW</b></div>
              <div><span>LEVEL</span><b>04</b></div>
              <div><span>ZONE</span><b>B2 · TOP DECK</b></div>
              <div><span>SOURCE</span><b>CAMERA 04 (DEMO)</b></div>
              <div><span>CATEGORY</span><b>SLIP HAZARD</b></div>
            </div>
            <button className="modal-close-button" onClick={() => setIncidentOpen(false)}>RETURN TO GARAGE <Arrow /></button>
          </section>
        </div>
      )}
    </div>
  );
}
