import { useState, useRef } from 'react';
import { Image, EyeOff, Eye } from 'lucide-react';

function textToBits(text) {
  const bytes = new TextEncoder().encode(text);
  let bits = '';
  for (const b of bytes) bits += b.toString(2).padStart(8, '0');
  bits += '00000000'; // null terminator
  return bits;
}

function bitsToText(bits) {
  let text = '';
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    const byte = parseInt(bits.slice(i, i + 8), 2);
    if (byte === 0) break;
    text += String.fromCharCode(byte);
  }
  return text;
}

export default function SteganographyDemo() {
  const [tab, setTab]         = useState('hide');
  const [message, setMessage] = useState('Secret message hidden in this image!');
  const [status, setStatus]   = useState('');
  const [extracted, setExtracted] = useState('');
  const canvasRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSrc, setImgSrc]   = useState('');
  const [outputSrc, setOutputSrc] = useState('');

  function loadImage(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      setImgSrc(e.target.result);
      setImgLoaded(true);
      setStatus('');
      setOutputSrc('');
      setExtracted('');
    };
    reader.readAsDataURL(file);
  }

  function hideMessage() {
    if (!imgSrc) { setStatus('Please load an image first.'); return; }
    if (!message) { setStatus('Please enter a message.'); return; }

    const bits = textToBits(message);
    const img  = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width  = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      if (bits.length > data.length) { setStatus('Message too long for this image.'); return; }

      for (let i = 0; i < bits.length; i++) {
        // Modify LSB of red channel only
        data[i * 4] = (data[i * 4] & 0xFE) | parseInt(bits[i], 10);
      }

      ctx.putImageData(imageData, 0, 0);
      setOutputSrc(canvas.toDataURL('image/png'));
      setStatus(`✓ Message hidden! ${bits.length} bits embedded across ${bits.length} pixels.`);
    };
    img.src = imgSrc;
  }

  function extractMessage() {
    if (!imgSrc) { setStatus('Please load a stego image.'); return; }

    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width  = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let bits = '';
      for (let i = 0; i < data.length / 4; i++) {
        bits += (data[i * 4] & 1).toString();
        // Stop early at null byte
        if (bits.length % 8 === 0) {
          const lastByte = parseInt(bits.slice(-8), 2);
          if (lastByte === 0) break;
        }
      }
      const text = bitsToText(bits);
      setExtracted(text || '(no hidden message found)');
    };
    img.src = imgSrc;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-icon purple"><Image size={18} strokeWidth={2} /></div>
          <div className="card-title">
            <h2>Steganography — LSB Technique</h2>
            <p>Hide text inside an image's least significant bits</p>
          </div>
        </div>

        <div className="info-box">
          <strong>Steganography</strong> hides data inside another medium without obvious changes.
          The <strong>LSB (Least Significant Bit)</strong> technique modifies the last bit of each pixel's
          red channel — a change invisible to the human eye — to encode the secret message bit by bit.
        </div>

        <div className="btn-group" style={{ marginBottom: 20 }}>
          <button className={`btn ${tab === 'hide' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('hide')}>
            <EyeOff size={14} /> Hide Message
          </button>
          <button className={`btn ${tab === 'extract' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('extract')}>
            <Eye size={14} /> Extract Message
          </button>
        </div>

        {/* Image upload */}
        <div className="form-group">
          <label>{tab === 'hide' ? 'Carrier Image (PNG recommended)' : 'Stego Image (with hidden message)'}</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => loadImage(e.target.files[0])}
            style={{ color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}
          />
        </div>

        {imgSrc && (
          <div style={{ marginBottom: 16 }}>
            <img src={imgSrc} alt="loaded" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 6, border: '1px solid var(--border)' }} />
          </div>
        )}

        {tab === 'hide' && (
          <>
            <div className="form-group">
              <label>Secret Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} />
            </div>
            <button className="btn btn-primary" onClick={hideMessage} disabled={!imgSrc}>
              <EyeOff size={14} /> Embed Message
            </button>
            {status && <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--accent2)' }}>{status}</p>}
            {outputSrc && (
              <div style={{ marginTop: 16 }}>
                <div className="output-label">Stego Image (download & use with Extract tab)</div>
                <img src={outputSrc} alt="stego" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 6, border: '1px solid var(--border)', marginBottom: 8 }} />
                <a href={outputSrc} download="stego-image.png" className="btn btn-outline" style={{ textDecoration: 'none', fontSize: '0.82rem' }}>
                  ⬇ Download Stego Image
                </a>
              </div>
            )}
          </>
        )}

        {tab === 'extract' && (
          <>
            <button className="btn btn-primary" onClick={extractMessage} disabled={!imgSrc}>
              <Eye size={14} /> Extract Message
            </button>
            {extracted && (
              <div style={{ marginTop: 16 }}>
                <div className="output-label">Extracted Message</div>
                <div className="output-box">{extracted}</div>
              </div>
            )}
          </>
        )}

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
