import { useState, useRef } from 'react';
import { ShieldOff, Play, Square } from 'lucide-react';

const CHARSETS = {
  digits:       { chars: '0123456789', label: 'Digits only (0–9)' },
  lower:        { chars: 'abcdefghijklmnopqrstuvwxyz', label: 'Lowercase (a–z)' },
  lowerdigits:  { chars: 'abcdefghijklmnopqrstuvwxyz0123456789', label: 'Lower + Digits' },
  mixed:        { chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', label: 'Mixed case + Digits' },
  full:         { chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*', label: 'Full (+ Symbols)' },
};

function formatSeconds(s) {
  if (s < 60) return `${s.toFixed(1)}s`;
  if (s < 3600) return `${(s / 60).toFixed(1)} min`;
  if (s < 86400) return `${(s / 3600).toFixed(1)} hr`;
  if (s < 31536000) return `${(s / 86400).toFixed(0)} days`;
  const yrs = s / 31536000;
  if (yrs < 1e6) return `${yrs.toFixed(0)} years`;
  if (yrs < 1e9) return `${(yrs / 1e6).toFixed(1)}M years`;
  return `${(yrs / 1e9).toFixed(1)}B years`;
}

function estimateCrack(length, charset, guessesPerSec) {
  const space = Math.pow(charset.length, length);
  return space / guessesPerSec;
}

const SCENARIOS = [
  { label: 'Home PC', gps: 1e9 },
  { label: 'GPU Rig', gps: 1e11 },
  { label: 'Botnet', gps: 1e13 },
];

export default function BruteForceDemo() {
  const [password, setPassword] = useState('abc');
  const [charsetKey, setCharsetKey] = useState('lower');
  const [simRunning, setSimRunning] = useState(false);
  const [simAttempts, setSimAttempts] = useState(0);
  const [simFound, setSimFound] = useState(false);
  const [simGuess, setSimGuess] = useState('');
  const intervalRef = useRef(null);

  const charset = CHARSETS[charsetKey].chars;

  function stopSim() {
    clearInterval(intervalRef.current);
    setSimRunning(false);
  }

  function startSim() {
    if (simRunning) return stopSim();
    if (password.length > 5) return;
    setSimAttempts(0);
    setSimFound(false);
    setSimGuess('');
    setSimRunning(true);

    let attempts = 0;
    const target = password;
    const chars = charset;

    // Generate all candidates up to target length (brute force order)
    function* bruteForce(maxLen) {
      for (let len = 1; len <= maxLen; len++) {
        const indices = new Array(len).fill(0);
        while (true) {
          yield indices.map(i => chars[i]).join('');
          let pos = len - 1;
          while (pos >= 0 && indices[pos] === chars.length - 1) {
            indices[pos] = 0;
            pos--;
          }
          if (pos < 0) break;
          indices[pos]++;
        }
      }
    }

    const gen = bruteForce(target.length);
    intervalRef.current = setInterval(() => {
      for (let i = 0; i < 500; i++) {
        const { value, done } = gen.next();
        if (done) { stopSim(); return; }
        attempts++;
        if (value === target) {
          setSimAttempts(attempts);
          setSimGuess(value);
          setSimFound(true);
          clearInterval(intervalRef.current);
          setSimRunning(false);
          return;
        }
      }
      setSimAttempts(attempts);
      setSimGuess(gen.next().value || '?');
    }, 16);
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon red"><ShieldOff size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Brute Force Visualizer</h2>
            <p>See how weak passwords are cracked by time & complexity</p>
          </div>
        </div>

        <div className="warn-box">
          ⚠️ <strong>Educational only.</strong> This demonstrates why short/simple passwords are dangerous.
          Never use brute-force against systems you don't own.
        </div>

        <div className="two-col">
          <div>
            <div className="form-group">
              <label>Password to Analyze</label>
              <input type="text" value={password} onChange={e => setPassword(e.target.value)} maxLength={12} />
            </div>
            <div className="form-group">
              <label>Assumed Character Set</label>
              <select value={charsetKey} onChange={e => setCharsetKey(e.target.value)}>
                {Object.entries(CHARSETS).map(([k, v]) => <option key={k} value={k}>{v.label} ({v.chars.length} chars)</option>)}
              </select>
            </div>

            <div className="output-label">Password Strength</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Length', value: password.length + ' chars' },
                { label: 'Charset size', value: charset.length },
                { label: 'Search space', value: Math.pow(charset.length, password.length).toLocaleString() + ' combinations' },
                { label: 'Entropy', value: (password.length * Math.log2(charset.length)).toFixed(1) + ' bits' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '6px 10px', background: 'var(--surface2)', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                  <code>{r.value}</code>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="output-label">Estimated Crack Time</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {SCENARIOS.map(sc => {
                const secs = estimateCrack(password.length, charset, sc.gps);
                const isWeak = secs < 3600;
                return (
                  <div key={sc.label} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${isWeak ? 'rgba(248,81,73,0.3)' : 'rgba(63,185,80,0.3)'}`, background: isWeak ? 'rgba(248,81,73,0.07)' : 'rgba(63,185,80,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.84rem' }}>{sc.label} <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>({(sc.gps / 1e9).toFixed(0)}B/s)</span></span>
                    <strong style={{ color: isWeak ? 'var(--danger)' : 'var(--accent2)', fontSize: '0.9rem' }}>{formatSeconds(secs)}</strong>
                  </div>
                );
              })}
            </div>

            <div style={{ marginBottom: 6, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Live Simulation {password.length > 5 && <span style={{ color: 'var(--danger)' }}>(max 5 chars for demo)</span>}
            </div>
            <button className={`btn ${simRunning ? 'btn-danger' : 'btn-primary'}`} onClick={startSim} disabled={password.length === 0 || password.length > 5} style={{ width: '100%', marginBottom: 12 }}>
              {simRunning ? <><Square size={14} /> Stop</> : <><Play size={14} /> Start Brute Force</>}
            </button>
            {(simAttempts > 0 || simRunning) && (
              <div style={{ padding: 14, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.83rem' }}>
                <div>Attempts: <strong>{simAttempts.toLocaleString()}</strong></div>
                <div>Current guess: <code style={{ color: 'var(--accent)' }}>{simGuess}</code></div>
                {simFound && <div style={{ marginTop: 8, color: 'var(--accent2)', fontWeight: 700 }}>✅ Password "{password}" found in {simAttempts.toLocaleString()} attempts!</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
