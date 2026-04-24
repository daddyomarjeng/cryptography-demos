import { useState } from 'react';
import './App.css';
import SymmetricDemo from './components/symmetric/SymmetricDemo';
import AsymmetricDemo from './components/asymmetric/AsymmetricDemo';

const TABS = [
  { id: 'symmetric', label: 'Symmetric Encryption', icon: '🔑' },
  { id: 'asymmetric', label: 'Asymmetric Encryption', icon: '🔐' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('symmetric');

  return (
    <div className="app">
      <header className="header">
        <div className="header-badge">🛡️ CyberSec Demos</div>
        <h1>Cryptography Playground</h1>
        <p>Interactive demos of symmetric and asymmetric encryption. See how encryption protects your data in real time.</p>
      </header>

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

      <main>
        {activeTab === 'symmetric' && <SymmetricDemo />}
        {activeTab === 'asymmetric' && <AsymmetricDemo />}
      </main>

      <footer style={{ textAlign: 'center', padding: '32px 0 16px', color: 'var(--text-muted)', fontSize: '0.82rem', borderTop: '1px solid var(--border)', marginTop: 40 }}>
        🛡️ CyberSec Demos &nbsp;·&nbsp; Cryptography Module &nbsp;·&nbsp; All operations run locally in your browser
      </footer>
    </div>
  );
}
