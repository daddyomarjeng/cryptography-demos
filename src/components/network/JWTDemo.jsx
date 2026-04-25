import { useState } from 'react';
import { SignJWT, jwtVerify, decodeJwt, importJWK } from 'jose';
import { FileKey, CheckCircle, XCircle, Eye } from 'lucide-react';

const PRESETS = [
  { label: 'User Auth', payload: { sub: '1234567890', name: 'Omar Jeng', role: 'admin', iat: Math.floor(Date.now()/1000) } },
  { label: 'API Token', payload: { client_id: 'app-001', scope: 'read write', exp: Math.floor(Date.now()/1000) + 3600 } },
  { label: 'Minimal',   payload: { sub: 'user42', iat: Math.floor(Date.now()/1000) } },
];

function b64url(str) { return btoa(str).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function parseJWTManual(token) {
  try {
    const [h, p] = token.split('.');
    return {
      header:  JSON.parse(atob(h.replace(/-/g,'+').replace(/_/g,'/'))),
      payload: JSON.parse(atob(p.replace(/-/g,'+').replace(/_/g,'/'))),
    };
  } catch { return null; }
}

export default function JWTDemo() {
  const [secret, setSecret]   = useState('my-256-bit-secret');
  const [payloadStr, setPayloadStr] = useState(JSON.stringify(PRESETS[0].payload, null, 2));
  const [token, setToken]     = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab]         = useState('sign');

  async function signToken() {
    setLoading(true);
    try {
      const payload = JSON.parse(payloadStr);
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
      const signed = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .sign(key);
      setToken(signed);
    } catch (e) {
      setToken('Error: ' + e.message);
    }
    setLoading(false);
  }

  async function verifyJWT() {
    setVerifyResult(null);
    try {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
      const { payload } = await jwtVerify(verifyToken, key);
      setVerifyResult({ ok: true, payload });
    } catch (e) {
      setVerifyResult({ ok: false, error: e.message });
    }
  }

  const parsed = token ? parseJWTManual(token) : null;
  const parts  = token ? token.split('.') : [];

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon blue"><FileKey size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>JWT — JSON Web Tokens</h2>
            <p>Sign, inspect, and verify HS256 tokens</p>
          </div>
        </div>

        <div className="info-box">
          A <strong>JWT</strong> is a compact, self-contained token with three Base64URL-encoded parts:
          <strong> Header</strong> (algorithm), <strong>Payload</strong> (claims), and <strong>Signature</strong>.
          The signature is an HMAC over the header + payload using the secret key.
        </div>

        <div className="btn-group" style={{ marginBottom: 20 }}>
          <button className={`btn ${tab === 'sign'   ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('sign')}>Sign Token</button>
          <button className={`btn ${tab === 'verify' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('verify')}>Verify Token</button>
          <button className={`btn ${tab === 'decode' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('decode')}><Eye size={14} /> Decode</button>
        </div>

        {tab === 'sign' && (
          <>
            <div className="form-group">
              <label>Quick Presets</label>
              <div className="btn-group">
                {PRESETS.map(p => (
                  <button key={p.label} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                    onClick={() => setPayloadStr(JSON.stringify(p.payload, null, 2))}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Secret Key (HMAC-SHA256)</label>
              <input type="text" value={secret} onChange={e => setSecret(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Payload (JSON)</label>
              <textarea value={payloadStr} onChange={e => setPayloadStr(e.target.value)} rows={6} />
            </div>
            <button className="btn btn-primary" onClick={signToken} disabled={loading}>
              <FileKey size={15} /> {loading ? 'Signing…' : 'Sign JWT'}
            </button>

            {token && (
              <div style={{ marginTop: 20 }}>
                <div className="output-label">JWT Token</div>
                <div className="output-box" style={{ fontSize: '0.73rem', lineHeight: 1.8 }}>
                  <span style={{ color: '#ff6e6e' }}>{parts[0]}</span>
                  <span style={{ color: 'var(--text-muted)' }}>.</span>
                  <span style={{ color: 'var(--accent)' }}>{parts[1]}</span>
                  <span style={{ color: 'var(--text-muted)' }}>.</span>
                  <span style={{ color: 'var(--accent2)' }}>{parts[2]}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, fontSize: '0.74rem', flexWrap: 'wrap' }}>
                  <span style={{ color: '#ff6e6e' }}>■ Header</span>
                  <span style={{ color: 'var(--accent)' }}>■ Payload</span>
                  <span style={{ color: 'var(--accent2)' }}>■ Signature</span>
                </div>

                {parsed && (
                  <div className="two-col" style={{ marginTop: 16 }}>
                    <div>
                      <div className="output-label">Decoded Header</div>
                      <div className="output-box" style={{ fontSize: '0.8rem' }}>{JSON.stringify(parsed.header, null, 2)}</div>
                    </div>
                    <div>
                      <div className="output-label">Decoded Payload</div>
                      <div className="output-box" style={{ fontSize: '0.8rem' }}>{JSON.stringify(parsed.payload, null, 2)}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {tab === 'verify' && (
          <>
            <div className="form-group">
              <label>Secret Key</label>
              <input type="text" value={secret} onChange={e => setSecret(e.target.value)} />
            </div>
            <div className="form-group">
              <label>JWT Token to Verify</label>
              <textarea value={verifyToken} onChange={e => setVerifyToken(e.target.value)} rows={4} placeholder="Paste JWT here…" />
            </div>
            <button className="btn btn-primary" onClick={verifyJWT}>Verify</button>
            {verifyResult && (
              <div style={{ marginTop: 16, padding: 16, borderRadius: 8, border: `1px solid ${verifyResult.ok ? 'rgba(63,185,80,0.35)' : 'rgba(248,81,73,0.35)'}`, background: verifyResult.ok ? 'rgba(63,185,80,0.07)' : 'rgba(248,81,73,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  {verifyResult.ok ? <CheckCircle size={20} style={{ color: 'var(--accent2)' }} /> : <XCircle size={20} style={{ color: 'var(--danger)' }} />}
                  <strong style={{ color: verifyResult.ok ? 'var(--accent2)' : 'var(--danger)' }}>
                    {verifyResult.ok ? 'Signature Valid' : 'Verification Failed'}
                  </strong>
                </div>
                {verifyResult.ok && <div className="output-box" style={{ fontSize: '0.8rem' }}>{JSON.stringify(verifyResult.payload, null, 2)}</div>}
                {!verifyResult.ok && <div style={{ fontSize: '0.82rem', color: 'var(--danger)' }}>{verifyResult.error}</div>}
              </div>
            )}
          </>
        )}

        {tab === 'decode' && (
          <>
            <div className="form-group">
              <label>JWT to Decode (no verification)</label>
              <textarea
                defaultValue=""
                onChange={e => {
                  const p = parseJWTManual(e.target.value);
                  e.target._parsed = p;
                  e.target.dispatchEvent(new Event('_update'));
                }}
                rows={4}
                placeholder="Paste any JWT (won't verify signature)…"
                ref={el => {
                  if (!el) return;
                  el.addEventListener('_update', () => {
                    const p = el._parsed;
                    const out = document.getElementById('decode-out');
                    if (out) out.textContent = p ? JSON.stringify(p, null, 2) : 'Invalid JWT format';
                  });
                }}
              />
            </div>
            <div className="output-label">Decoded (Header + Payload)</div>
            <div className="output-box" id="decode-out" style={{ fontSize: '0.8rem' }}>Paste a JWT above…</div>
          </>
        )}
      </div>
    </div>
  );
}
