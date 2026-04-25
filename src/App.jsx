import { useState } from "react";
import {
  Shield,
  Key,
  LockKeyhole,
  Globe,
  Hash,
  Fingerprint,
  Lock,
  Code2,
  AlignLeft,
  Image,
  Network,
  FileKey,
  ShieldAlert,
  Zap,
  Database,
  Terminal,
  Calculator,
  TrendingUp,
  Sigma,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Info,
} from "lucide-react";
import "./App.css";

// Existing modules
import SymmetricDemo from "./components/symmetric/SymmetricDemo";
import AsymmetricDemo from "./components/asymmetric/AsymmetricDemo";
import AboutPage from "./components/about/AboutPage";

// Hashing & Integrity
import HashFunctionsDemo from "./components/hashing/HashFunctionsDemo";
import HMACDemo from "./components/hashing/HMACDemo";
import PasswordHashingDemo from "./components/hashing/PasswordHashingDemo";

// Encoding & Obfuscation
import EncodingPlaygroundDemo from "./components/encoding/EncodingPlaygroundDemo";
import CaesarCipherDemo from "./components/encoding/CaesarCipherDemo";
import SteganographyDemo from "./components/encoding/SteganographyDemo";

// Network & Web Security
import JWTDemo from "./components/network/JWTDemo";
import TLSExplainerDemo from "./components/network/TLSExplainerDemo";
import CORSCSPDemo from "./components/network/CORSCSPDemo";

// Attack Demonstrations
import BruteForceDemo from "./components/attacks/BruteForceDemo";
import SQLInjectionDemo from "./components/attacks/SQLInjectionDemo";
import XSSPlaygroundDemo from "./components/attacks/XSSPlaygroundDemo";

// Math Behind Crypto
import DiffieHellmanDemo from "./components/math/DiffieHellmanDemo";
import ECCDemo from "./components/math/ECCDemo";
import PrimeMathDemo from "./components/math/PrimeMathDemo";

const CATEGORIES = [
  {
    id: "cryptography",
    label: "Cryptography",
    Icon: Shield,
    modules: [
      { id: "symmetric", label: "Symmetric Encryption", Icon: Key, Component: SymmetricDemo },
      {
        id: "asymmetric",
        label: "Asymmetric Encryption",
        Icon: LockKeyhole,
        Component: AsymmetricDemo,
      },
    ],
  },
  {
    id: "hashing",
    label: "Hashing & Integrity",
    Icon: Hash,
    modules: [
      {
        id: "hash-functions",
        label: "Hash Functions",
        Icon: Fingerprint,
        Component: HashFunctionsDemo,
      },
      { id: "hmac", label: "HMAC", Icon: Lock, Component: HMACDemo },
      {
        id: "password-hashing",
        label: "Password Hashing",
        Icon: Key,
        Component: PasswordHashingDemo,
      },
    ],
  },
  {
    id: "encoding",
    label: "Encoding & Obfuscation",
    Icon: Code2,
    modules: [
      {
        id: "encoding-playground",
        label: "Encoding Playground",
        Icon: AlignLeft,
        Component: EncodingPlaygroundDemo,
      },
      {
        id: "caesar-cipher",
        label: "Caesar / ROT13",
        Icon: AlignLeft,
        Component: CaesarCipherDemo,
      },
      { id: "steganography", label: "Steganography", Icon: Image, Component: SteganographyDemo },
    ],
  },
  {
    id: "network",
    label: "Network & Web Security",
    Icon: Network,
    modules: [
      { id: "jwt", label: "JWT", Icon: FileKey, Component: JWTDemo },
      { id: "tls", label: "TLS/SSL Explainer", Icon: ShieldAlert, Component: TLSExplainerDemo },
      { id: "cors-csp", label: "CORS & CSP", Icon: Globe, Component: CORSCSPDemo },
    ],
  },
  {
    id: "attacks",
    label: "Attack Demonstrations",
    Icon: Zap,
    modules: [
      { id: "brute-force", label: "Brute Force", Icon: Zap, Component: BruteForceDemo },
      { id: "sql-injection", label: "SQL Injection", Icon: Database, Component: SQLInjectionDemo },
      {
        id: "xss-playground",
        label: "XSS Playground",
        Icon: Terminal,
        Component: XSSPlaygroundDemo,
      },
    ],
  },
  {
    id: "math",
    label: "Math Behind Crypto",
    Icon: Calculator,
    modules: [
      {
        id: "diffie-hellman",
        label: "Diffie-Hellman",
        Icon: TrendingUp,
        Component: DiffieHellmanDemo,
      },
      { id: "ecc", label: "ECC", Icon: Sigma, Component: ECCDemo },
      {
        id: "prime-math",
        label: "Prime & Modular Arithmetic",
        Icon: Calculator,
        Component: PrimeMathDemo,
      },
    ],
  },
];

