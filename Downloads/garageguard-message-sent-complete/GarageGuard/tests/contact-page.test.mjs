import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const contact = readFileSync(new URL('../src/ContactPage.jsx', import.meta.url), 'utf8');
const router = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

test('top right bubble opens the contact page', () => {
  assert.match(app, /className="header-nav-contact" href="#\/contact"/);
  assert.match(router, /route\.startsWith\('#\/contact'\) \? <ContactPage \/>/);
  assert.match(contact, /aria-current="page"/);
});

test('contact page only asks for requested fields', () => {
  assert.match(contact, />Get in touch<\/h1>/);
  assert.match(contact, />Name<\/label>/);
  assert.match(contact, />Email<\/label>/);
  assert.match(contact, />Write a Message<\/label>/);
  assert.match(contact, /type="email"/);
  assert.match(contact, /<textarea /);
  assert.doesNotMatch(contact, /Send Message|Send now|Contact support|placeholder=/);
});

test('contact page preserves the header layout and phone nav', () => {
  assert.match(contact, /garageguard-header-logo\.png/);
  assert.match(contact, /mobile-menu/);
  assert.match(css, /\.contact-panel/);
  assert.match(css, /\.header-nav a/);
});
