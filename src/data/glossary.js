export const GLOSSARY = {
  encryption: {
    title: 'Encryption',
    body: 'Encryption is the process of converting readable data (plaintext) into an unreadable format (ciphertext) using a mathematical algorithm and a key. Only authorized parties with the correct key can reverse this process (decryption) to recover the original data.',
  },
  decryption: {
    title: 'Decryption',
    body: 'Decryption is the reverse of encryption — it converts ciphertext back into readable plaintext using the appropriate key and algorithm. Without the correct key, decryption is computationally infeasible for strong algorithms.',
  },
  plaintext: {
    title: 'Plaintext',
    body: 'Plaintext (or cleartext) is the original, readable data before it is encrypted. It could be a text message, a file, or any digital information that you want to protect from unauthorized access.',
  },
  ciphertext: {
    title: 'Ciphertext',
    body: 'Ciphertext is the scrambled, unreadable output produced after encrypting plaintext with a cryptographic algorithm and key. Without the decryption key, ciphertext should appear as random, meaningless data.',
  },
  symmetric: {
    title: 'Symmetric Encryption',
    body: 'Symmetric encryption uses the same secret key for both encryption and decryption. It is fast and efficient, making it ideal for encrypting large volumes of data. The main challenge is securely sharing the secret key between parties. Examples: AES, Triple DES, ChaCha20.',
  },
  asymmetric: {
    title: 'Asymmetric Encryption',
    body: 'Asymmetric encryption (also called public-key cryptography) uses a mathematically linked key pair: a public key for encryption and a private key for decryption. Anyone can encrypt with the public key, but only the private key holder can decrypt. Slower than symmetric encryption. Examples: RSA, ECC, ElGamal.',
  },
  aes: {
    title: 'AES — Advanced Encryption Standard',
    body: 'AES (Advanced Encryption Standard) is a symmetric block cipher standardized by NIST in 2001. It operates on 128-bit blocks with key sizes of 128, 192, or 256 bits. It is the most widely adopted symmetric cipher in the world — used by governments, militaries, and HTTPS.',
  },
  aes_cbc: {
    title: 'AES-CBC — Cipher Block Chaining',
    body: 'CBC mode XORs each plaintext block with the previous ciphertext block before encrypting. This chains the blocks together so identical plaintext blocks produce different ciphertext, preventing pattern analysis. Requires an Initialization Vector (IV) for the first block. Most commonly used AES mode.',
  },
  aes_ecb: {
    title: 'AES-ECB — Electronic Code Book',
    body: 'ECB is the simplest AES mode — each plaintext block is encrypted independently with the same key. This means identical plaintext blocks produce identical ciphertext blocks, revealing data patterns. ECB is generally considered insecure for most use cases and is provided here for educational comparison.',
  },
  aes_ctr: {
    title: 'AES-CTR — Counter Mode',
    body: 'CTR mode turns a block cipher into a stream cipher by encrypting a counter value and XORing the result with the plaintext. It is highly parallelizable (great for performance), allows random access, and does not require padding. Widely used in TLS and disk encryption.',
  },
  triple_des: {
    title: 'Triple DES (3DES)',
    body: 'Triple DES applies the original DES (Data Encryption Standard) algorithm three times to each block with different keys, making it significantly stronger than DES. Key size is effectively 112–168 bits. It is slower than AES and largely deprecated in modern systems, but still encountered in legacy applications.',
  },
  rsa: {
    title: 'RSA — Rivest–Shamir–Adleman',
    body: 'RSA is the most widely used asymmetric encryption algorithm. Its security is based on the mathematical difficulty of factoring the product of two large prime numbers. RSA keys are typically 2048–4096 bits. It is used for secure key exchange, digital signatures, and encrypting small amounts of data.',
  },
  rsa_oaep: {
    title: 'RSA-OAEP — Optimal Asymmetric Encryption Padding',
    body: 'OAEP is a padding scheme used with RSA encryption. It adds randomness (a random seed) to the plaintext before encrypting, ensuring that encrypting the same message twice produces different ciphertext. OAEP is the recommended and secure padding scheme for RSA, replacing the older PKCS#1 v1.5 padding.',
  },
  public_key: {
    title: 'Public Key',
    body: 'A public key is the shareable half of an asymmetric key pair. It can be freely distributed to anyone. Others use it to encrypt messages that only you (the private key holder) can decrypt, or to verify digital signatures that you created with your private key.',
  },
  private_key: {
    title: 'Private Key',
    body: 'A private key is the secret half of an asymmetric key pair. It must be kept confidential and never shared. It is used to decrypt messages encrypted with the corresponding public key, and to create digital signatures that others can verify with your public key.',
  },
  key_pair: {
    title: 'Key Pair',
    body: 'A key pair is a set of two mathematically related cryptographic keys: a public key and a private key. They are generated together so that data encrypted with one can only be decrypted by the other. The relationship is one-way — deriving the private key from the public key is computationally infeasible.',
  },
  digital_signature: {
    title: 'Digital Signature',
    body: "A digital signature is a cryptographic proof of authenticity. The sender hashes their message and encrypts the hash with their private key. Anyone with the sender's public key can verify: (1) the message came from the claimed sender, and (2) the message has not been tampered with. It is the digital equivalent of a handwritten signature.",
  },
  sha256: {
    title: 'SHA-256 — Secure Hash Algorithm 256',
    body: 'SHA-256 is a cryptographic hash function from the SHA-2 family. It produces a fixed 256-bit (32-byte) hash "fingerprint" from any input. It is one-way (you cannot reverse a hash), deterministic (same input always gives same hash), and collision-resistant (practically impossible to find two inputs with the same hash). Used in digital signatures, certificates, and Bitcoin.',
  },
  base64: {
    title: 'Base64 Encoding',
    body: 'Base64 is a binary-to-text encoding scheme that represents binary data (like encrypted bytes) using only 64 printable ASCII characters (A–Z, a–z, 0–9, +, /). It is used to safely transmit or store binary cryptographic data in text-based systems like emails, JSON, or URLs. Base64 is encoding, not encryption — it offers no security.',
  },
  key_size: {
    title: 'Key Size (Bit Length)',
    body: 'Key size is the length of a cryptographic key in bits. Larger keys mean more possible key combinations, making brute-force attacks harder. For RSA: 1024-bit is considered weak today, 2048-bit is the current minimum recommended, 4096-bit provides stronger security at a performance cost. For AES: 128-bit is secure, 256-bit is the gold standard.',
  },
  secret_key: {
    title: 'Secret Key',
    body: 'In symmetric cryptography, the secret key (or shared key) is a piece of data known only to the communicating parties. It is used to both encrypt and decrypt messages. The secrecy of the communication depends entirely on keeping this key confidential. Key management and secure distribution are critical challenges.',
  },
};