const ALL_MODULES = CATEGORIES.flatMap((c) => c.modules);

export default function App() {
  const [activeId, setActiveId] = useState("symmetric");
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [collapsed, setCollapsed] = useState({});

  const toggleCategory = (id) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  const isMobile = () => window.innerWidth < 768;

  const handleNavSelect = (id) => {
    setActiveId(id);
    if (isMobile()) setSidebarOpen(false);
  };

  const ActiveComponent = ALL_MODULES.find((m) => m.id === activeId)?.Component;

  return (
    <div className="app-shell">
      {/* ── Mobile overlay ────────────────────────────────── */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        {/* Sidebar header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Shield size={20} strokeWidth={1.5} />
            {sidebarOpen && <span>CyberSec Playground</span>}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen((o) => !o)}>
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Category groups */}
        <nav className="sidebar-nav">
          {CATEGORIES.map(({ id, label, Icon, modules }) => {
            const isCollapsed = collapsed[id];
            return (
              <div key={id} className="sidebar-group">
                <button
                  className="sidebar-category"
                  onClick={() => toggleCategory(id)}
                  title={!sidebarOpen ? label : undefined}
                >
                  <Icon size={16} strokeWidth={1.8} />
                  {sidebarOpen && (
                    <>
                      <span className="sidebar-category-label">{label}</span>
                      {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                    </>
                  )}
                </button>
                {!isCollapsed && (
                  <div className="sidebar-items">
                    {modules.map(({ id: mid, label: mlabel, Icon: MIcon }) => (
                      <button
                        key={mid}
                        className={`sidebar-item ${activeId === mid ? "active" : ""}`}
                        onClick={() => handleNavSelect(mid)}
                        title={!sidebarOpen ? mlabel : undefined}
                      >
                        <MIcon size={14} strokeWidth={2} />
                        {sidebarOpen && <span>{mlabel}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* About link */}
          <div className="sidebar-group">
            <button
              className={`sidebar-category ${activeId === "about" ? "active" : ""}`}
              onClick={() => handleNavSelect("about")}
              title={!sidebarOpen ? "About" : undefined}
            >
              <Info size={16} strokeWidth={1.8} />
              {sidebarOpen && <span className="sidebar-category-label">About</span>}
            </button>
          </div>
        </nav>

        {/* Developer info at bottom */}
        {sidebarOpen && (
          <div className="sidebar-footer">
            {/* <div className="sidebar-dev">Daddy Omar Jeng</div> */}
            <div className="sidebar-dev">Omar Jeng</div>
            <a
              href="https://www.daddyomarjeng.com"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-dev-link"
            >
              <Globe size={11} /> www.daddyomarjeng.com
            </a>
          </div>
        )}
      </aside>

      {/* ── Main area ─────────────────────────────────────── */}
      <div className="main-area">
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="topbar-menu-btn" onClick={() => setSidebarOpen((o) => !o)}>
              <Menu size={18} />
            </button>
            <Shield size={18} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
            <span className="topbar-title">
              {activeId === "about"
                ? "About & Methods"
                : ALL_MODULES.find((m) => m.id === activeId)?.label ?? ""}
            </span>
          </div>
          <div className="topbar-right">
            <span className="topbar-badge">Open Source · MIT</span>
          </div>
        </header>

        {/* Page content */}
        <main className="main-content">
          {activeId === "about" ? <AboutPage /> : ActiveComponent ? <ActiveComponent /> : null}
        </main>

        {/* Footer */}
        <footer className="project-footer">
          <div className="project-footer-inner">
            <span>
              Daddy Omar Jeng &nbsp;·&nbsp;
              <a
                href="https://www.daddyomarjeng.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                www.daddyomarjeng.com
              </a>
            </span>
            <span className="project-footer-sep">|</span>
            <span>Open Source · MIT License</span>
            <span className="project-footer-sep">|</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Shield size={13} /> All operations run locally in your browser
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
