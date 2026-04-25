import { useState } from 'react';
import { FileText, Key, Lock, Unlock, Zap, Shield, AlertTriangle, BookMarked } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { copyToClipboard } from '../../utils/clipboard';
import InfoIcon from '../shared/InfoIcon';

const MODES = [
  { label: 'AES-CBC', value: 'CBC', term: 'aes_cbc' },
  { label: 'AES-ECB', value: 'ECB', term: 'aes_ecb' },
  { label: 'AES-CTR', value: 'CTR', term: 'aes_ctr' },
  { label: 'Triple DES', value: 'TDES', term: 'triple_des' },
];

function encrypt(plaintext, key, mode) {
  if (mode === 'TDES') return CryptoJS.TripleDES.encrypt(plaintext, key).toString();
  const opts = {};
  if (mode === 'ECB') opts.mode = CryptoJS.mode.ECB;
  if (mode === 'CTR') opts.mode = CryptoJS.mode.CTR;
  return CryptoJS.AES.encrypt(plaintext, key, opts).toString();
}

function decrypt(ciphertext, key, mode) {
  try {
    let wordArray;
    if (mode === 'TDES') {
      wordArray = CryptoJS.TripleDES.decrypt(ciphertext, key);
    } else {
      const opts = {};
      if (mode === 'ECB') opts.mode = CryptoJS.mode.ECB;
      if (mode === 'CTR') opts.mode = CryptoJS.mode.CTR;
      wordArray = CryptoJS.AES.decrypt(ciphertext, key, opts);
    }
    if (!wordArray || !wordArray.sigBytes || wordArray.sigBytes <= 0) return null;
    const result = wordArray.toString(CryptoJS.enc.Utf8);
    return result || null;
  } catch {
    return null;
  }
}

