import { Target, Trophy, Settings2, Package, Wrench, Check, User, Globe, GraduationCap, Briefcase } from 'lucide-react';

const LinkedinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function AboutPage() {
  return (
    <div>
      {/* Project Overview */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon blue"><Target size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Project Overview</h2>
            <p>Open Source Cybersecurity Toolkit</p>
          </div>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 12 }}>
            <strong style={{ color: 'var(--text)' }}>Cryptography Playground</strong> is an open source,
            browser-based cybersecurity toolkit that lets you interactively explore fundamental cryptographic
            techniques used in modern systems — with no server, no data collection, and no setup required.
          </p>
          <p style={{ marginBottom: 12 }}>
            The project is built around a <strong style={{ color: 'var(--text)' }}>modular architecture</strong> —
            each cybersecurity concept is encapsulated as an independent module, making it easy to extend,
            contribute to, or learn from.
          </p>
          <p style={{ marginBottom: 12 }}>17 interactive modules across 6 categories:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 10, marginBottom: 12 }}>
            {[
              { cat: '🔐 Cryptography', items: ['Symmetric Encryption (AES, 3DES)', 'Asymmetric Encryption (RSA)'] },
              { cat: '🔑 Hashing & Integrity', items: ['Hash Functions (MD5–SHA-512)', 'HMAC', 'Password Hashing (bcrypt/PBKDF2)'] },
              { cat: '🔠 Encoding & Obfuscation', items: ['Encoding Playground (Base64/Hex/URL)', 'Caesar / ROT13 Cipher', 'Steganography (LSB)'] },
              { cat: '🌐 Network & Web Security', items: ['JWT Tokens', 'TLS 1.3 Handshake', 'CORS & CSP Simulator'] },
              { cat: '🛡️ Attack Demonstrations', items: ['Brute Force Visualizer', 'SQL Injection Demo', 'XSS Playground'] },
              { cat: '🔢 Math Behind Crypto', items: ['Diffie-Hellman Key Exchange', 'Elliptic Curve (ECDH/ECDSA)', 'Prime & Modular Arithmetic'] },
            ].map(g => (
              <div key={g.cat} style={{ padding: 12, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>{g.cat}</div>
                {g.items.map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    <Check size={11} strokeWidth={2.5} style={{ color: 'var(--accent2)', flexShrink: 0 }} /> {i}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p>
            All cryptographic operations execute entirely within the user's browser. No data is transmitted to any
            server, making this tool safe for experimentation and learning.
          </p>
        </div>
      </div>

      {/* Objectives */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon green"><Trophy size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Objectives</h2>
            <p>What this project aims to demonstrate</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 }}>
          {[
            { num: '01', title: 'Demonstrate Symmetric Encryption', desc: 'Show how AES and Triple DES use a shared secret key to encrypt and decrypt data, illustrating key reuse and mode differences.' },
            { num: '02', title: 'Demonstrate Asymmetric Encryption', desc: 'Show how RSA key pairs enable secure communication where only the private key holder can decrypt messages encrypted with their public key.' },
            { num: '03', title: 'Explain Digital Signatures', desc: 'Demonstrate how private keys create verifiable proofs of authenticity and data integrity using SHA-256 hashing.' },
            { num: '04', title: 'Educate on Key Concepts', desc: 'Provide in-context glossary definitions for all cryptographic terms so learners can understand each concept as they interact with it.' },
          ].map(item => (
            <div key={item.num} style={{ padding: 16, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>{item.num}</div>
              <strong style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{item.title}</strong>
              <p style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon orange"><Settings2 size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Methodology</h2>
            <p>How the system was designed and built</p>
          </div>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
          <p style={{ marginBottom: 16 }}>
            The application follows a <strong style={{ color: 'var(--text)' }}>component-based architecture</strong> using
            React (via Vite) to separate concerns cleanly. Each cryptographic algorithm is encapsulated in its
            own component, making the code modular and extensible.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { title: 'Frontend Framework', body: 'React 18 with Vite as the build tool. Functional components with React Hooks (useState, useEffect) manage all application state.' },
              { title: 'Client-Side Only', body: 'All cryptographic operations run in the browser using JavaScript libraries. No backend server, no data storage, no network requests during encryption.' },
              { title: 'Real Algorithms', body: 'Production-grade cryptographic libraries (not custom implementations) are used to ensure correctness and to demonstrate real-world encryption behavior.' },
              { title: 'Glossary-Driven UI', body: 'Every cryptographic term in the UI is linked to a glossary entry via an info icon, supporting self-paced learning without leaving the demo context.' },
            ].map(item => (
              <div key={item.title} style={{ padding: 14, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <strong style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>{item.title}</strong>
                <p style={{ marginTop: 6, fontSize: '0.82rem' }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Libraries Used */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon blue"><Package size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Libraries &amp; Packages Used</h2>
            <p>Open-source cryptographic tools powering this demo</p>
          </div>
        </div>

        {/* crypto-js */}
        <div style={{ marginBottom: 24, padding: 20, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(88,166,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <strong style={{ color: 'var(--text)', fontSize: '1rem' }}>crypto-js</strong>
              <span style={{ marginLeft: 10, padding: '2px 8px', background: 'rgba(88,166,255,0.12)', border: '1px solid rgba(88,166,255,0.25)', borderRadius: 12, fontSize: '0.75rem', color: 'var(--accent)' }}>
                v4.x — Symmetric
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 12, lineHeight: 1.7 }}>
            CryptoJS is a comprehensive JavaScript library implementing standard cryptographic algorithms.
            It was originally developed by Jeff Mott and is widely used for client-side cryptography.
            In this project it provides the symmetric encryption module.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 10 }}>
            {[
              { label: 'AES Encryption', detail: 'CBC, ECB, CTR modes with PKCS7 padding' },
              { label: 'Triple DES', detail: 'Legacy 3DES block cipher (EDE key schedule)' },
              { label: 'Key Derivation', detail: 'Password-based key + IV derivation via MD5' },
              { label: 'Encoders', detail: 'Base64, Hex, UTF-8 converters' },
            ].map(f => (
              <div key={f.label} style={{ padding: 10, background: 'var(--surface)', borderRadius: 6, border: '1px solid var(--border)' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--accent2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Check size={13} strokeWidth={2.5} /> {f.label}
                </strong>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 4 }}>{f.detail}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            npm: <code style={{ background: 'var(--surface)', padding: '2px 6px', borderRadius: 4, color: 'var(--warning)' }}>npm install crypto-js</code>
            &nbsp;·&nbsp; License: MIT &nbsp;·&nbsp;
            <a href="https://github.com/brix/crypto-js" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>github.com/brix/crypto-js</a>
          </div>
        </div>

        {/* node-forge */}
        <div style={{ padding: 20, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(210,153,34,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} style={{ color: 'var(--warning)' }} />
            </div>
            <div>
              <strong style={{ color: 'var(--text)', fontSize: '1rem' }}>node-forge</strong>
              <span style={{ marginLeft: 10, padding: '2px 8px', background: 'rgba(210,153,34,0.12)', border: '1px solid rgba(210,153,34,0.25)', borderRadius: 12, fontSize: '0.75rem', color: 'var(--warning)' }}>
                v1.x — Asymmetric
              </span>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 12, lineHeight: 1.7 }}>
            node-forge is a native JavaScript implementation of the TLS protocol and various cryptography tools.
            It provides a full PKI (Public Key Infrastructure) toolkit including RSA key generation, PKCS
            certificate handling, and digital signatures — suitable for both Node.js and browser environments.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 10 }}>
            {[
              { label: 'RSA Key Generation', detail: '1024 / 2048 / 4096-bit key pair generation' },
              { label: 'RSA-OAEP Encryption', detail: 'Secure asymmetric encryption with OAEP padding' },
              { label: 'Digital Signatures', detail: 'SHA-256 + RSA PKCS#1 v1.5 signing & verification' },
              { label: 'PEM Encoding', detail: 'Public/private key export in PEM (Base64) format' },
            ].map(f => (
              <div key={f.label} style={{ padding: 10, background: 'var(--surface)', borderRadius: 6, border: '1px solid var(--border)' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--accent2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Check size={13} strokeWidth={2.5} /> {f.label}
                </strong>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 4 }}>{f.detail}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            npm: <code style={{ background: 'var(--surface)', padding: '2px 6px', borderRadius: 4, color: 'var(--warning)' }}>npm install node-forge</code>
            &nbsp;·&nbsp; License: BSD/GPL dual &nbsp;·&nbsp;
            <a href="https://github.com/digitalbazaar/forge" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>github.com/digitalbazaar/forge</a>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon green"><Wrench size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Technology Stack</h2>
            <p>Full list of tools and technologies used</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 14 }}>
          {[
            { name: 'React 18', role: 'UI Framework', desc: 'Component-based frontend library by Meta' },
            { name: 'Vite', role: 'Build Tool', desc: 'Fast dev server and bundler using Rolldown' },
            { name: 'crypto-js 4', role: 'Symmetric Crypto', desc: 'AES, 3DES, HMAC, hashing utilities' },
            { name: 'node-forge 1', role: 'Asymmetric Crypto', desc: 'RSA, PKI, TLS, X.509 certificates' },
            { name: 'lucide-react', role: 'Icon Library', desc: 'Clean SVG icon set for React applications' },
            { name: 'CSS Variables', role: 'Styling', desc: 'Custom dark theme with CSS custom properties' },
          ].map(item => (
            <div key={item.name} style={{ padding: 14, background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <strong style={{ color: 'var(--text)', fontSize: '0.88rem' }}>{item.name}</strong>
              <div style={{ fontSize: '0.74rem', color: 'var(--accent)', margin: '4px 0' }}>{item.role}</div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Developer */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon blue"><User size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Developer</h2>
            <p>About the author of this project</p>
          </div>
        </div>

        {/* Identity row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(88,166,255,0.1)', border: '2px solid rgba(88,166,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={30} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <strong style={{ color: 'var(--text)', fontSize: '1.15rem' }}>Daddy Omar Jeng</strong>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              <a href="https://www.daddyomarjeng.com" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--accent)', fontSize: '0.88rem', textDecoration: 'none' }}>
                <Globe size={13} /> www.daddyomarjeng.com
              </a>
              <a href="https://www.linkedin.com/in/daddyomarjeng" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#0A66C2', fontSize: '0.88rem', textDecoration: 'none' }}>
                <LinkedinIcon /> linkedin.com/in/daddyomarjeng
              </a>
            </div>
          </div>
        </div>

        {/* Education */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <GraduationCap size={16} style={{ color: 'var(--accent2)' }} />
            <strong style={{ color: 'var(--text)', fontSize: '0.95rem' }}>Education</strong>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              'BSc in Information Systems',
              'HND in Computer Science',
              'Certificate in Information Processing',
              'Diploma in Information Processing',
            ].map(e => (
              <span key={e} style={{ padding: '5px 12px', borderRadius: 20, background: 'rgba(88,166,255,0.08)', border: '1px solid rgba(88,166,255,0.2)', color: 'var(--accent)', fontSize: '0.8rem' }}>{e}</span>
            ))}
          </div>
        </div>

        {/* Work History */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Briefcase size={16} style={{ color: 'var(--accent2)' }} />
            <strong style={{ color: 'var(--text)', fontSize: '0.95rem' }}>Work History</strong>
          </div>

          {[
            {
              org: 'Gambia Information and Communication Technology Agency (GICTA)',
              role: 'ICT Standards & Architecture Specialist',
              period: 'Dec 2025 — Present',
              color: 'var(--accent)',
              badge: 'Current',
              desc: 'Defines and reviews government digital systems for compliance with national ICT standards, cybersecurity frameworks, and interoperability requirements. Evaluates ICT projects, designs reference architectures, and supports enterprise integration across Ministries and Agencies. Develops key internal government systems and provides technical guidance to implement scalable, secure, and interoperable digital platforms.',
            },
            {
              org: 'Pay Connect',
              role: 'Software Engineer (Remote)',
              period: 'Apr 2025 — Present',
              color: 'var(--accent)',
              badge: 'Current',
              desc: 'Led development of the APS International App — a mobile platform enabling customers in Europe to send money and digital services to recipients across Africa. Engineered secure and scalable features for remittances, airtime top-ups, utility bill payments (electricity, water), wallet and bank transfers, and e-commerce for family shopping with local delivery.',
            },
            {
              org: 'Zigtech',
              role: 'Software Engineer',
              period: 'Feb 2022 — Present',
              color: 'var(--accent2)',
              badge: null,
              desc: 'Led a team of mobile developers delivering solutions for government and private sector clients. Architected systems including a digital procurement platform for the Gambia Public Procurement Authority and a police workflow system for the Gambia Police Force. Developed fintech products including Zapp, a super app for money transfer and bill payments. Designed secure backend services using Node.js and TypeORM.',
            },
            {
              org: 'LLA Media',
              role: 'Software Developer',
              period: 'May 2023 — Sep 2023 (ongoing maintenance)',
              color: 'var(--text-muted)',
              badge: null,
              desc: 'Lead developer of the Zax Medical App, a cross-platform mobile application for doctors and patients to manage appointments, document uploads, and clinical records. Includes admin tools for managing doctors, patients, and appointments, with support for remote updates and secure backend integrations.',
            },
            {
              org: 'Innovative Technology Group (ITG)',
              role: 'Software Developer',
              period: 'Apr 2021 — Jan 2022',
              color: 'var(--text-muted)',
              badge: null,
              desc: 'Upgraded legacy web and mobile projects for performance and maintainability. Developed APIs for the Gambia Transport Service Company (GTSC) enabling bus ticket purchases via GTBank and third-party vendors. Contributed to electricity vending systems (Transact TX & Chapman) integrated with NAWEC. Co-developed the BSE Africa e-commerce platform with responsive web and mobile interfaces.',
            },
            {
              org: 'Living Children Academy',
              role: 'ICT Teacher',
              period: 'Jan 2021 — Jun 2021',
              color: 'var(--text-muted)',
              badge: null,
              desc: 'Delivered practical and theoretical ICT instruction at primary and junior secondary levels. Designed lesson plans covering computer fundamentals, typing, file management, safe internet usage, and productivity tools (Word, Excel, PowerPoint). Fostered digital literacy and early interest in technology.',
            },
          ].map((job, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              {/* Timeline line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: job.color, marginTop: 4, flexShrink: 0 }} />
                {i < 5 && <div style={{ width: 2, flex: 1, background: 'var(--border)', marginTop: 4 }} />}
              </div>
              <div style={{ paddingBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  <strong style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{job.org}</strong>
                  {job.badge && (
                    <span style={{ padding: '2px 8px', borderRadius: 10, background: 'rgba(63,185,80,0.12)', border: '1px solid rgba(63,185,80,0.3)', color: 'var(--accent2)', fontSize: '0.72rem', fontWeight: 600 }}>
                      {job.badge}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', color: job.color, fontWeight: 600 }}>{job.role}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>· {job.period}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{job.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

