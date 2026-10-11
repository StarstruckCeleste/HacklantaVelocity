import React, { useState } from 'react';

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (sending) return;
    const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT;
    if (!endpoint) {
      setSuccess(false);
      setStatus('Message sending is not set up yet. The site owner needs to connect a contact inbox.');
      return;
    }

    const form = event.currentTarget;
    setSending(true);
    setStatus('');
    setSuccess(false);
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
        <nav className={`header-nav ${menuOpen ? 'menu-open' : ''}`} aria-label="Main navigation">
          <a href="#/about">ABOUT</a>
          <span className="nav-orbit" aria-hidden="true"><i /><i /></span>
          <a href="#/demo">LIVE DEMO <span aria-hidden="true">↗</span></a>
          <a className="header-nav-contact is-selected" href="#/contact" aria-current="page" onClick={() => setMenuOpen(false)}>CONTACT US</a>
        </nav>
        <button className="mobile-menu" type="button" onClick={() => setMenuOpen(value => !value)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          <span /><span />
        </button>
      </header>

      <main className="contact-main">
        <section className="contact-panel" aria-labelledby="contact-heading">
          <h1 id="contact-heading">Get in touch</h1>
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