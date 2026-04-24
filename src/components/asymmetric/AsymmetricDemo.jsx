import { useState } from 'react';
import forge from 'node-forge';
import { copyToClipboard } from '../../utils/clipboard';
import InfoIcon from '../shared/InfoIcon';

function OutputRow({ label, value, isError, mono = true, infoTerm }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (!value) return;
    await copyToClipboard(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="form-group">
      <div className="output-label">
        <span>
          {label}
          {infoTerm && <InfoIcon term={infoTerm} />}
        </span>
        {value && !isError && (
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>
      {mono ? (
        <div className={`output-box ${isError ? 'error-text' : ''} ${!value ? 'muted-text' : ''}`}>
          {value || 'Result will appear here…'}
        </div>
      ) : (
        <div className={`key-box ${!value ? 'muted-text' : ''}`} style={{ color: value ? 'var(--warning)' : undefined }}>
          {value || 'Not generated yet…'}
        </div>
      )}
    </div>
  );
}

export default function AsymmetricDemo() {
  const [keySize, setKeySize] = useState(2048);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [generating, setGenerating] = useState(false);

  const [plaintext, setPlaintext] = useState('Hello, RSA! This is a confidential message.');
  const [encrypted, setEncrypted] = useState('');
  const [decryptInput, setDecryptInput] = useState('');
  const [decrypted, setDecrypted] = useState('');

  const [signInput, setSignInput] = useState('Sign this important document.');
  const [signature, setSignature] = useState('');
  const [verifyInput, setVerifyInput] = useState('');
  const [verifySig, setVerifySig] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  const [error, setError] = useState('');

  const handleGenerate = () => {
    setGenerating(true);
    setError('');
    setEncrypted(''); setDecrypted(''); setSignature(''); setVerifyResult(null);
    setTimeout(() => {
      try {
        const keypair = forge.pki.rsa.generateKeyPair({ bits: keySize, e: 0x10001 });
        setPublicKey(forge.pki.publicKeyToPem(keypair.publicKey));
        setPrivateKey(forge.pki.privateKeyToPem(keypair.privateKey));
      } catch (e) {
        setError('Key generation failed: ' + e.message);
      }
      setGenerating(false);
    }, 100);
  };

  const handleEncrypt = () => {
    setError('');
    if (!publicKey) { setError('Generate a key pair first.'); return; }
    if (!plaintext.trim()) { setError('Enter a message to encrypt.'); return; }
    try {
      const pub = forge.pki.publicKeyFromPem(publicKey);
      const encrypted_bytes = pub.encrypt(plaintext, 'RSA-OAEP');
      setEncrypted(forge.util.encode64(encrypted_bytes));
      setDecryptInput(forge.util.encode64(encrypted_bytes));
      setDecrypted('');
    } catch (e) {
      setError('Encryption failed: ' + e.message);
    }
  };

  const handleDecrypt = () => {
    setError('');
    if (!privateKey) { setError('Generate a key pair first.'); return; }
    if (!decryptInput.trim()) { setError('Enter ciphertext to decrypt.'); return; }
    try {
      const priv = forge.pki.privateKeyFromPem(privateKey);
      const bytes = forge.util.decode64(decryptInput);
      const result = priv.decrypt(bytes, 'RSA-OAEP');
      setDecrypted(result);
    } catch (e) {
      setError('Decryption failed: ' + e.message);
      setDecrypted('');
    }
  };

  const handleSign = () => {
    setError('');
    if (!privateKey) { setError('Generate a key pair first.'); return; }
    if (!signInput.trim()) { setError('Enter a message to sign.'); return; }
    try {
      const priv = forge.pki.privateKeyFromPem(privateKey);
      const md = forge.md.sha256.create();
      md.update(signInput, 'utf8');
      const sig = priv.sign(md);
      const b64 = forge.util.encode64(sig);
      setSignature(b64);
      setVerifyInput(signInput);
      setVerifySig(b64);
      setVerifyResult(null);
    } catch (e) {
      setError('Signing failed: ' + e.message);
    }
  };

  const handleVerify = () => {
    setError('');
    if (!publicKey) { setError('Generate a key pair first.'); return; }
    if (!verifyInput.trim() || !verifySig.trim()) { setError('Enter both message and signature.'); return; }
    try {
      const pub = forge.pki.publicKeyFromPem(publicKey);
      const md = forge.md.sha256.create();
      md.update(verifyInput, 'utf8');
      const sigBytes = forge.util.decode64(verifySig);
      const valid = pub.verify(md.digest().bytes(), sigBytes);
      setVerifyResult(valid);
    } catch {
      setVerifyResult(false);
    }
  };

  return (
    <div>
      <div className="info-box">
        <strong>Asymmetric Encryption</strong>
        <InfoIcon term="asymmetric" />
        {' '}uses a <strong>key pair</strong>
        <InfoIcon term="key_pair" />
        : a <strong>public key</strong>
        <InfoIcon term="public_key" />
        {' '}to encrypt, a <strong>private key</strong>
        <InfoIcon term="private_key" />
        {' '}to decrypt. Also enables <strong>digital signatures</strong>
        <InfoIcon term="digital_signature" />
        {' '}for authentication. Algorithm: <strong>RSA</strong>
        <InfoIcon term="rsa" />.
      </div>

      <div className="flow-diagram">
        <div className="flow-node"><span className="icon">📄</span><span>Plaintext</span></div>
        <div className="flow-arrow">→</div>
        <div className="flow-node"><span className="icon">🔓</span><span>Public Key</span></div>
        <div className="flow-arrow">→</div>
        <div className="flow-node"><span className="icon">🔒</span><span>Ciphertext</span></div>
        <div className="flow-arrow">→</div>
        <div className="flow-node"><span className="icon">🗝️</span><span>Private Key</span></div>
        <div className="flow-arrow">→</div>
        <div className="flow-node"><span className="icon">📄</span><span>Plaintext</span></div>
      </div>

      {error && (
        <div className="output-box error-text" style={{ marginBottom: 16 }}>⚠ {error}</div>
      )}

      {/* Key Generation */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon orange">🔐</div>
          <div className="card-title">
            <h2>
              Step 1 — Generate RSA
              <InfoIcon term="rsa" />
              {' '}Key Pair
              <InfoIcon term="key_pair" />
            </h2>
            <p>Creates a mathematically linked public/private key pair</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Key size
            <InfoIcon term="key_size" />:
          </span>
          {[1024, 2048, 4096].map(size => (
            <button
              key={size}
              className={`btn ${keySize === size ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setKeySize(size)}
            >
              {size} bits
            </button>
          ))}
          <span className="badge badge-orange">{keySize === 4096 ? 'Slowest' : keySize === 2048 ? 'Recommended' : 'Weak'}</span>
        </div>

        <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
          {generating ? '⏳ Generating…' : '🔐 Generate Key Pair'}
        </button>

        {(publicKey || privateKey) && (
          <>
            <hr className="divider" />
            <div className="two-col">
              <OutputRow label="🔓 Public Key (share freely)" infoTerm="public_key" value={publicKey} mono={false} />
              <OutputRow label="🗝️ Private Key (keep secret!)" infoTerm="private_key" value={privateKey} mono={false} />
            </div>
          </>
        )}
      </div>

      {/* Encrypt / Decrypt */}
      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-icon blue">🔒</div>
            <div className="card-title">
              <h2>Encrypt with Public Key <InfoIcon term="public_key" /></h2>
              <p>Anyone can encrypt using the public key</p>
            </div>
          </div>

          <div className="form-group">
            <label>
              Message to Encrypt
              <InfoIcon term="plaintext" />
            </label>
            <textarea
              value={plaintext}
              onChange={e => setPlaintext(e.target.value)}
              placeholder="Enter message…"
            />
          </div>

          <button className="btn btn-primary" onClick={handleEncrypt} disabled={!publicKey}>
            🔒 Encrypt
          </button>

          <hr className="divider" />
          <OutputRow label="Encrypted Output (RSA-OAEP, Base64)" infoTerm="rsa_oaep" value={encrypted} />
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-icon green">🔓</div>
            <div className="card-title">
              <h2>Decrypt with Private Key <InfoIcon term="private_key" /></h2>
              <p>Only the private key holder can decrypt</p>
            </div>
          </div>

          <div className="form-group">
            <label>
              Ciphertext
              <InfoIcon term="ciphertext" />
              {' '}(Base64
              <InfoIcon term="base64" />)
            </label>
            <textarea
              value={decryptInput}
              onChange={e => setDecryptInput(e.target.value)}
              placeholder="Paste encrypted text…"
            />
          </div>

          <button className="btn btn-success" onClick={handleDecrypt} disabled={!privateKey}>
            🔓 Decrypt
          </button>

          <hr className="divider" />
          <OutputRow label="Decrypted Message" infoTerm="plaintext" value={decrypted} />
        </div>
      </div>

      {/* Digital Signatures */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon red">✍️</div>
          <div className="card-title">
            <h2>Digital Signatures <InfoIcon term="digital_signature" /> (Sign &amp; Verify)</h2>
            <p>
              Prove authenticity and integrity using SHA-256
              <InfoIcon term="sha256" />
              {' '}+ RSA
              <InfoIcon term="rsa" />
            </p>
          </div>
        </div>

        <div className="two-col">
          <div>
            <div className="form-group">
              <label>Message to Sign</label>
              <textarea
                value={signInput}
                onChange={e => setSignInput(e.target.value)}
                placeholder="Enter message to sign…"
              />
            </div>
            <button className="btn btn-danger" onClick={handleSign} disabled={!privateKey}>
              ✍️ Sign with Private Key
            </button>
            <hr className="divider" />
            <OutputRow label="Digital Signature (Base64)" infoTerm="digital_signature" value={signature} />
          </div>

          <div>
            <div className="form-group">
              <label>Message to Verify</label>
              <textarea
                value={verifyInput}
                onChange={e => setVerifyInput(e.target.value)}
                placeholder="Enter original message…"
              />
            </div>
            <div className="form-group">
              <label>
                Signature
                <InfoIcon term="digital_signature" />
                {' '}(Base64
                <InfoIcon term="base64" />)
              </label>
              <textarea
                value={verifySig}
                onChange={e => setVerifySig(e.target.value)}
                placeholder="Paste signature…"
                style={{ minHeight: 60 }}
              />
            </div>
            <button className="btn btn-outline" onClick={handleVerify} disabled={!publicKey}>
              ✅ Verify with Public Key
            </button>

            {verifyResult !== null && (
              <div style={{ marginTop: 16 }}>
                <div className={`output-box ${verifyResult ? '' : 'error-text'}`} style={{ color: verifyResult ? 'var(--accent2)' : undefined }}>
                  {verifyResult
                    ? '✅ Signature is VALID — message is authentic and unmodified!'
                    : '❌ Signature is INVALID — message was tampered or wrong key used!'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon orange">📚</div>
          <div className="card-title">
            <h2>How Asymmetric Encryption Works</h2>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16 }}>
          {[
            { icon: '🔑', title: 'Key Pair', term: 'key_pair', desc: 'A mathematically linked pair: public key (shared openly) and private key (kept secret by owner).' },
            { icon: '📦', title: 'Encrypt with Public', term: 'public_key', desc: 'Anyone with your public key can encrypt a message. Only your private key can decrypt it.' },
            { icon: '✍️', title: 'Sign with Private', term: 'digital_signature', desc: 'You sign data with your private key. Anyone with your public key can verify the signature.' },
            { icon: '🐢', title: 'Slower but Safer', term: null, desc: 'Much slower than symmetric encryption. Often used to exchange a symmetric key (hybrid approach).' },
          ].map(item => (
            <div key={item.title} style={{ padding: 16, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{item.icon}</div>
              <strong style={{ color: 'var(--text)' }}>
                {item.title}
                {item.term && <InfoIcon term={item.term} />}
              </strong>
              <p style={{ marginTop: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
