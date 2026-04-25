import { useState } from 'react';
import { Code2, ArrowRight } from 'lucide-react';

function safeBase64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function safeBase64Decode(str) {
  try { return decodeURIComponent(escape(atob(str))); } catch { return 'Invalid Base64'; }
}
function toHex(str) {
  return Array.from(new TextEncoder().encode(str)).map(b => b.toString(16).padStart(2, '0')).join(' ');
}
function fromHex(str) {
  try {
    const bytes = str.trim().split(/\s+/).map(h => parseInt(h, 16));
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch { return 'Invalid Hex'; }
}

const SCHEMES = [
  {
    id: 'base64',
    label: 'Base64',
    desc: 'Encodes binary/text as printable ASCII (A–Z, a–z, 0–9, +, /). Used in emails, data URLs, JWTs.',
    encode: safeBase64Encode,
    decode: safeBase64Decode,
  },
  {
    id: 'hex',
    label: 'Hexadecimal',
    desc: 'Represents each byte as two hex digits (00–FF). Common in cryptographic digests and binary data.',
    encode: toHex,
    decode: fromHex,
  },
  {
    id: 'url',
    label: 'URL Encoding',
    desc: 'Encodes special characters as %XX sequences so they can be safely included in URLs.',
    encode: encodeURIComponent,
    decode: (s) => { try { return decodeURIComponent(s); } catch { return 'Invalid URL encoding'; } },
  },
  {
    id: 'binary',
    label: 'Binary',
    desc: 'Converts each character to its 8-bit binary representation. Educational view of raw bits.',
    encode: str => Array.from(new TextEncoder().encode(str)).map(b => b.toString(2).padStart(8, '0')).join(' '),
    decode: str => {
      try {
        const bytes = str.trim().split(/\s+/).map(b => parseInt(b, 2));
        return new TextDecoder().decode(new Uint8Array(bytes));
      } catch { return 'Invalid binary'; }
    },
  },
];

export default function EncodingPlaygroundDemo() {
  const [activeScheme, setActiveScheme] = useState('base64');
  const [input, setInput]   = useState('Hello, World! 🔐');
  const [decodeInput, setDecodeInput] = useState('');

  const scheme = SCHEMES.find(s => s.id === activeScheme);
  const encoded = scheme ? scheme.encode(input) : '';
  const decoded = scheme && decodeInput.trim() ? scheme.decode(decodeInput) : '';

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon blue"><Code2 size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Encoding Playground</h2>
            <p>Base64 · Hex · URL · Binary</p>
          </div>
        </div>

        <div className="info-box">
          <strong>Encoding</strong> transforms data into a different representation — it is <em>not</em> encryption.
          Encoded data can always be reversed without a key. Encoding ensures safe transmission of binary data
          over text-based channels.
        </div>

        <div className="btn-group" style={{ marginBottom: 20 }}>
          {SCHEMES.map(s => (
            <button
              key={s.id}
              className={`btn ${activeScheme === s.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveScheme(s.id)}
            >{s.label}</button>
          ))}
        </div>

        {scheme && (
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {scheme.desc}
          </div>
        )}

        {/* Encode */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Plain Text</label>
              <textarea value={input} onChange={e => setInput(e.target.value)} rows={3} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: 28 }}>
            <ArrowRight size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ flex: 2, minWidth: 240 }}>
            <div className="output-label">Encoded Output</div>
            <div className="output-box" style={{ minHeight: 72, fontSize: '0.78rem' }}>{encoded}</div>
          </div>
        </div>

        {/* Decode */}
        <hr className="divider" />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: 240 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Encoded Input (to decode)</label>
              <textarea
                value={decodeInput}
                onChange={e => setDecodeInput(e.target.value)}
                rows={3}
                placeholder={`Paste ${scheme?.label} encoded string…`}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: 28 }}>
            <ArrowRight size={20} style={{ color: 'var(--accent2)' }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="output-label">Decoded Output</div>
            <div className="output-box" style={{ minHeight: 72 }}>{decoded || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Enter encoded text above…</span>}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
