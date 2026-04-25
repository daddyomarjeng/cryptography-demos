import { useState } from 'react';
import { Key } from 'lucide-react';

// Modular exponentiation: base^exp mod m
function modPow(base, exp, mod) {
  if (mod === 1n) return 0n;
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % mod;
    exp = exp >> 1n;
    base = (base * base) % mod;
  }
  return result;
}

// Small safe primes for demo
const DEMO_PRIMES = [
  { p: 23n, g: 5n,  label: 'Toy (p=23, g=5)' },
  { p: 97n, g: 5n,  label: 'Small (p=97, g=5)' },
  { p: 251n, g: 6n, label: 'Medium (p=251, g=6)' },
  { p: 2039n, g: 2n, label: 'Larger (p=2039, g=2)' },
];

export default function DiffieHellmanDemo() {
  const [preset, setPreset] = useState(0);
  const [customP, setCustomP] = useState('');
  const [customG, setCustomG] = useState('');
  const [alicePriv, setAlicePriv] = useState('6');
  const [bobPriv, setBobPriv] = useState('15');
  const [computed, setComputed] = useState(null);

  function compute() {
    try {
      let p, g;
      if (customP && customG) {
        p = BigInt(customP);
        g = BigInt(customG);
      } else {
        p = DEMO_PRIMES[preset].p;
        g = DEMO_PRIMES[preset].g;
      }
      const a = BigInt(alicePriv);
      const b = BigInt(bobPriv);

      if (a <= 1n || a >= p - 1n) throw new Error('Alice private key must be between 2 and p-2');
      if (b <= 1n || b >= p - 1n) throw new Error('Bob private key must be between 2 and p-2');

      const A = modPow(g, a, p);   // Alice's public key
      const B = modPow(g, b, p);   // Bob's public key
      const sharedAlice = modPow(B, a, p);  // Alice computes shared secret
      const sharedBob   = modPow(A, b, p);  // Bob computes shared secret

      setComputed({ p, g, a, b, A, B, sharedAlice, sharedBob, match: sharedAlice === sharedBob });
    } catch (e) {
      setComputed({ error: e.message });
    }
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon purple"><Key size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Diffie-Hellman Key Exchange</h2>
            <p>Interactive step-by-step key agreement protocol</p>
          </div>
        </div>

        <div className="info-box">
          <strong>Diffie-Hellman</strong> allows two parties to establish a shared secret over an insecure channel
          without ever transmitting it. An eavesdropper sees only the public values (<em>g, p, A, B</em>)
          but computing the private keys would require solving the <strong>Discrete Logarithm Problem</strong>.
        </div>

        <div className="form-group">
          <label>Preset Parameters</label>
          <div className="btn-group" style={{ flexWrap: 'wrap' }}>
            {DEMO_PRIMES.map((d, i) => (
              <button key={i} className={`btn ${preset === i ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: '0.8rem' }}
                onClick={() => { setPreset(i); setCustomP(''); setCustomG(''); }}>{d.label}</button>
            ))}
          </div>
        </div>

        <div className="two-col">
          <div className="form-group">
            <label>Custom Prime (p)</label>
            <input type="number" value={customP} onChange={e => setCustomP(e.target.value)} placeholder={String(DEMO_PRIMES[preset].p)} />
          </div>
          <div className="form-group">
            <label>Custom Generator (g)</label>
            <input type="number" value={customG} onChange={e => setCustomG(e.target.value)} placeholder={String(DEMO_PRIMES[preset].g)} />
          </div>
        </div>

        <div className="two-col">
          <div className="form-group">
            <label>Alice's Private Key (a)</label>
            <input type="number" value={alicePriv} onChange={e => setAlicePriv(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Bob's Private Key (b)</label>
            <input type="number" value={bobPriv} onChange={e => setBobPriv(e.target.value)} />
          </div>
        </div>

        <button className="btn btn-primary" onClick={compute}>Compute Key Exchange</button>

        {computed?.error && (
          <div className="warn-box" style={{ marginTop: 16 }}>⚠️ {computed.error}</div>
        )}

        {computed && !computed.error && (
          <div style={{ marginTop: 20 }}>
            {/* Public Parameters */}
            <div className="output-label">Step 1 — Agree on public parameters (known to everyone)</div>
            <div className="two-col" style={{ marginBottom: 16 }}>
              <div className="output-box" style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Prime modulus</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>p = {String(computed.p)}</div>
              </div>
              <div className="output-box" style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Generator</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>g = {String(computed.g)}</div>
              </div>
            </div>

            {/* Private keys */}
            <div className="output-label">Step 2 — Each party picks a private key (secret)</div>
            <div className="two-col" style={{ marginBottom: 16 }}>
              <div className="output-box" style={{ borderColor: 'rgba(88,166,255,0.3)', background: 'rgba(88,166,255,0.05)', textAlign: 'center' }}>
                <div style={{ color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 600 }}>Alice's SECRET</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>a = {String(computed.a)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Never transmitted</div>
              </div>
              <div className="output-box" style={{ borderColor: 'rgba(63,185,80,0.3)', background: 'rgba(63,185,80,0.05)', textAlign: 'center' }}>
                <div style={{ color: 'var(--accent2)', fontSize: '0.78rem', fontWeight: 600 }}>Bob's SECRET</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>b = {String(computed.b)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Never transmitted</div>
              </div>
            </div>

            {/* Public keys */}
            <div className="output-label">Step 3 — Exchange public keys (sent over the wire)</div>
            <div className="two-col" style={{ marginBottom: 16 }}>
              <div className="output-box" style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--accent)', fontSize: '0.78rem' }}>A = g<sup>a</sup> mod p</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>A = {String(computed.A)}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{String(computed.g)}^{String(computed.a)} mod {String(computed.p)}</div>
              </div>
              <div className="output-box" style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--accent2)', fontSize: '0.78rem' }}>B = g<sup>b</sup> mod p</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent2)' }}>B = {String(computed.B)}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{String(computed.g)}^{String(computed.b)} mod {String(computed.p)}</div>
              </div>
            </div>

            {/* Shared secret */}
            <div className="output-label">Step 4 — Each computes the shared secret</div>
            <div className="two-col" style={{ marginBottom: 16 }}>
              <div className="output-box" style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Alice computes B<sup>a</sup> mod p</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{String(computed.sharedAlice)}</div>
              </div>
              <div className="output-box" style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Bob computes A<sup>b</sup> mod p</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{String(computed.sharedBob)}</div>
              </div>
            </div>

            <div style={{ padding: 16, borderRadius: 8, border: `1px solid ${computed.match ? 'rgba(63,185,80,0.4)' : 'rgba(248,81,73,0.4)'}`, background: computed.match ? 'rgba(63,185,80,0.07)' : 'rgba(248,81,73,0.07)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{computed.match ? '🔐' : '❌'}</div>
              <strong style={{ color: computed.match ? 'var(--accent2)' : 'var(--danger)', fontSize: '1rem' }}>
                {computed.match ? `Shared Secret = ${String(computed.sharedAlice)} — Keys Match!` : 'Keys do not match (error)'}
              </strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>
                An eavesdropper who intercepts A={String(computed.A)}, B={String(computed.B)}, g={String(computed.g)}, p={String(computed.p)} must solve:
                x such that {String(computed.g)}<sup>x</sup> ≡ {String(computed.A)} (mod {String(computed.p)}) — the Discrete Log Problem.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
