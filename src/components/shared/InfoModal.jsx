import { useEffect } from 'react';
import { BookOpen, X } from 'lucide-react';
import { GLOSSARY } from '../../data/glossary';

export default function InfoModal({ term, onClose }) {
  const entry = GLOSSARY[term];

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!entry) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <BookOpen size={18} strokeWidth={2} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <h3 className="modal-title">{entry.title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={14} />
          </button>
        </div>
        <div className="modal-body">
          <p>{entry.body}</p>
        </div>
        <div className="modal-footer">
          <span className="modal-tag">Cryptography Glossary</span>
          <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 14px' }} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
