import { useState } from 'react';
import { Globe, CheckCircle, XCircle } from 'lucide-react';

const ORIGINS = ['https://app.example.com', 'https://evil.com', 'http://localhost:3000', 'https://api.partner.org'];

const CSP_DIRECTIVES = [
  { key: 'default-src', label: 'default-src', hint: "Fallback for all resource types. Use 'self' to allow only same-origin." },
  { key: 'script-src', label: 'script-src', hint: "Controls JavaScript sources. Avoid 'unsafe-inline'." },
  { key: 'style-src', label: 'style-src', hint: "Controls CSS sources." },
  { key: 'img-src', label: 'img-src', hint: "Controls image sources. 'data:' allows inline images." },
  { key: 'connect-src', label: 'connect-src', hint: "Controls fetch/XHR/WebSocket endpoints." },
  { key: 'frame-src', label: 'frame-src', hint: "Controls allowed iframe sources." },
];

const CSP_VALUES = ["'self'", "'none'", "'unsafe-inline'", "'unsafe-eval'", 'data:', 'https:', '*', 'https://cdn.example.com'];

function evaluateCORS(allowedOrigins, methods, credentials, requestOrigin, requestMethod) {
  const originAllowed = allowedOrigins.includes('*') || allowedOrigins.includes(requestOrigin);
  const methodAllowed = methods.includes(requestMethod);
  const credentialConflict = credentials && allowedOrigins.includes('*');

  if (credentialConflict) return { allowed: false, reason: 'Cannot use credentials with wildcard (*) origin.' };
  if (!originAllowed) return { allowed: false, reason: `Origin "${requestOrigin}" is not in the allowed list.` };
  if (!methodAllowed) return { allowed: false, reason: `Method "${requestMethod}" is not allowed by Access-Control-Allow-Methods.` };
  return { allowed: true, reason: 'All CORS checks passed — request would succeed.' };
}

