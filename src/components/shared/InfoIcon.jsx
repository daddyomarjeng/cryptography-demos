import { useState } from 'react';
import { Info } from 'lucide-react';
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
        <Info size={10} strokeWidth={2.5} />
      </button>
      {open && <InfoModal term={term} onClose={() => setOpen(false)} />}
    </>
  );
}
