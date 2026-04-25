import { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import { Key, Clock, Shield } from 'lucide-react';
import InfoIcon from '../shared/InfoIcon';

const PBKDF2_ITERATIONS = [1000, 10000, 100000, 600000];

function timeSince(ms) {
  if (ms < 1) return '<1 ms';
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

export default function PasswordHashingDemo() {
  const [password, setPassword] = useState('MyP@ssw0rd!');
  const [rounds, setRounds]     = useState(10);
  const [bcryptHash, setBcryptHash] = useState('');
  const [bcryptTime, setBcryptTime] = useState(null);
  const [isHashing, setIsHashing]   = useState(false);

  const [pbkdf2Results, setPbkdf2Results] = useState([]);
  const [pbkdf2Running, setPbkdf2Running] = useState(false);

  async function runBcrypt() {
    setIsHashing(true);
    setBcryptHash('');
    setBcryptTime(null);
    const salt = await bcrypt.genSalt(rounds);
    const t0   = performance.now();
    const hash = await bcrypt.hash(password, salt);
    const t1   = performance.now();
    setBcryptHash(hash);
    setBcryptTime(t1 - t0);
    setIsHashing(false);
  }

  function runPBKDF2() {
    setPbkdf2Running(true);
    const results = PBKDF2_ITERATIONS.map(iters => {
      const t0   = performance.now();
      const hash = CryptoJS.PBKDF2(password, 'random-salt-value', {
        keySize: 256 / 32,
        iterations: iters,
      }).toString();
      const t1 = performance.now();
      return { iters, hash, ms: t1 - t0 };
    });
    setPbkdf2Results(results);
    setPbkdf2Running(false);
  }

  const [verifyPw, setVerifyPw]   = useState('');
  const [verifyRes, setVerifyRes] = useState(null);

  async function verifyBcrypt() {
    if (!bcryptHash) return;
    const ok = await bcrypt.compare(verifyPw, bcryptHash);
    setVerifyRes(ok);
  }

  return (
    <div>
      <div className="info-box">
        <strong>Password hashing</strong> is a one-way transformation designed specifically for
        storing passwords securely. Unlike fast hash functions (SHA-256), algorithms like{' '}
        <strong>bcrypt</strong>
        <InfoIcon term="bcrypt" />
        {' '}and <strong>PBKDF2</strong>
        <InfoIcon term="pbkdf2" />
        {' '}are intentionally slow and include a random <strong>salt</strong>
        <InfoIcon term="salt" />
        {' '}to defeat pre-computed (rainbow table) attacks. The cost factor can be increased
        over time to stay ahead of faster hardware.
      </div>

      {/* bcrypt */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon blue"><Key size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>bcrypt Password Hashing</h2>
            <p>Adaptive cost factor (work factor / rounds)</p>
          </div>
        </div>

        <div className="info-box">
          <strong>bcrypt</strong> is intentionally slow. The <strong>cost factor</strong> (rounds) doubles
          the computation time with each increment. This makes brute-force attacks computationally expensive
          even as hardware improves.
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="text" value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Cost Factor (rounds): <strong style={{ color: 'var(--accent)' }}>{rounds}</strong></label>
          <input
            type="range" min={4} max={14} value={rounds}
            onChange={e => setRounds(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            <span>4 (fast / insecure)</span><span>10 (recommended)</span><span>14 (slow / secure)</span>
          </div>
        </div>

        <div className="btn-group">
          <button className="btn btn-primary" onClick={runBcrypt} disabled={isHashing}>
            <Key size={15} /> {isHashing ? 'Hashing…' : 'Hash Password'}
          </button>
        </div>

        {bcryptHash && (
          <div style={{ marginTop: 20 }}>
            <div className="output-label">
              bcrypt Hash
              {bcryptTime !== null && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent)' }}>
                  <Clock size={12} /> {timeSince(bcryptTime)}
                </span>
              )}
            </div>
            <div className="output-box" style={{ fontSize: '0.78rem', wordBreak: 'break-all' }}>{bcryptHash}</div>

            <div style={{ marginTop: 16, padding: 14, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <p style={{ margin: '0 0 10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                The hash encodes the algorithm, cost factor, salt, and digest — self-contained for verification.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { label: 'Version', value: bcryptHash.slice(0, 4) },
                  { label: 'Cost', value: bcryptHash.slice(4, 7) },
                  { label: 'Salt (22 chars)', value: bcryptHash.slice(7, 29) },
                  { label: 'Hash', value: bcryptHash.slice(29) },
                ].map(p => (
                  <div key={p.label} style={{ padding: '6px 12px', background: 'var(--surface)', borderRadius: 6, border: '1px solid var(--border)', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{p.label}: </span>
                    <code style={{ color: 'var(--accent)' }}>{p.value}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Verify */}
            <div style={{ marginTop: 16 }}>
              <div className="form-group" style={{ marginBottom: 8 }}>
                <label>Verify Password</label>
                <input type="text" value={verifyPw} onChange={e => { setVerifyPw(e.target.value); setVerifyRes(null); }} placeholder="Enter password to check…" />
              </div>
              <button className="btn btn-outline" onClick={verifyBcrypt}>Verify</button>
              {verifyRes !== null && (
                <span style={{ marginLeft: 12, color: verifyRes ? 'var(--accent2)' : 'var(--danger)', fontWeight: 600, fontSize: '0.9rem' }}>
                  {verifyRes ? '✓ Match' : '✗ No match'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PBKDF2 */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon orange"><Shield size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>PBKDF2 — Iteration Comparison</h2>
            <p>Password-Based Key Derivation Function 2</p>
          </div>
        </div>

        <div className="info-box">
          <strong>PBKDF2</strong> applies a hash function many times (iterations) to stretch the password.
          More iterations = more time to compute = harder to brute force. NIST recommends ≥ 600,000 iterations
          with HMAC-SHA256 (2023).
        </div>

        <button className="btn btn-primary" onClick={runPBKDF2} disabled={pbkdf2Running} style={{ marginBottom: 16 }}>
          {pbkdf2Running ? 'Running…' : 'Run Comparison'}
        </button>

        {pbkdf2Results.map(({ iters, hash, ms }) => (
          <div key={iters} style={{ marginBottom: 12, padding: 14, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <strong style={{ color: 'var(--text)', fontSize: '0.88rem' }}>{iters.toLocaleString()} iterations</strong>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem', color: 'var(--accent)' }}>
                <Clock size={12} /> {timeSince(ms)}
              </span>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.73rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{hash}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