export default function CORSCSPDemo() {
  const [tab, setTab] = useState('cors');

  // CORS state
  const [allowedOrigins, setAllowedOrigins] = useState(['https://app.example.com']);
  const [allowedMethods, setAllowedMethods] = useState(['GET', 'POST']);
  const [credentials, setCredentials] = useState(false);
  const [reqOrigin, setReqOrigin] = useState(ORIGINS[0]);
  const [reqMethod, setReqMethod] = useState('GET');
  const [corsResult, setCorsResult] = useState(null);

  // CSP state
  const [cspRules, setCspRules] = useState({ 'default-src': "'self'", 'script-src': "'self'", 'style-src': "'self'" });

  function toggleOrigin(o) {
    setAllowedOrigins(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);
    setCorsResult(null);
  }
  function toggleMethod(m) {
    setAllowedMethods(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
    setCorsResult(null);
  }

  function simulate() {
    setCorsResult(evaluateCORS(allowedOrigins, allowedMethods, credentials, reqOrigin, reqMethod));
  }

  function updateCSP(directive, value) {
    setCspRules(prev => {
      if (!value) { const n = { ...prev }; delete n[directive]; return n; }
      return { ...prev, [directive]: value };
    });
  }

  const cspHeader = Object.entries(cspRules).map(([k, v]) => `${k} ${v}`).join('; ');
  const cspRisk = cspHeader.includes("'unsafe-inline'") || cspHeader.includes("'unsafe-eval'") || cspHeader.includes('*');

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon green"><Globe size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>CORS & CSP Simulator</h2>
            <p>Visualize browser security policies interactively</p>
          </div>
        </div>

        <div className="btn-group" style={{ marginBottom: 20 }}>
          <button className={`btn ${tab === 'cors' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('cors')}>CORS Simulator</button>
          <button className={`btn ${tab === 'csp' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('csp')}>CSP Builder</button>
        </div>

        {tab === 'cors' && (
          <>
            <div className="info-box">
              <strong>CORS (Cross-Origin Resource Sharing)</strong> is a browser mechanism that restricts which origins
              can access a server's resources. The server sets response headers; the browser enforces the policy.
            </div>

            <div className="two-col">
              <div>
                <div className="output-label">Server: Allowed Origins</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {ORIGINS.map(o => (
                    <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input type="checkbox" checked={allowedOrigins.includes(o)} onChange={() => toggleOrigin(o)} />
                      <code style={{ fontSize: '0.78rem' }}>{o}</code>
                    </label>
                  ))}
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={allowedOrigins.includes('*')} onChange={() => toggleOrigin('*')} />
                    <code style={{ fontSize: '0.78rem' }}>* (wildcard — all origins)</code>
                  </label>
                </div>

                <div className="output-label">Allowed Methods</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {['GET','POST','PUT','PATCH','DELETE','OPTIONS'].map(m => (
                    <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.82rem' }}>
                      <input type="checkbox" checked={allowedMethods.includes(m)} onChange={() => toggleMethod(m)} />
                      {m}
                    </label>
                  ))}
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={credentials} onChange={e => setCredentials(e.target.checked)} />
                  Access-Control-Allow-Credentials: true
                </label>
              </div>

              <div>
                <div className="output-label">Browser: Simulated Request</div>
                <div className="form-group">
                  <label>Request Origin</label>
                  <select value={reqOrigin} onChange={e => setReqOrigin(e.target.value)}>
                    {ORIGINS.map(o => <option key={o}>{o}</option>)}
                    <option value="https://unknown-site.net">https://unknown-site.net</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>HTTP Method</label>
                  <select value={reqMethod} onChange={e => setReqMethod(e.target.value)}>
                    {['GET','POST','PUT','PATCH','DELETE'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={simulate}>Simulate Request</button>

                {corsResult && (
                  <div style={{ marginTop: 14, padding: 14, borderRadius: 8, border: `1px solid ${corsResult.allowed ? 'rgba(63,185,80,0.35)' : 'rgba(248,81,73,0.35)'}`, background: corsResult.allowed ? 'rgba(63,185,80,0.07)' : 'rgba(248,81,73,0.07)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {corsResult.allowed ? <CheckCircle size={18} style={{ color: 'var(--accent2)' }} /> : <XCircle size={18} style={{ color: 'var(--danger)' }} />}
                      <strong style={{ color: corsResult.allowed ? 'var(--accent2)' : 'var(--danger)' }}>
                        {corsResult.allowed ? 'Request Allowed ✓' : 'Request Blocked ✗'}
                      </strong>
                    </div>
                    <div style={{ marginTop: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{corsResult.reason}</div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div className="output-label">Generated Response Headers</div>
              <div className="output-box" style={{ fontSize: '0.8rem', lineHeight: 2 }}>
                {`Access-Control-Allow-Origin: ${allowedOrigins.join(', ') || '(none)'}\nAccess-Control-Allow-Methods: ${allowedMethods.join(', ') || '(none)'}\nAccess-Control-Allow-Credentials: ${credentials}`}
              </div>
            </div>
          </>
        )}

        {tab === 'csp' && (
          <>
            <div className="info-box">
              <strong>CSP (Content Security Policy)</strong> is an HTTP header that tells the browser which sources
              are trusted for scripts, styles, images, etc. It is a key defence against XSS attacks.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {CSP_DIRECTIVES.map(d => (
                <div key={d.key} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, alignItems: 'start' }}>
                  <div>
                    <code style={{ fontSize: '0.82rem', color: 'var(--accent)' }}>{d.label}</code>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{d.hint}</div>
                  </div>
                  <select
                    value={cspRules[d.key] || ''}
                    onChange={e => updateCSP(d.key, e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 6, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.83rem' }}
                  >
                    <option value="">(omit directive)</option>
                    {CSP_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div className="output-label">Generated CSP Header</div>
            <div className="output-box" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
              Content-Security-Policy: {cspHeader || '(empty — no directives set)'}
            </div>

            {cspRisk && (
              <div className="warn-box" style={{ marginTop: 14 }}>
                ⚠️ <strong>Weak Policy Detected.</strong> Your CSP contains <code>'unsafe-inline'</code>, <code>'unsafe-eval'</code>, or a wildcard (<code>*</code>).
                These significantly weaken XSS protection.
              </div>
            )}
            {!cspRisk && cspHeader && (
              <div className="info-box" style={{ marginTop: 14, borderColor: 'rgba(63,185,80,0.3)', background: 'rgba(63,185,80,0.07)' }}>
                ✅ <strong>Strong Policy.</strong> No unsafe directives detected.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
