import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { copyToClipboard } from '../../utils/clipboard';

const MODES = [
  { label: 'AES-CBC', value: 'CBC' },
  { label: 'AES-ECB', value: 'ECB' },
  { label: 'AES-CTR', value: 'CTR' },
  { label: 'Triple DES', value: 'TDES' },
];

function encrypt(plaintext, key, mode) {
  if (mode === 'TDES') {
    return CryptoJS.TripleDES.encrypt(plaintext, key).toString();
  }
  const opts = {};
  if (mode === 'ECB') opts.mode = CryptoJS.mode.ECB;
  if (mode === 'CTR') opts.mode = CryptoJS.mode.CTR;
  return CryptoJS.AES.encrypt(plaintext, key, opts).toString();
}

function decrypt(ciphertext, key, mode) {
  try {
    if (mode === 'TDES') {
      const bytes = CryptoJS.TripleDES.decrypt(ciphertext, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    const opts = {};
    if (mode === 'ECB') opts.mode = CryptoJS.mode.ECB;
    if (mode === 'CTR') opts.mode = CryptoJS.mode.CTR;
    const bytes = CryptoJS.AES.decrypt(ciphertext, key, opts);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
}

function OutputRow({ label, value, isError }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    const ok = await copyToClipboard(value);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1800); }
  };

  return (
    <div className="form-group">
      <div className="output-label">
        <span>{label}</span>
        {value && !isError && (
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className={`output-box ${isError ? 'error-text' : ''} ${!value ? 'muted-text' : ''}`}>
        {value || 'Result will appear here…'}
      </div>
    </div>
  );
}

export default function SymmetricDemo() {
  const [mode, setMode] = useState('CBC');
  const [plaintext, setPlaintext] = useState('Hello, World! This is a secret message.');
  const [key, setKey] = useState('my-super-secret-key-1234');
  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [decryptInput, setDecryptInput] = useState('');
  const [error, setError] = useState('');

  const handleEncrypt = () => {
    setError('');
    if (!plaintext.trim()) { setError('Please enter a plaintext message.'); return; }
    if (!key.trim()) { setError('Please enter a secret key.'); return; }
    try {
      const result = encrypt(plaintext, key, mode);
      setEncrypted(result);
      setDecryptInput(result);
      setDecrypted('');
    } catch (e) {
      setError('Encryption failed: ' + e.message);
    }
  };

  const handleDecrypt = () => {
    setError('');
    if (!decryptInput.trim()) { setError('Please enter ciphertext to decrypt.'); return; }
    if (!key.trim()) { setError('Please enter the secret key.'); return; }
    const result = decrypt(decryptInput, key, mode);
    if (!result) {
      setError('Decryption failed. Check the key and ciphertext.');
      setDecrypted('');
    } else {
      setDecrypted(result);
    }
  };

  return (
    <div>
      <div className="info-box">
        <strong>Symmetric Encryption</strong> uses the <strong>same key</strong> to both encrypt and decrypt.
        Fast and efficient — ideal for large data. Common algorithms: <strong>AES</strong>, Triple DES.
      </div>

      <div className="flow-diagram">
        <div className="flow-node"><span className="icon">📄</span><span>Plaintext</span></div>
        <div className="flow-arrow">→</div>
        <div className="flow-node"><span className="icon">🔑</span><span>Secret Key</span></div>
        <div className="flow-arrow">→</div>
        <div className="flow-node"><span className="icon">🔒</span><span>Ciphertext</span></div>
        <div className="flow-arrow">→</div>
        <div className="flow-node"><span className="icon">🔑</span><span>Same Key</span></div>
        <div className="flow-arrow">→</div>
        <div className="flow-node"><span className="icon">📄</span><span>Plaintext</span></div>
      </div>

      {/* Algorithm Selector */}
      <div className="form-group">
        <label>Algorithm</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {MODES.map(m => (
            <button
              key={m.value}
              className={`btn ${mode === m.value ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => { setMode(m.value); setEncrypted(''); setDecrypted(''); setError(''); }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="output-box error-text" style={{ marginBottom: 16 }}>⚠ {error}</div>
      )}

      <div className="two-col">
        {/* Encrypt Panel */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon blue">🔒</div>
            <div className="card-title">
              <h2>Encrypt</h2>
              <p>Plaintext → Ciphertext</p>
            </div>
          </div>

          <div className="form-group">
            <label>Plaintext Message</label>
            <textarea
              value={plaintext}
              onChange={e => setPlaintext(e.target.value)}
              placeholder="Enter text to encrypt…"
            />
          </div>

          <div className="form-group">
            <label>Secret Key</label>
            <input
              type="text"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="Enter secret key…"
            />
          </div>

          <button className="btn btn-primary" onClick={handleEncrypt}>
            🔒 Encrypt
          </button>

          <hr className="divider" />
          <OutputRow label="Encrypted Output (Base64)" value={encrypted} />
        </div>

        {/* Decrypt Panel */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon green">🔓</div>
            <div className="card-title">
              <h2>Decrypt</h2>
              <p>Ciphertext → Plaintext</p>
            </div>
          </div>

          <div className="form-group">
            <label>Ciphertext (Base64)</label>
            <textarea
              value={decryptInput}
              onChange={e => setDecryptInput(e.target.value)}
              placeholder="Paste encrypted text here…"
            />
          </div>

          <div className="form-group">
            <label>Secret Key (must match)</label>
            <input
              type="text"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="Enter secret key…"
            />
          </div>

          <button className="btn btn-success" onClick={handleDecrypt}>
            🔓 Decrypt
          </button>

          <hr className="divider" />
          <OutputRow
            label="Decrypted Output"
            value={decrypted}
            isError={!decrypted && error ? true : false}
          />
        </div>
      </div>

      {/* How it works */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon orange">📚</div>
          <div className="card-title">
            <h2>How Symmetric Encryption Works</h2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16 }}>
          {[
            { icon: '🔑', title: 'Single Key', desc: 'One key is used for both encryption and decryption. Both parties must share this key securely.' },
            { icon: '⚡', title: 'Fast Performance', desc: 'Much faster than asymmetric encryption. Ideal for encrypting large amounts of data in bulk.' },
            { icon: '🛡️', title: 'AES Standard', desc: 'Advanced Encryption Standard (AES) is the gold standard. Used by governments and militaries worldwide.' },
            { icon: '⚠️', title: 'Key Distribution', desc: 'The main challenge: securely sharing the secret key with the other party without interception.' },
          ].map(item => (
            <div key={item.title} style={{ padding: 16, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{item.icon}</div>
              <strong style={{ color: 'var(--text)' }}>{item.title}</strong>
              <p style={{ marginTop: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
