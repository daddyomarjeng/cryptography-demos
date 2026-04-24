import { useState } from 'react';
import InfoModal from './InfoModal';

export default function InfoIcon({ term }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="info-icon-btn"
        onClick={() => setOpen(true)}
        title="Learn more"
        aria-label={`Info about ${term}`}
      >
        ⓘ
      </button>
      {open && <InfoModal term={term} onClose={() => setOpen(false)} />}
    </>
  );
}
