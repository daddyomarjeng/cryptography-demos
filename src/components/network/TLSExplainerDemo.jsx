import { useState } from 'react';
import { ShieldAlert, Play, RotateCcw } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    from: 'Client',
    to: 'Server',
    label: 'ClientHello',
    color: 'var(--accent)',
    description: 'Client sends supported TLS versions, cipher suites, and a random nonce (ClientRandom).',
    details: [
      'TLS Version: TLS 1.3',
      'Cipher Suites: TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256',
      'ClientRandom: a7f3e2... (32 bytes)',
      'Extensions: SNI, supported_groups, key_share',
    ],
  },
  {
    id: 2,
    from: 'Server',
    to: 'Client',
    label: 'ServerHello',
    color: 'var(--accent2)',
    description: 'Server selects the cipher suite and TLS version, sends ServerRandom and its key share.',
    details: [
      'Selected Cipher: TLS_AES_256_GCM_SHA384',
      'ServerRandom: 2b8d9f... (32 bytes)',
      'Key Share: Server ECDH public key (X25519)',
    ],
  },
  {
    id: 3,
    from: 'Server',
    to: 'Client',
    label: 'Certificate',
    color: 'var(--warning)',
    description: 'Server sends its X.509 certificate containing its public key, signed by a Certificate Authority (CA).',
    details: [
      'Subject: CN=example.com',
      'Issuer: Let\'s Encrypt Authority X3',
      'Public Key: RSA-2048 / ECDSA P-256',
      'Validity: 2024-01-01 to 2025-01-01',
      'SAN: example.com, www.example.com',
    ],
  },
  {
    id: 4,
    from: 'Server',
    to: 'Client',
    label: 'CertificateVerify',
    color: 'var(--warning)',
    description: 'Server signs the handshake transcript with its private key to prove certificate ownership.',
    details: [
      'Algorithm: ecdsa_secp256r1_sha256',
      'Signature covers: all previous handshake messages',
    ],
  },
  {
    id: 5,
    from: 'Server',
    to: 'Client',
    label: 'Finished',
    color: 'var(--accent2)',
    description: 'Server sends HMAC of the entire handshake. Both sides derive the session keys via HKDF.',
    details: [
      'HMAC-SHA384 over handshake transcript',
      'Session keys derived: client_write_key, server_write_key',
      'Key derivation: ECDH shared secret → HKDF-Extract → HKDF-Expand',
    ],
  },
  {
    id: 6,
    from: 'Client',
    to: 'Server',
    label: 'Finished',
    color: 'var(--accent)',
    description: 'Client sends its own Finished HMAC. Handshake is complete — encrypted application data can now flow.',
    details: [
      'Client verifies server Finished',
      'Client sends its own HMAC-SHA384',
      '🔒 Encrypted channel established!',
    ],
  },
  {
    id: 7,
    from: 'Client',
    to: 'Server',
    label: 'Application Data (encrypted)',
    color: 'rgba(88,166,255,0.5)',
    description: 'All application data is now encrypted with AES-256-GCM using the derived session keys.',
    details: [
      'GET / HTTP/1.1 (encrypted)',
      'AEAD: AES-256-GCM',
      'Each record has a unique nonce',
      'Replay protection via sequence numbers',
    ],
  },
];

export default function TLSExplainerDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(false);

  function next() { setCurrentStep(s => Math.min(s + 1, STEPS.length - 1)); }
  function prev() { setCurrentStep(s => Math.max(s - 1, 0)); }
  function reset() { setCurrentStep(0); setAutoPlaying(false); }

  function autoPlay() {
    setAutoPlaying(true);
    setCurrentStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step >= STEPS.length - 1) {
        clearInterval(interval);
        setAutoPlaying(false);
      }
    }, 1800);
  }

  const step = STEPS[currentStep];

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon orange"><ShieldAlert size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>TLS 1.3 Handshake Walkthrough</h2>
            <p>Step-by-step interactive TLS/SSL explainer</p>
          </div>
        </div>

        <div className="info-box">
          <strong>TLS (Transport Layer Security)</strong> creates an encrypted channel between client and server.
          TLS 1.3 reduced the handshake to <strong>1 round-trip</strong> (vs 2 in TLS 1.2), improving performance
          while strengthening security with mandatory forward secrecy.
        </div>

        {/* Timeline */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              style={{
                flex: 1, minWidth: 60, padding: '6px 8px', borderRadius: 6,
                border: `1px solid ${i === currentStep ? s.color : 'var(--border)'}`,
                background: i === currentStep ? `${s.color}18` : 'var(--surface2)',
                color: i <= currentStep ? 'var(--text)' : 'var(--text-muted)',
                fontSize: '0.72rem', fontWeight: i === currentStep ? 700 : 400,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {i + 1}. {s.label}
            </button>
          ))}
        </div>

        {/* Diagram */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginBottom: 24, padding: 20, background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center', padding: 16, background: 'rgba(88,166,255,0.08)', borderRadius: 8, border: '1px solid rgba(88,166,255,0.2)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 4 }}>💻</div>
            <strong style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>Client</strong>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 120 }}>
            <div style={{
              padding: '6px 14px', borderRadius: 20, background: `${step?.color}20`,
              border: `1px solid ${step?.color}`, color: step?.color,
              fontSize: '0.76rem', fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap',
            }}>
              {step?.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {step?.from === 'Client'
                ? <><span style={{ color: 'var(--accent)' }}>Client</span> → <span style={{ color: 'var(--accent2)' }}>Server</span></>
                : <><span style={{ color: 'var(--accent2)' }}>Server</span> → <span style={{ color: 'var(--accent)' }}>Client</span></>}
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: 16, background: 'rgba(63,185,80,0.08)', borderRadius: 8, border: '1px solid rgba(63,185,80,0.2)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 4 }}>🖥️</div>
            <strong style={{ color: 'var(--accent2)', fontSize: '0.9rem' }}>Server</strong>
          </div>
        </div>

        {/* Step detail */}
        {step && (
          <div style={{ padding: 20, background: 'var(--surface2)', borderRadius: 8, border: `1px solid ${step.color}40`, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: '1.2rem' }}>Step {step.id}/{STEPS.length}</span>
              <strong style={{ color: step.color, fontSize: '1rem' }}>{step.label}</strong>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 12px', lineHeight: 1.7 }}>{step.description}</p>
            <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 2 }}>
              {step.details.map((d, i) => <li key={i} style={{ color: d.includes('🔒') ? 'var(--accent2)' : undefined }}>{d}</li>)}
            </ul>
          </div>
        )}

        {/* Controls */}
        <div className="btn-group">
          <button className="btn btn-outline" onClick={prev} disabled={currentStep === 0 || autoPlaying}>← Prev</button>
          <button className="btn btn-outline" onClick={next} disabled={currentStep === STEPS.length - 1 || autoPlaying}>Next →</button>
          <button className="btn btn-primary" onClick={autoPlay} disabled={autoPlaying}>
            <Play size={14} /> {autoPlaying ? 'Playing…' : 'Auto Play'}
          </button>
          <button className="btn btn-outline" onClick={reset}><RotateCcw size={14} /> Reset</button>
        </div>
      </div>
    </div>
  );
}
