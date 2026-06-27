import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'tabler-icons-react';

export default function DeleteConfirmModal({ isOpen, onCancel, onConfirm }) {
  const confirmBtnRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Auto-focus the cancel button for safe default
      const timer = setTimeout(() => {
        confirmBtnRef.current?.focus();
      }, 50);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
      };
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-granny-text/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="bg-granny-canvas border border-granny-panel w-full max-w-sm rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-desc"
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-granny-text/40 hover:text-granny-salmon hover:bg-granny-salmon/10 rounded-sm transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-granny-salmon"
          aria-label="Cancel and close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-granny-salmon/10 border border-granny-salmon/30 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-8 h-8 text-granny-salmon" />
        </div>

        {/* Title */}
        <div className="text-center flex flex-col gap-2">
          <h2
            id="delete-modal-title"
            className="text-lg font-extrabold tracking-tight text-granny-text"
          >
            Delete Item
          </h2>
          <p
            id="delete-modal-desc"
            className="text-sm text-granny-text/70 leading-relaxed"
          >
            Do you really want to execute this action?{' '}
            <span className="font-semibold text-granny-text/90">
              It cannot be undone.
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full mt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-sm border border-granny-panel text-sm font-semibold tracking-wide text-granny-text hover:bg-granny-panel/30 transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-granny-salmon cursor-pointer"
          >
            Cancel
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-sm bg-granny-salmon text-sm font-semibold tracking-wide text-white hover:bg-granny-salmon/85 shadow-md hover:shadow-lg transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-granny-salmon active:scale-95 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
