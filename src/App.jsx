import { useState } from 'react';
import { Shield, Key, LockKeyhole, BookOpen, Globe } from 'lucide-react';
import './App.css';
import SymmetricDemo from './components/symmetric/SymmetricDemo';
import AsymmetricDemo from './components/asymmetric/AsymmetricDemo';
import AboutPage from './components/about/AboutPage';

const TABS = [
  { id: 'symmetric',  label: 'Symmetric Encryption',  Icon: Key },
  { id: 'asymmetric', label: 'Asymmetric Encryption', Icon: LockKeyhole },
  { id: 'about',      label: 'About & Methods',        Icon: BookOpen },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('symmetric');

  return (
    <div className="app">
      {/* ── Project Header ────────────────────────────────── */}
      <header className="project-header">
        <div className="project-header-top">
          <div className="project-logo">
            <Shield size={32} strokeWidth={1.5} />
          </div>
          <div className="project-identity">
            <div className="project-badge">Open Source · Cybersecurity</div>
            <h1 className="project-title">Cryptography Playground</h1>
            <p className="project-subtitle">
              An interactive, modular toolkit for exploring symmetric and asymmetric encryption techniques — all running locally in your browser.
            </p>
          </div>
        </div>

        <div className="project-divider" />

        <div className="project-meta-bar">
          <div className="project-meta-item">
            <span className="project-meta-label">Developer</span>
            <span className="project-meta-value">Daddy Omar Jeng</span>
          </div>
          <div className="project-meta-sep" />
          <div className="project-meta-item">
            <span className="project-meta-label">Website</span>
            <a
              href="https://www.daddyomarjeng.com"
              target="_blank"
              rel="noopener noreferrer"
              className="project-meta-link"
            >
              <Globe size={12} />
              www.daddyomarjeng.com
            </a>
          </div>
          <div className="project-meta-sep" />
          <div className="project-meta-item">
            <span className="project-meta-label">License</span>
            <span className="project-meta-value">MIT</span>
          </div>
        </div>
      </header>

      {/* ── Navigation Tabs ───────────────────────────────── */}
      <div className="tabs-wrapper">
        <div className="tabs">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`tab-btn ${activeTab === id ? 'active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={15} strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Page Content ──────────────────────────────────── */}
      <main>
        {activeTab === 'symmetric'  && <SymmetricDemo />}
        {activeTab === 'asymmetric' && <AsymmetricDemo />}
        {activeTab === 'about'      && <AboutPage />}
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="project-footer">
        <div className="project-footer-inner">
          <span>Daddy Omar Jeng &nbsp;·&nbsp; <a href="https://www.daddyomarjeng.com" target="_blank" rel="noopener noreferrer" className="footer-link">www.daddyomarjeng.com</a></span>
          <span className="project-footer-sep">|</span>
          <span>Open Source · MIT License</span>
          <span className="project-footer-sep">|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Shield size={13} /> All operations run locally in your browser
          </span>
        </div>
      </footer>
    </div>
  );
}
