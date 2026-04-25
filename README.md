# 🛡️ Cryptography Playground

An open source, browser-based cybersecurity toolkit for interactively exploring cryptographic techniques — no server, no data collection, no setup required.

> **Developer:** Daddy Omar Jeng · [www.daddyomarjeng.com](https://www.daddyomarjeng.com)

---

## Modules

| Module | Description |
|---|---|
| **Symmetric Encryption** | AES (CBC, ECB, CTR modes) and Triple DES — encrypt/decrypt with a shared key |
| **Asymmetric Encryption** | RSA key generation, encryption/decryption, and digital signatures |

More cybersecurity modules are planned. Contributions are welcome!

---

## Features

- 🔐 **Real algorithms** — powered by production-grade libraries (`crypto-js`, `node-forge`)
- 🌐 **100% client-side** — all operations run in your browser; no data leaves your machine
- 📖 **Glossary-driven UI** — every cryptographic term links to an in-context explanation
- 🧩 **Modular architecture** — each concept is an independent React component

---

## Tech Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [crypto-js](https://github.com/brix/crypto-js) — symmetric encryption (AES, 3DES)
- [node-forge](https://github.com/digitalbazaar/forge) — asymmetric encryption (RSA, PKI)
- [lucide-react](https://lucide.dev/) — icons

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Contributing

Pull requests are welcome! To add a new cybersecurity module:

1. Create a new folder under `src/components/`
2. Build your demo as a self-contained React component
3. Register it as a new tab in `src/App.jsx`

---

## License

MIT © [Daddy Omar Jeng](https://www.daddyomarjeng.com)

