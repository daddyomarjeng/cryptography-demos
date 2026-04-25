import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Fingerprint, CheckCircle, XCircle } from 'lucide-react';
import InfoIcon from '../shared/InfoIcon';

const ALGOS = [
  { id: 'HmacSHA256', label: 'HMAC-SHA256', fn: (msg, key) => CryptoJS.HmacSHA256(msg, key).toString() },
  { id: 'HmacSHA512', label: 'HMAC-SHA512', fn: (msg, key) => CryptoJS.HmacSHA512(msg, key).toString() },
  { id: 'HmacMD5',    label: 'HMAC-MD5',    fn: (msg, key) => CryptoJS.HmacMD5(msg, key).toString() },
];

export default function HMACDemo() {
  const [algo, setAlgo]       = useState('HmacSHA256');
  const [message, setMessage] = useState('Transfer $500 to Alice');
  const [secretKey, setSecretKey] = useState('my-super-secret');
  const [verifyMac, setVerifyMac] = useState('');
  const [verifyMsg, setVerifyMsg] = useState('Transfer $500 to Alice');

  const current = ALGOS.find(a => a.id === algo);
  const mac = current ? current.fn(message, secretKey) : '';

  const expectedMac = current ? current.fn(verifyMsg, secretKey) : '';
  const isValid = verifyMac.trim().toLowerCase() === expectedMac.toLowerCase();
  const hasVerify = verifyMac.trim().length > 0;

  return (
    <div>
      <div className="info-box">
        <strong>HMAC</strong>
        <InfoIcon term="hmac" />
        {' '}(Hash-based Message Authentication Code) combines a <strong>secret key</strong>
        <InfoIcon term="secret_key" />
        {' '}with a hash function to produce an authentication code. It guarantees both
        {' '}<strong>integrity</strong> (the message was not modified) and <strong>authenticity</strong>
        {' '}(the sender knows the secret). Unlike a plain hash, an attacker without the key cannot forge
        a valid MAC. Widely used in JWT tokens and API authentication.
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon green"><Fingerprint size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>HMAC — Message Authentication</h2>
            <p>Hash-based Message Authentication Code</p>
          </div>
        </div>

        <div className="info-box">
          <strong>HMAC</strong> combines a secret key with a hash function to produce an authentication code.
          It guarantees both <strong>integrity</strong> (message wasn't modified) and
          <strong> authenticity</strong> (sender knows the secret). Unlike plain hashing, an attacker
          without the key cannot forge a valid MAC.
        </div>

        <div className="form-group">
          <label>Algorithm</label>
          <div className="btn-group">
            {ALGOS.map(a => (
              <button
                key={a.id}
                className={`btn ${algo === a.id ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setAlgo(a.id)}
              >{a.label}</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} />
        </div>

        <div className="form-group">
          <label>Secret Key</label>
          <input type="text" value={secretKey} onChange={e => setSecretKey(e.target.value)} />
        </div>

        <div className="output-label">Generated MAC</div>
        <div className="output-box" style={{ marginBottom: 0 }}>{mac || '—'}</div>
      </div>

      {/* Verification */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon blue"><CheckCircle size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Verify MAC</h2>
            <p>Check if a message + MAC pair is authentic</p>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 16 }}>
          Using the same secret key above, paste a MAC to verify its authenticity. Try modifying the
          message slightly to see verification fail — demonstrating tamper detection.
        </p>

        <div className="form-group">
          <label>Message to Verify</label>
          <textarea value={verifyMsg} onChange={e => setVerifyMsg(e.target.value)} rows={2} />
        </div>

        <div className="form-group">
          <label>MAC to Check</label>
          <input
            type="text"
            value={verifyMac}
            onChange={e => setVerifyMac(e.target.value)}
            placeholder="Paste MAC here…"
          />
        </div>

        {hasVerify && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: 16,
            borderRadius: 8, border: `1px solid ${isValid ? 'rgba(63,185,80,0.35)' : 'rgba(248,81,73,0.35)'}`,
            background: isValid ? 'rgba(63,185,80,0.07)' : 'rgba(248,81,73,0.07)',
          }}>
            {isValid
              ? <CheckCircle size={22} style={{ color: 'var(--accent2)', flexShrink: 0 }} />
              : <XCircle    size={22} style={{ color: 'var(--danger)',  flexShrink: 0 }} />}
            <div>
              <strong style={{ color: isValid ? 'var(--accent2)' : 'var(--danger)', fontSize: '0.95rem' }}>
                {isValid ? 'MAC Valid — Message is authentic' : 'MAC Invalid — Message may be tampered'}
              </strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isValid
                  ? 'The MAC matches the expected value for this message and key.'
                  : 'The MAC does not match. Either the message or the key is different.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
