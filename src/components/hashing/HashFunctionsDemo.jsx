import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Hash, Zap, Copy, Check } from 'lucide-react';

const ALGORITHMS = [
  { id: 'MD5',    label: 'MD5',    bits: 128, fn: v => CryptoJS.MD5(v).toString(),    warn: true },
  { id: 'SHA1',   label: 'SHA-1',  bits: 160, fn: v => CryptoJS.SHA1(v).toString(),   warn: true },
  { id: 'SHA256', label: 'SHA-256', bits: 256, fn: v => CryptoJS.SHA256(v).toString(), warn: false },
  { id: 'SHA512', label: 'SHA-512', bits: 512, fn: v => CryptoJS.SHA512(v).toString(), warn: false },
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button className="copy-btn" onClick={copy}>
      {copied ? <Check size={11} /> : <Copy size={11} />}
    </button>
  );
}

export default function HashFunctionsDemo() {
  const [input, setInput]       = useState('Hello, World!');
  const [avalanche, setAvalanche] = useState('Hello, World!.');

  const hashes = ALGORITHMS.map(a => ({ ...a, digest: a.fn(input) }));
  const avHashes = ALGORITHMS.map(a => ({ ...a, digest: a.fn(avalanche) }));

  function bitDiff(h1, h2) {
    let diff = 0;
    for (let i = 0; i < Math.min(h1.length, h2.length); i++) {
      const b1 = parseInt(h1[i], 16);
      const b2 = parseInt(h2[i], 16);
      diff += (b1 ^ b2).toString(2).split('1').length - 1;
    }
    return diff;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon blue"><Hash size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Hash Functions</h2>
            <p>MD5 · SHA-1 · SHA-256 · SHA-512</p>
          </div>
        </div>

        <div className="info-box">
          A <strong>hash function</strong> maps any input to a fixed-size digest. Even a tiny change in input
          produces a completely different output — this is the <strong>avalanche effect</strong>.
          MD5 and SHA-1 are cryptographically broken; prefer SHA-256 or SHA-512 for security.
        </div>

        <div className="form-group">
          <label>Input Message</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={3} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {hashes.map(({ id, label, bits, digest, warn }) => (
            <div key={id} style={{ padding: 16, background: 'var(--surface2)', borderRadius: 8, border: `1px solid ${warn ? 'rgba(248,81,73,0.25)' : 'var(--border)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <strong style={{ color: warn ? 'var(--danger)' : 'var(--accent)', fontSize: '0.9rem' }}>{label}</strong>
                <span className={`badge ${warn ? 'badge-red' : 'badge-green'}`}>{bits} bits</span>
                {warn && <span className="badge badge-red">⚠ Deprecated</span>}
              </div>
              <div className="output-label">
                Digest (hex)
                <CopyBtn text={digest} />
              </div>
              <div className="output-box" style={{ fontSize: '0.78rem' }}>{digest}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Avalanche Effect */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon orange"><Zap size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Avalanche Effect</h2>
            <p>Compare two nearly-identical inputs</p>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 16 }}>
          Even a single character difference causes ~50% of output bits to flip.
        </p>

        <div className="two-col" style={{ marginBottom: 16 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Input A</label>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Input B (slight variation)</label>
            <input type="text" value={avalanche} onChange={e => setAvalanche(e.target.value)} />
          </div>
        </div>

        {ALGORITHMS.map(({ id, label, bits }) => {
          const h1 = hashes.find(h => h.id === id)?.digest ?? '';
          const h2 = avHashes.find(h => h.id === id)?.digest ?? '';
          const diff = bitDiff(h1, h2);
          const pct  = bits > 0 ? Math.round((diff / bits) * 100) : 0;
          return (
            <div key={id} style={{ marginBottom: 12, padding: 12, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text)' }}>{label}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{diff} / {bits} bits differ ({pct}%)</span>
              </div>
              <div style={{ height: 6, background: 'var(--surface)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: pct > 40 ? 'var(--accent2)' : 'var(--warning)', borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
