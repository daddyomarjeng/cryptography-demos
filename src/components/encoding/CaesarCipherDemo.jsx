import { useState } from 'react';
import { AlignLeft } from 'lucide-react';

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function caesarShift(text, shift, decrypt = false) {
  const s = ((decrypt ? -shift : shift) % 26 + 26) % 26;
  return text.split('').map(ch => {
    const upper = ch.toUpperCase();
    const idx = ALPHA.indexOf(upper);
    if (idx === -1) return ch;
    const shifted = ALPHA[(idx + s) % 26];
    return ch === upper ? shifted : shifted.toLowerCase();
  }).join('');
}

function rot13(text) {
  return caesarShift(text, 13);
}

function frequencyAnalysis(text) {
  const counts = {};
  for (const ch of text.toUpperCase()) {
    if (/[A-Z]/.test(ch)) counts[ch] = (counts[ch] || 0) + 1;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return ALPHA.split('').map(ch => ({ ch, pct: total ? Math.round(((counts[ch] || 0) / total) * 100) : 0 }));
}

export default function CaesarCipherDemo() {
  const [mode, setMode]     = useState('caesar');
  const [input, setInput]   = useState('The quick brown fox jumps over the lazy dog');
  const [shift, setShift]   = useState(3);

  const encrypted = mode === 'rot13' ? rot13(input) : caesarShift(input, shift);
  const decrypted = mode === 'rot13' ? rot13(encrypted) : caesarShift(encrypted, shift, true);
  const freq      = frequencyAnalysis(encrypted);
  const maxFreq   = Math.max(...freq.map(f => f.pct), 1);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon orange"><AlignLeft size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Caesar Cipher & ROT13</h2>
            <p>Classical substitution cipher</p>
          </div>
        </div>

        <div className="info-box">
          The <strong>Caesar cipher</strong> shifts each letter by a fixed number of positions in the alphabet.
          Used by Julius Caesar with a shift of 3. <strong>ROT13</strong> is a special case (shift = 13) that
          is its own inverse. Both are trivially breakable by frequency analysis.
        </div>

        <div className="btn-group" style={{ marginBottom: 20 }}>
          <button className={`btn ${mode === 'caesar' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setMode('caesar')}>Caesar Cipher</button>
          <button className={`btn ${mode === 'rot13'  ? 'btn-primary' : 'btn-outline'}`} onClick={() => setMode('rot13')}>ROT13</button>
        </div>

        {mode === 'caesar' && (
          <div className="form-group">
            <label>Shift: <strong style={{ color: 'var(--accent)' }}>{shift}</strong> positions</label>
            <input
              type="range" min={1} max={25} value={shift}
              onChange={e => setShift(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>
        )}

        <div className="form-group">
          <label>Plaintext</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={3} />
        </div>

        <div className="two-col">
          <div>
            <div className="output-label">Ciphertext</div>
            <div className="output-box">{encrypted}</div>
          </div>
          <div>
            <div className="output-label">Decrypted Back</div>
            <div className="output-box">{decrypted}</div>
          </div>
        </div>

        {/* Alphabet shift visual */}
        <div style={{ marginTop: 20 }}>
          <div className="output-label">Alphabet Mapping</div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', gap: 4, minWidth: 'max-content', marginBottom: 4 }}>
              {ALPHA.split('').map(ch => (
                <div key={ch} style={{ width: 26, textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ch}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 4, minWidth: 'max-content' }}>
              {ALPHA.split('').map((ch, i) => {
                const s = mode === 'rot13' ? 13 : shift;
                const mapped = ALPHA[(i + s) % 26];
                return (
                  <div key={ch} style={{
                    width: 26, textAlign: 'center', fontSize: '0.72rem', fontWeight: 700,
                    color: 'var(--accent)', background: 'rgba(88,166,255,0.1)',
                    borderRadius: 4, padding: '2px 0',
                  }}>{mapped}</div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Frequency Analysis */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon red"><AlignLeft size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Frequency Analysis</h2>
            <p>Why classical ciphers are weak</p>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
          Letter frequency in the ciphertext mirrors the plaintext. An attacker maps the most-common
          ciphertext letter (likely 'E') to crack the shift without knowing it.
        </p>
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 80 }}>
          {freq.map(({ ch, pct }) => (
            <div key={ch} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%', background: 'var(--accent)',
                height: `${(pct / maxFreq) * 64}px`, borderRadius: '2px 2px 0 0',
                minHeight: pct > 0 ? 2 : 0, transition: 'height 0.3s',
              }} />
              <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: 2 }}>{ch}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
