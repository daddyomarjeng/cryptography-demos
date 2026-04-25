import { useState } from 'react';
import { Database, AlertTriangle, CheckCircle } from 'lucide-react';

// Simulated database of users
const DB_USERS = [
  { id: 1, username: 'alice', password: 'secret123', role: 'admin', email: 'alice@example.com' },
  { id: 2, username: 'bob',   password: 'pass456',   role: 'user',  email: 'bob@example.com' },
  { id: 3, username: 'carol', password: 'carol789',  role: 'user',  email: 'carol@example.com' },
];

function simulateVulnerableQuery(username, password) {
  const rawSQL = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  // Simulate SQL injection
  const lower = rawSQL.toLowerCase();
  const isInjected = lower.includes("' or '") || lower.includes("'or'") ||
    lower.includes("' or 1") || lower.includes("--") || lower.includes("1=1") || lower.includes("/*");
  
  let results = [];
  let loggedInUser = null;

  if (isInjected) {
    // Injection bypasses auth — return all users or first user
    if (lower.includes('union') && lower.includes('select')) {
      results = DB_USERS;
    } else {
      results = [DB_USERS[0]]; // Bypass returns first user
      loggedInUser = DB_USERS[0];
    }
  } else {
    // Normal auth check
    const user = DB_USERS.find(u => u.username === username && u.password === password);
    if (user) { results = [user]; loggedInUser = user; }
  }

  return { rawSQL, results, loggedInUser, isInjected };
}

function simulateSafeQuery(username, password) {
  // Parameterized — input can never alter query structure
  const rawSQL = `SELECT * FROM users WHERE username = ? AND password = ?`;
  const params = [username, password];
  const user = DB_USERS.find(u => u.username === username && u.password === password);
  return { rawSQL, params, user, isInjected: false };
}

const INJECTION_PRESETS = [
  { label: "Classic bypass",    user: "' OR '1'='1", pass: "' OR '1'='1" },
  { label: "Admin bypass",      user: "admin'--",    pass: "anything" },
  { label: "Always-true WHERE", user: "alice",       pass: "' OR 1=1--" },
  { label: "Comment injection", user: "' OR 1=1/*",  pass: "" },
];

const SAFE_PRESETS = [
  { label: "Valid login",   user: "alice", pass: "secret123" },
  { label: "Wrong pass",    user: "alice", pass: "wrongpass" },
  { label: "Injection attempt (blocked)", user: "' OR '1'='1", pass: "' OR '1'='1" },
];

export default function SQLInjectionDemo() {
  const [username, setUsername] = useState('alice');
  const [password, setPassword] = useState('secret123');
  const [vulnResult, setVulnResult] = useState(null);
  const [safeResult, setSafeResult] = useState(null);

  function runSimulation() {
    setVulnResult(simulateVulnerableQuery(username, password));
    setSafeResult(simulateSafeQuery(username, password));
  }

  function applyPreset(p) {
    setUsername(p.user);
    setPassword(p.pass);
    setVulnResult(null);
    setSafeResult(null);
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon red"><Database size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>SQL Injection Demo</h2>
            <p>Vulnerable vs. parameterized query sandbox</p>
          </div>
        </div>

        <div className="warn-box">
          ⚠️ <strong>Educational sandbox only.</strong> This simulates SQL injection in JavaScript —
          no real database is involved. Demonstrates why parameterized queries are essential.
        </div>

        {/* Simulated DB */}
        <details style={{ marginBottom: 20 }}>
          <summary style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)', padding: '8px 0' }}>
            📋 View simulated database (users table)
          </summary>
          <div style={{ marginTop: 8, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface2)' }}>
                  {['id', 'username', 'password', 'role', 'email'].map(h => (
                    <th key={h} style={{ padding: '6px 12px', border: '1px solid var(--border)', textAlign: 'left', color: 'var(--accent)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DB_USERS.map(u => (
                  <tr key={u.id}>
                    {[u.id, u.username, u.password, u.role, u.email].map((v, i) => (
                      <td key={i} style={{ padding: '6px 12px', border: '1px solid var(--border)', fontFamily: 'monospace' }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        {/* Preset attacks */}
        <div className="form-group">
          <label>Try an Injection Payload</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {INJECTION_PRESETS.map(p => (
              <button key={p.label} className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '5px 12px', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                onClick={() => applyPreset(p)}>{p.label}</button>
            ))}
            {SAFE_PRESETS.map(p => (
              <button key={p.label} className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '5px 12px' }}
                onClick={() => applyPreset(p)}>{p.label}</button>
            ))}
          </div>
        </div>

        <div className="two-col">
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="text" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={runSimulation}>Run Simulation</button>

        {(vulnResult || safeResult) && (
          <div className="two-col" style={{ marginTop: 24 }}>
            {/* Vulnerable */}
            <div style={{ border: '1px solid rgba(248,81,73,0.4)', borderRadius: 10, padding: 16, background: 'rgba(248,81,73,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--danger)', fontWeight: 700 }}>
                <AlertTriangle size={18} /> Vulnerable (String Concatenation)
              </div>
              <div className="output-label">SQL Executed</div>
              <div className="output-box" style={{ fontSize: '0.76rem', wordBreak: 'break-all', marginBottom: 12,
                  borderColor: vulnResult?.isInjected ? 'rgba(248,81,73,0.4)' : 'var(--border)' }}>
                {vulnResult?.rawSQL}
              </div>
              {vulnResult?.isInjected && (
                <div style={{ padding: '8px 12px', borderRadius: 6, background: 'rgba(248,81,73,0.12)', border: '1px solid rgba(248,81,73,0.3)', fontSize: '0.8rem', marginBottom: 10, color: 'var(--danger)', fontWeight: 600 }}>
                  💥 INJECTION DETECTED — auth bypassed!
                </div>
              )}
              <div className="output-label">Result ({vulnResult?.results.length} row{vulnResult?.results.length !== 1 ? 's' : ''})</div>
              <div className="output-box" style={{ fontSize: '0.78rem' }}>
                {vulnResult?.results.length
                  ? vulnResult.results.map(u => `✓ Logged in as: ${u.username} [${u.role}]`).join('\n')
                  : '✗ No user found — login rejected'}
              </div>
            </div>

            {/* Safe */}
            <div style={{ border: '1px solid rgba(63,185,80,0.4)', borderRadius: 10, padding: 16, background: 'rgba(63,185,80,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--accent2)', fontWeight: 700 }}>
                <CheckCircle size={18} /> Parameterized Query (Safe)
              </div>
              <div className="output-label">SQL Template</div>
              <div className="output-box" style={{ fontSize: '0.76rem', marginBottom: 12 }}>{safeResult?.rawSQL}</div>
              <div className="output-label">Bound Parameters</div>
              <div className="output-box" style={{ fontSize: '0.76rem', marginBottom: 12 }}>
                {`$1 = ${JSON.stringify(safeResult?.params[0])}\n$2 = ${JSON.stringify(safeResult?.params[1])}`}
              </div>
              <div className="output-label">Result</div>
              <div className="output-box" style={{ fontSize: '0.78rem' }}>
                {safeResult?.user
                  ? `✓ Logged in as: ${safeResult.user.username} [${safeResult.user.role}]`
                  : '✗ No user found — login rejected'}
              </div>
              <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 6, background: 'rgba(63,185,80,0.1)', border: '1px solid rgba(63,185,80,0.3)', fontSize: '0.78rem', color: 'var(--accent2)' }}>
                ✅ Input is treated as data, never part of the SQL structure.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
