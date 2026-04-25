import { useState } from 'react';
import { Infinity as InfinityIcon } from 'lucide-react';
import EC from 'elliptic';

const ec = new EC.ec('secp256k1');
const ec_p256 = new EC.ec('p256');

export default function ECCDemo() {
  const [curve, setCurve] = useState('secp256k1');
  const [tab, setTab] = useState('ecdh');

  // ECDH state
  const [aliceKeys, setAliceKeys] = useState(null);
  const [bobKeys, setBobKeys] = useState(null);
  const [ecdhShared, setEcdhShared] = useState(null);

  // ECDSA state
  const [signKeys, setSignKeys] = useState(null);
  const [message, setMessage] = useState('Hello, ECC!');
  const [signature, setSignature] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [tampered, setTampered] = useState(false);

  function getEC() { return curve === 'secp256k1' ? ec : ec_p256; }

  function generateECDH() {
    const ecInstance = getEC();
    const a = ecInstance.genKeyPair();
    const b = ecInstance.genKeyPair();
    setAliceKeys(a);
    setBobKeys(b);
    setEcdhShared(null);
  }

  function computeECDH() {
    if (!aliceKeys || !bobKeys) return;
    const sharedAlice = aliceKeys.derive(bobKeys.getPublic());
    const sharedBob   = bobKeys.derive(aliceKeys.getPublic());
    setEcdhShared({ alice: sharedAlice.toString(16), bob: sharedBob.toString(16) });
  }

  function generateSignKeys() {
    setSignKeys(getEC().genKeyPair());
    setSignature(null);
    setVerifyResult(null);
    setTampered(false);
  }

  function signMessage() {
    if (!signKeys) return;
    // Hash message with SubtleCrypto would be ideal but for demo use simple encode
    const msgHash = Array.from(new TextEncoder().encode(message))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    // Pad/truncate to 32 bytes
    const hash32 = msgHash.slice(0, 64).padStart(64, '0');
    const sig = signKeys.sign(hash32);
    setSignature({ r: sig.r.toString(16), s: sig.s.toString(16), hash: hash32 });
    setVerifyResult(null);
    setTampered(false);
  }

  function verifySignature() {
    if (!signKeys || !signature) return;
    try {
      const msgToVerify = tampered ? message + ' [tampered]' : message;
      const msgHash = Array.from(new TextEncoder().encode(msgToVerify))
        .map(b => b.toString(16).padStart(2, '0')).join('');
      const hash32 = msgHash.slice(0, 64).padStart(64, '0');
      const valid = signKeys.verify(hash32, { r: signature.r, s: signature.s });
      setVerifyResult(valid);
    } catch { setVerifyResult(false); }
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon purple"><InfinityIcon size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Elliptic Curve Cryptography (ECC)</h2>
            <p>Visual ECDH key agreement & ECDSA signing</p>
          </div>
        </div>

        <div className="info-box">
          <strong>ECC</strong> provides the same security as RSA with much smaller key sizes (256-bit ECC ≈ 3072-bit RSA).
          It powers TLS, Bitcoin, SSH, and Signal. Two key applications: <strong>ECDH</strong> (key exchange)
          and <strong>ECDSA</strong> (digital signatures).
        </div>

        <div className="form-group">
          <label>Elliptic Curve</label>
          <div className="btn-group">
            <button className={`btn ${curve === 'secp256k1' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCurve('secp256k1')}>secp256k1 (Bitcoin)</button>
            <button className={`btn ${curve === 'p256' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCurve('p256')}>P-256 (NIST)</button>
          </div>
        </div>

        <div className="btn-group" style={{ marginBottom: 20 }}>
          <button className={`btn ${tab === 'ecdh' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('ecdh')}>ECDH Key Exchange</button>
          <button className={`btn ${tab === 'ecdsa' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('ecdsa')}>ECDSA Signatures</button>
        </div>

        {tab === 'ecdh' && (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={generateECDH}>Generate Key Pairs</button>
              <button className="btn btn-outline" onClick={computeECDH} disabled={!aliceKeys || !bobKeys}>Compute Shared Secret</button>
            </div>

            {aliceKeys && bobKeys && (
              <>
                <div className="two-col" style={{ marginBottom: 16 }}>
                  <div>
                    <div className="output-label" style={{ color: 'var(--accent)' }}>Alice's Keys</div>
                    <div className="output-box" style={{ fontSize: '0.72rem', borderColor: 'rgba(88,166,255,0.3)' }}>
                      <div style={{ color: 'var(--danger)', marginBottom: 4 }}>🔒 Private: {aliceKeys.getPrivate('hex').slice(0, 24)}…</div>
                      <div style={{ color: 'var(--accent)' }}>Public X: {aliceKeys.getPublic().getX().toString(16).slice(0, 24)}…</div>
                      <div style={{ color: 'var(--accent)' }}>Public Y: {aliceKeys.getPublic().getY().toString(16).slice(0, 24)}…</div>
                    </div>
                  </div>
                  <div>
                    <div className="output-label" style={{ color: 'var(--accent2)' }}>Bob's Keys</div>
                    <div className="output-box" style={{ fontSize: '0.72rem', borderColor: 'rgba(63,185,80,0.3)' }}>
                      <div style={{ color: 'var(--danger)', marginBottom: 4 }}>🔒 Private: {bobKeys.getPrivate('hex').slice(0, 24)}…</div>
                      <div style={{ color: 'var(--accent2)' }}>Public X: {bobKeys.getPublic().getX().toString(16).slice(0, 24)}…</div>
                      <div style={{ color: 'var(--accent2)' }}>Public Y: {bobKeys.getPublic().getY().toString(16).slice(0, 24)}…</div>
                    </div>
                  </div>
                </div>

                {ecdhShared && (
                  <>
                    <div className="output-label">Shared Secret (ECDH)</div>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Alice computes: alicePriv × BobPublic</div>
                      <div className="output-box" style={{ fontSize: '0.75rem', wordBreak: 'break-all', color: 'var(--accent)' }}>{ecdhShared.alice}</div>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Bob computes: bobPriv × AlicePublic</div>
                      <div className="output-box" style={{ fontSize: '0.75rem', wordBreak: 'break-all', color: 'var(--accent2)' }}>{ecdhShared.bob}</div>
                    </div>
                    <div style={{ padding: 12, borderRadius: 8, border: `1px solid ${ecdhShared.alice === ecdhShared.bob ? 'rgba(63,185,80,0.4)' : 'rgba(248,81,73,0.4)'}`, background: ecdhShared.alice === ecdhShared.bob ? 'rgba(63,185,80,0.07)' : 'rgba(248,81,73,0.07)', textAlign: 'center', fontWeight: 700 }}>
                      {ecdhShared.alice === ecdhShared.bob ? '✅ Shared secrets match — secure channel established!' : '❌ Mismatch'}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}

        {tab === 'ecdsa' && (
          <>
            <button className="btn btn-primary" onClick={generateSignKeys} style={{ marginBottom: 16 }}>Generate Signing Keys</button>

            {signKeys && (
              <>
                <div className="output-label">Key Pair</div>
                <div className="output-box" style={{ fontSize: '0.72rem', marginBottom: 16 }}>
                  <div style={{ color: 'var(--danger)', marginBottom: 4 }}>🔒 Private: {signKeys.getPrivate('hex').slice(0, 32)}…</div>
                  <div style={{ color: 'var(--accent)' }}>Public: {signKeys.getPublic('hex').slice(0, 32)}…</div>
                </div>

                <div className="form-group">
                  <label>Message to Sign</label>
                  <input type="text" value={message} onChange={e => { setMessage(e.target.value); setSignature(null); setVerifyResult(null); }} />
                </div>
                <button className="btn btn-primary" onClick={signMessage} style={{ marginBottom: 16 }}>Sign Message</button>

                {signature && (
                  <>
                    <div className="output-label">ECDSA Signature</div>
                    <div className="output-box" style={{ fontSize: '0.72rem', marginBottom: 16 }}>
                      <div>r: {signature.r}</div>
                      <div style={{ marginTop: 4 }}>s: {signature.s}</div>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, cursor: 'pointer', fontSize: '0.85rem' }}>
                      <input type="checkbox" checked={tampered} onChange={e => { setTampered(e.target.checked); setVerifyResult(null); }} />
                      Simulate message tampering (append " [tampered]")
                    </label>
                    <button className="btn btn-outline" onClick={verifySignature} style={{ marginBottom: 16 }}>Verify Signature</button>

                    {verifyResult !== null && (
                      <div style={{ padding: 14, borderRadius: 8, border: `1px solid ${verifyResult ? 'rgba(63,185,80,0.4)' : 'rgba(248,81,73,0.4)'}`, background: verifyResult ? 'rgba(63,185,80,0.07)' : 'rgba(248,81,73,0.07)', fontWeight: 700, color: verifyResult ? 'var(--accent2)' : 'var(--danger)' }}>
                        {verifyResult ? '✅ Signature valid — message is authentic and unmodified.' : '❌ Signature invalid — message was tampered or wrong key.'}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
