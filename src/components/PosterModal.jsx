import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

const PosterModal = ({ image, alt }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 backdrop-blur-md p-4 sm:p-6 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative flex w-full max-w-[92vw] flex-col items-center justify-center sm:max-w-md md:max-w-lg lg:max-w-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close poster"
          className="absolute -right-2 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-xl transition-all hover:bg-slate-100 active:scale-95 sm:-right-4 sm:-top-4 sm:h-10 sm:w-10"
        >
          <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <img
          src={image}
          alt={alt}
          className="max-h-[84dvh] w-auto max-w-full rounded-xl border border-white/25 bg-white object-contain shadow-2xl sm:rounded-2xl"
        />
      </div>
    </div>
  );
};

export default PosterModal;
