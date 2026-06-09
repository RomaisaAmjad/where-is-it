import React, { useEffect } from 'react';
import { Check, X, AlertTriangle } from 'tabler-icons-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bgColor: 'bg-granny-teal/20 border-granny-teal text-granny-text',
      icon: <Check className="w-5 h-5 text-granny-teal shrink-0" />
    },
    error: {
      bgColor: 'bg-granny-salmon/20 border-granny-salmon text-granny-text',
      icon: <AlertTriangle className="w-5 h-5 text-granny-salmon shrink-0" />
    }
  };

  const current = config[type] || config.success;

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md transition-smooth animate-float ${current.bgColor} z-50`}
    >
      {current.icon}
      <span className="text-sm font-medium tracking-wide">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-75 transition-smooth p-0.5 rounded-lg focus-visible:outline-none"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-granny-text" />
      </button>
    </div>
  );
}
