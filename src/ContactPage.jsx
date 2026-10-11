import React, { useState } from 'react';

const Arrow = ({ diagonal = false }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {diagonal ? <path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      : <path d="M4 12h16m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);

// Set to true to simulate message delivery with success confirmation without a backend inbox
const FAKE_SUBMIT = true;

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (sending) return;

    const form = event.currentTarget;
    setSending(true);
    setStatus('');
    setSuccess(false);

    if (FAKE_SUBMIT) {
      setTimeout(() => {
        form.reset();
        setSuccess(true);
        setStatus('Message Sent.');
        setSending(false);
      }, 650);
      return;
    }

    const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT;
    if (!endpoint) {
      setSending(false);
      setSuccess(false);
      setStatus('Message sending is not set up yet. The site owner needs to connect a contact inbox.');
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Could not send your message. Please try again.');
      form.reset();
      setSuccess(true);
      setStatus('Message Sent.');
    } catch (error) {
      setSuccess(false);
      setStatus(error.message || 'Could not send your message. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="contact-page">
      <header className="site-header">
        <a className="identity identity-image contact-home-link" href="#/" aria-label="Return to GarageGuard homepage">
          <img className="identity-logo-image" src="/garageguard-header-logo.png" alt="GarageGuard logo" />
        </a>
        <div className="header-center">
          WORKER-FIRST FACILITY AI <span className="header-separator">/</span>{' '}
          <a
            href="#/demo"
            className="header-demo-button"
            title="Jump to slide 6"
            aria-label="Jump to slide 6"
          >
            DEMO BUILD
          </a>
        </div>
        <nav className={`header-nav ${menuOpen ? 'menu-open' : ''}`} aria-label="Main navigation">
          <a href="#/about" onClick={() => setMenuOpen(false)}>ABOUT</a>
          <span className="nav-divider" aria-hidden="true" />
          <a
            href="#/contact"
            onClick={() => setMenuOpen(false)}
          >
            CONTACT US
          </a>
          <span className="nav-divider" aria-hidden="true" />
          <a
            href="#/dashboard"
            onClick={() => setMenuOpen(false)}
            aria-label="Launch Live Demo website"
          >
            LIVE DEMO <Arrow diagonal />
          </a>
        </nav>
        <button className="mobile-menu" type="button" onClick={() => setMenuOpen(value => !value)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          <span /><span />
        </button>
      </header>

      <main className="contact-main">
        <section className="contact-panel" aria-labelledby="contact-heading">
          <div className="contact-panel-header">
            <h1 id="contact-heading">Get in touch</h1>
            <a href="#/" className="contact-back-link" aria-label="Return to homepage">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>BACK</span>
            </a>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" type="text" autoComplete="name" required maxLength="120" />

            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength="254" />

            <label htmlFor="contact-message">Write a Message</label>
            <textarea id="contact-message" name="message" rows="6" required maxLength="5000" />
            <button className="contact-send" type="submit" disabled={sending}>{sending ? 'SENDING...' : 'SEND MESSAGE'}</button>
            {status && <p className={`contact-status ${success ? 'is-success' : 'is-error'}`} role="status">{status}</p>}
          </form>
        </section>
      </main>
    </div>
  );
}