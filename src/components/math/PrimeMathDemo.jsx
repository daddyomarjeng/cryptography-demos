import { useState } from 'react';
import { Hash } from 'lucide-react';

// Miller-Rabin primality test
function millerRabin(n, k = 10) {
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if (n % 2n === 0n) return false;

  let d = n - 1n;
  let r = 0;
  while (d % 2n === 0n) { d /= 2n; r++; }

  const witnesses = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n];

  for (const a of witnesses) {
    if (a >= n) continue;
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    let composite = true;
    for (let i = 0; i < r - 1; i++) {
      x = (x * x) % n;
      if (x === n - 1n) { composite = false; break; }
    }
    if (composite) return false;
  }
  return true;
}

function modPow(base, exp, mod) {
  if (mod === 1n) return 0n;
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % mod;
    exp >>= 1n;
    base = (base * base) % mod;
  }
  return result;
}

function gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; }

function extGCD(a, b) {
  if (b === 0n) return [a, 1n, 0n];
  const [g, x, y] = extGCD(b, a % b);
  return [g, y, x - (a / b) * y];
}

function modInverse(a, m) {
  const [g, x] = extGCD(a, m);
  if (g !== 1n) return null;
  return ((x % m) + m) % m;
}

// Simple RSA key generation for small demonstration
function rsaDemo(p, q) {
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  let e = 65537n;
  if (gcd(e, phi) !== 1n) {
    for (e = 3n; e < phi; e += 2n) { if (gcd(e, phi) === 1n) break; }
  }
  const d = modInverse(e, phi);
  return { n, phi, e, d };
}

