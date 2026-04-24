import { useState } from 'react';
import './App.css';
import SymmetricDemo from './components/symmetric/SymmetricDemo';
import AsymmetricDemo from './components/asymmetric/AsymmetricDemo';
import AboutPage from './components/about/AboutPage';

const TABS = [
  { id: 'symmetric',  label: 'Symmetric Encryption',  icon: '🔑' },
  { id: 'asymmetric', label: 'Asymmetric Encryption', icon: '🔐' },
  { id: 'about',      label: 'About & Methods',        icon: '📖' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('symmetric');

  return (
    <div className="app">
      {/* ── UTG Academic Cover ────────────────────────────── */}
      <header className="utg-header">
        <div className="utg-top-bar">
          <div className="utg-crest">
            <span className="utg-crest-icon">🎓</span>
          </div>
          <div className="utg-institution">
            <div className="utg-uni-name">University of The Gambia</div>
            <div className="utg-programme">Faculty of Information &amp; Communication Technology</div>
            <div className="utg-programme">BSc in Information Systems</div>
          </div>
          <div className="utg-crest utg-crest-right">
            <span className="utg-crest-icon">🛡️</span>
          </div>
        </div>

        <div className="utg-divider-line" />

        <div className="utg-title-block">
          <div className="utg-module-tag">Cybersecurity — Cryptography Module</div>
          <h1 className="utg-title">Cryptography Playground</h1>
          <p className="utg-subtitle">
            An interactive demonstration of symmetric and asymmetric encryption techniques
          </p>
        </div>

        <div className="utg-meta-card">
          <div className="utg-meta-row">
            <div className="utg-meta-item">
              <span className="utg-meta-label">Student</span>
              <span className="utg-meta-value">Omar Jeng</span>
            </div>
            <div className="utg-meta-sep" />
            <div className="utg-meta-item">
              <span className="utg-meta-label">Matriculation No.</span>
              <span className="utg-meta-value">21826004</span>
            </div>
            <div className="utg-meta-sep" />
            <div className="utg-meta-item">
              <span className="utg-meta-label">Lecturer</span>
              <span className="utg-meta-value">Mr Member Hydara</span>
            </div>
            <div className="utg-meta-sep" />
            <div className="utg-meta-item">
              <span className="utg-meta-label">Academic Year</span>
              <span className="utg-meta-value">2020</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Navigation Tabs ───────────────────────────────── */}
      <div className="tabs-wrapper">
        <div className="tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
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
      <footer className="utg-footer">
        <div className="utg-footer-inner">
          <span>🎓 University of The Gambia &nbsp;·&nbsp; BSc Information Systems</span>
          <span className="utg-footer-sep">|</span>
          <span>Omar Jeng &nbsp;·&nbsp; Mat# 21826004 &nbsp;·&nbsp; 2020</span>
          <span className="utg-footer-sep">|</span>
          <span>�� All operations run locally in your browser</span>
        </div>
      </footer>
    </div>
  );
}
