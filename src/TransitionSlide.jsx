import React from 'react';

export default function TransitionSlide({ fading, target }) {
  const isDemo = target === 'demo';

  return (
    <div
      className={`transition-overlay ${fading ? 'is-fading' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={isDemo ? 'Loading demo environment' : 'Loading 3D garage experience'}
    >
      <div className="transition-grain" aria-hidden="true" />
      <div className="transition-glow" aria-hidden="true" />
      <div className="frame-corner frame-top-left" aria-hidden="true" />
      <div className="frame-corner frame-top-right" aria-hidden="true" />
      <div className="frame-corner frame-bottom-left" aria-hidden="true" />
      <div className="frame-corner frame-bottom-right" aria-hidden="true" />

      <div className="transition-card">
        <div className="transition-eyebrow">
          <span className="eyebrow-dash" /> GARAGEGUARD <span>/</span> SYSTEM TRANSITION
        </div>

        <div className="transition-logo-wrap">
          <img
            src="/garageguard-logo.png"
            alt="GarageGuard Logo"
            className="transition-logo"
          />
        </div>

        <div className="transition-status">
          <span className="pulse-indicator" aria-hidden="true" />
          <span>{isDemo ? 'INITIALIZING DEMO DASHBOARD' : 'RETURNING TO 3D EXPERIENCE'}</span>
        </div>

        <div className="transition-progress" aria-hidden="true">
          <div className="transition-progress-bar" />
        </div>

        <div className="transition-caption">
          {isDemo ? 'CONNECTING TELEMETRY & CAMERA FEEDS' : 'LOADING 3D GARAGE ENVIRONMENT'}
        </div>
      </div>
    </div>
  );
}