export default function PrimeMathDemo() {
  const [tab, setTab] = useState('primality');

  // Primality
  const [primeInput, setPrimeInput] = useState('97');
  const [primeResult, setPrimeResult] = useState(null);
  const [primeList, setPrimeList] = useState([]);
  const [sieveLimit, setSieveLimit] = useState('100');

  // Modular arithmetic
  const [modBase, setModBase] = useState('7');
  const [modExp, setModExp] = useState('3');
  const [modMod, setModMod] = useState('13');
  const [modResult, setModResult] = useState(null);

  // RSA
  const [rsaP, setRsaP] = useState('61');
  const [rsaQ, setRsaQ] = useState('53');
  const [rsaMsg, setRsaMsg] = useState('42');
  const [rsaKeys, setRsaKeys] = useState(null);
  const [rsaEncrypted, setRsaEncrypted] = useState(null);
  const [rsaDecrypted, setRsaDecrypted] = useState(null);

  function testPrimality() {
    try {
      const n = BigInt(primeInput);
      const isPrime = millerRabin(n);
      const factors = [];
      if (!isPrime) {
        let m = n;
        for (let i = 2n; i * i <= m && i < 1000n; i++) {
          while (m % i === 0n) { factors.push(i); m /= i; }
        }
        if (m > 1n) factors.push(m);
      }
      setPrimeResult({ n, isPrime, factors });
    } catch { setPrimeResult({ error: 'Invalid number' }); }
  }

  function sieveOfEratosthenes() {
    const limit = parseInt(sieveLimit);
    if (isNaN(limit) || limit < 2 || limit > 2000) return;
    const sieve = new Array(limit + 1).fill(true);
    sieve[0] = sieve[1] = false;
    for (let i = 2; i * i <= limit; i++) {
      if (sieve[i]) for (let j = i * i; j <= limit; j += i) sieve[j] = false;
    }
    setPrimeList(sieve.map((v, i) => v ? i : null).filter(Boolean));
  }

  function computeModular() {
    try {
      const b = BigInt(modBase), e = BigInt(modExp), m = BigInt(modMod);
      const result = modPow(b, e, m);
      setModResult({ b, e, m, result });
    } catch { setModResult({ error: 'Invalid input' }); }
  }

  function generateRSA() {
    try {
      const p = BigInt(rsaP), q = BigInt(rsaQ);
      if (!millerRabin(p)) throw new Error(`${rsaP} is not prime`);
      if (!millerRabin(q)) throw new Error(`${rsaQ} is not prime`);
      if (p === q) throw new Error('p and q must be different primes');
      const keys = rsaDemo(p, q);
      setRsaKeys(keys);
      setRsaEncrypted(null);
      setRsaDecrypted(null);
    } catch (e) { setRsaKeys({ error: e.message }); }
  }

  function rsaEncrypt() {
    if (!rsaKeys || rsaKeys.error) return;
    try {
      const m = BigInt(rsaMsg);
      if (m >= rsaKeys.n) throw new Error(`Message must be < n (${rsaKeys.n})`);
      const c = modPow(m, rsaKeys.e, rsaKeys.n);
      const dec = modPow(c, rsaKeys.d, rsaKeys.n);
      setRsaEncrypted(c);
      setRsaDecrypted(dec);
    } catch (e) { setRsaEncrypted({ error: e.message }); }
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon purple"><Hash size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Prime Numbers & Modular Arithmetic</h2>
            <p>The mathematics powering RSA and modern cryptography</p>
          </div>
        </div>

        <div className="info-box">
          <strong>Number theory</strong> is the foundation of public-key cryptography.
          RSA security rests on the hardness of <strong>integer factorization</strong>.
          Diffie-Hellman relies on the <strong>discrete logarithm problem</strong>.
          Both use <strong>modular arithmetic</strong> — arithmetic in a finite ring.
        </div>

        <div className="btn-group" style={{ marginBottom: 20, flexWrap: 'wrap' }}>
          <button className={`btn ${tab === 'primality' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('primality')}>Primality Test</button>
          <button className={`btn ${tab === 'sieve' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('sieve')}>Sieve of Eratosthenes</button>
          <button className={`btn ${tab === 'modular' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('modular')}>Modular Exponentiation</button>
          <button className={`btn ${tab === 'rsa' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('rsa')}>RSA Math Demo</button>
        </div>

        {tab === 'primality' && (
          <>
            <div className="form-group">
              <label>Number to Test</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input type="number" value={primeInput} onChange={e => setPrimeInput(e.target.value)} />
                <button className="btn btn-primary" onClick={testPrimality}>Test</button>
              </div>
            </div>
            <div className="form-group">
              <label>Quick examples</label>
              <div className="btn-group" style={{ flexWrap: 'wrap' }}>
                {['2','7','13','97','561','1009','7919','104729'].map(n => (
                  <button key={n} className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => setPrimeInput(n)}>{n}</button>
                ))}
              </div>
            </div>
            {primeResult && !primeResult.error && (
              <div style={{ padding: 16, borderRadius: 8, border: `1px solid ${primeResult.isPrime ? 'rgba(63,185,80,0.4)' : 'rgba(248,81,73,0.4)'}`, background: primeResult.isPrime ? 'rgba(63,185,80,0.07)' : 'rgba(248,81,73,0.07)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: primeResult.isPrime ? 'var(--accent2)' : 'var(--danger)', marginBottom: 8 }}>
                  {String(primeResult.n)} is {primeResult.isPrime ? '✅ PRIME' : '❌ COMPOSITE'}
                </div>
                {!primeResult.isPrime && primeResult.factors.length > 0 && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Factors: {primeResult.factors.map(String).join(' × ')}
                  </div>
                )}
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
                  Algorithm: Miller-Rabin with witnesses [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'sieve' && (
          <>
            <div className="form-group">
              <label>Find all primes up to</label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input type="number" value={sieveLimit} onChange={e => setSieveLimit(e.target.value)} min={2} max={2000} />
                <button className="btn btn-primary" onClick={sieveOfEratosthenes}>Compute</button>
              </div>
            </div>
            {primeList.length > 0 && (
              <>
                <div className="output-label">Found {primeList.length} primes up to {sieveLimit}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 260, overflowY: 'auto', padding: 12, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  {primeList.map(p => (
                    <span key={p} style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(88,166,255,0.1)', border: '1px solid rgba(88,166,255,0.2)', fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--accent)' }}>{p}</span>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {tab === 'modular' && (
          <>
            <div className="info-box">
              <strong>Modular exponentiation</strong>: base<sup>exp</sup> mod m — computed efficiently via
              repeated squaring (O(log exp) multiplications). This is the core operation in RSA and Diffie-Hellman.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Base</label>
                <input type="number" value={modBase} onChange={e => setModBase(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Exponent</label>
                <input type="number" value={modExp} onChange={e => setModExp(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Modulus</label>
                <input type="number" value={modMod} onChange={e => setModMod(e.target.value)} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={computeModular}>Compute</button>
            {modResult && !modResult.error && (
              <div className="output-box" style={{ marginTop: 16, textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                  {String(modResult.b)}<sup>{String(modResult.e)}</sup> mod {String(modResult.m)} = <span style={{ color: 'var(--accent)' }}>{String(modResult.result)}</span>
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'rsa' && (
          <>
            <div className="info-box">
              <strong>RSA</strong>: Choose two primes p, q → n = p×q → φ(n) = (p-1)(q-1) → pick e coprime to φ(n)
              → d = e<sup>-1</sup> mod φ(n). Public key: (n,e) · Private key: (n,d).
              Encrypt: c = m<sup>e</sup> mod n · Decrypt: m = c<sup>d</sup> mod n
            </div>
            <div className="two-col">
              <div className="form-group">
                <label>Prime p</label>
                <input type="number" value={rsaP} onChange={e => { setRsaP(e.target.value); setRsaKeys(null); }} />
              </div>
              <div className="form-group">
                <label>Prime q</label>
                <input type="number" value={rsaQ} onChange={e => { setRsaQ(e.target.value); setRsaKeys(null); }} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={generateRSA} style={{ marginBottom: 16 }}>Generate RSA Keys</button>

            {rsaKeys?.error && <div className="warn-box">⚠️ {rsaKeys.error}</div>}

            {rsaKeys && !rsaKeys.error && (
              <>
                <div className="two-col" style={{ marginBottom: 16 }}>
                  <div className="output-box" style={{ fontSize: '0.82rem', borderColor: 'rgba(88,166,255,0.3)' }}>
                    <div style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: 8 }}>Public Key (n, e)</div>
                    <div>n = {String(rsaKeys.n)}</div>
                    <div>e = {String(rsaKeys.e)}</div>
                    <div style={{ marginTop: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>φ(n) = {String(rsaKeys.phi)}</div>
                  </div>
                  <div className="output-box" style={{ fontSize: '0.82rem', borderColor: 'rgba(248,81,73,0.3)' }}>
                    <div style={{ color: 'var(--danger)', fontWeight: 700, marginBottom: 8 }}>🔒 Private Key (n, d)</div>
                    <div>n = {String(rsaKeys.n)}</div>
                    <div>d = {String(rsaKeys.d)}</div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Message (integer &lt; {String(rsaKeys.n)})</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input type="number" value={rsaMsg} onChange={e => setRsaMsg(e.target.value)} max={String(rsaKeys.n - 1n)} />
                    <button className="btn btn-primary" onClick={rsaEncrypt}>Encrypt & Decrypt</button>
                  </div>
                </div>

                {rsaEncrypted && !rsaEncrypted.error && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: `Plaintext (m)`, val: rsaMsg, color: 'var(--text)' },
                      { label: `Encrypted (c = m^e mod n)`, val: String(rsaEncrypted), color: 'var(--accent)' },
                      { label: `Decrypted (m = c^d mod n)`, val: String(rsaDecrypted), color: rsaDecrypted?.toString() === rsaMsg ? 'var(--accent2)' : 'var(--danger)' },
                    ].map(r => (
                      <div key={r.label} style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                        <strong style={{ color: r.color, fontFamily: 'monospace' }}>{r.val}</strong>
                      </div>
                    ))}
                    {rsaDecrypted?.toString() === rsaMsg && (
                      <div style={{ textAlign: 'center', color: 'var(--accent2)', fontWeight: 700 }}>✅ Decryption successful — RSA round-trip verified!</div>
                    )}
                  </div>
                )}
                {rsaEncrypted?.error && <div className="warn-box">⚠️ {rsaEncrypted.error}</div>}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