function OutputRow({ label, value, isError, infoTerm }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (!value) return;
    const ok = await copyToClipboard(value);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1800); }
  };
  return (
    <div className="form-group">
      <div className="output-label">
        <span>{label}{infoTerm && <InfoIcon term={infoTerm} />}</span>
        {value && !isError && (
          <button className="copy-btn" onClick={handleCopy}>{copied ? 'Copied' : 'Copy'}</button>
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
  const [encryptError, setEncryptError] = useState('');
  const [decryptError, setDecryptError] = useState('');

  const handleEncrypt = () => {
    setEncryptError('');
    if (!plaintext.trim()) { setEncryptError('Please enter a plaintext message first.'); return; }
    if (!key.trim()) { setEncryptError('Please enter a secret key.'); return; }
    try {
      const result = encrypt(plaintext, key, mode);
      setEncrypted(result);
      setDecryptInput(result);
      setDecrypted('');
    } catch (e) {
      setEncryptError('Encryption failed: ' + e.message);
    }
  };

  const handleDecrypt = () => {
    setDecryptError('');
    if (!decryptInput.trim()) { setDecryptError('Please enter a ciphertext first.'); return; }
    if (!key.trim()) { setDecryptError('Please enter the secret key.'); return; }
    const result = decrypt(decryptInput, key, mode);
    if (!result) {
      setDecryptError('Decryption failed — wrong key or corrupted ciphertext.');
      setDecrypted('');
    } else {
      setDecrypted(result);
    }
  };

  return (
    <div>
      <div className="info-box">
        <strong>Symmetric Encryption</strong>
        <InfoIcon term="symmetric" />
        {' '}uses the <strong>same key</strong>
        <InfoIcon term="secret_key" />
        {' '}to both encrypt and decrypt. Fast and efficient — ideal for large data.
        Common algorithms: <strong>AES</strong>
        <InfoIcon term="aes" />
        , Triple DES<InfoIcon term="triple_des" />.
      </div>

      {/* Flow Diagram */}
      <div className="flow-diagram">
        <div className="flow-node">
          <FileText size={20} strokeWidth={1.5} style={{ margin: '0 auto 4px' }} />
          <span>Plaintext</span>
        </div>
        <div className="flow-arrow">→</div>
        <div className="flow-node">
          <Key size={20} strokeWidth={1.5} style={{ margin: '0 auto 4px' }} />
          <span>Secret Key</span>
        </div>
        <div className="flow-arrow">→</div>
        <div className="flow-node">
          <Lock size={20} strokeWidth={1.5} style={{ margin: '0 auto 4px' }} />
          <span>Ciphertext</span>
        </div>
        <div className="flow-arrow">→</div>
        <div className="flow-node">
          <Key size={20} strokeWidth={1.5} style={{ margin: '0 auto 4px' }} />
          <span>Same Key</span>
        </div>
        <div className="flow-arrow">→</div>
        <div className="flow-node">
          <FileText size={20} strokeWidth={1.5} style={{ margin: '0 auto 4px' }} />
          <span>Plaintext</span>
        </div>
      </div>

      {/* Algorithm Selector */}
      <div className="form-group">
        <label>Algorithm <InfoIcon term="aes" /></label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {MODES.map(m => (
            <span key={m.value} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <button
                className={`btn ${mode === m.value ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => { setMode(m.value); setEncrypted(''); setDecrypted(''); setEncryptError(''); setDecryptError(''); }}
              >
                {m.label}
              </button>
              <InfoIcon term={m.term} />
            </span>
          ))}
        </div>
      </div>

      <div className="two-col">
        {/* Encrypt Panel */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon blue"><Lock size={18} strokeWidth={2} /></div>
            <div className="card-title">
              <h2>Encrypt <InfoIcon term="encryption" /></h2>
              <p>Plaintext → Ciphertext</p>
            </div>
          </div>
          <div className="form-group">
            <label>Plaintext Message <InfoIcon term="plaintext" /></label>
            <textarea value={plaintext} onChange={e => setPlaintext(e.target.value)} placeholder="Enter text to encrypt…" />
          </div>
          <div className="form-group">
            <label>Secret Key <InfoIcon term="secret_key" /></label>
            <input type="text" value={key} onChange={e => setKey(e.target.value)} placeholder="Enter secret key…" />
          </div>
          <button className="btn btn-primary" onClick={handleEncrypt}>
            <Lock size={14} /> Encrypt
          </button>
          {encryptError && (
            <div className="output-box error-text" style={{ marginTop: 12 }}>⚠ {encryptError}</div>
          )}
          <hr className="divider" />
          <OutputRow label="Encrypted Output (Base64)" infoTerm="base64" value={encrypted} />
        </div>

        {/* Decrypt Panel */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon green"><Unlock size={18} strokeWidth={2} /></div>
            <div className="card-title">
              <h2>Decrypt <InfoIcon term="decryption" /></h2>
              <p>Ciphertext → Plaintext</p>
            </div>
          </div>
          <div className="form-group">
            <label>Ciphertext (Base64) <InfoIcon term="ciphertext" /></label>
            <textarea value={decryptInput} onChange={e => setDecryptInput(e.target.value)} placeholder="Paste encrypted text here…" />
          </div>
          <div className="form-group">
            <label>Secret Key (must match) <InfoIcon term="secret_key" /></label>
            <input type="text" value={key} onChange={e => setKey(e.target.value)} placeholder="Enter secret key…" />
          </div>
          <button className="btn btn-success" onClick={handleDecrypt}>
            <Unlock size={14} /> Decrypt
          </button>
          {decryptError && (
            <div className="output-box error-text" style={{ marginTop: 12 }}>⚠ {decryptError}</div>
          )}
          <hr className="divider" />
          <OutputRow label="Decrypted Output" infoTerm="plaintext" value={decrypted} isError={!decrypted && !!decryptError} />
        </div>
      </div>

      {/* How it works */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon orange"><BookMarked size={18} strokeWidth={2} /></div>
          <div className="card-title"><h2>How Symmetric Encryption Works</h2></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16 }}>
          {[
            { Icon: Key,           title: 'Single Key',       term: 'secret_key', desc: 'One key is used for both encryption and decryption. Both parties must share this key securely.' },
            { Icon: Zap,           title: 'Fast Performance', term: null,          desc: 'Much faster than asymmetric encryption. Ideal for encrypting large amounts of data in bulk.' },
            { Icon: Shield,        title: 'AES Standard',     term: 'aes',         desc: 'Advanced Encryption Standard (AES) is the gold standard. Used by governments and militaries worldwide.' },
            { Icon: AlertTriangle, title: 'Key Distribution', term: 'key_exchange', desc: 'The main challenge: securely sharing the secret key with the other party without interception.' },
          ].map(({ Icon, title, term, desc }) => (
            <div key={title} style={{ padding: 16, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ marginBottom: 10 }}><Icon size={22} strokeWidth={1.5} style={{ color: 'var(--accent)' }} /></div>
              <strong style={{ color: 'var(--text)' }}>{title}{term && <InfoIcon term={term} />}</strong>
              <p style={{ marginTop: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
