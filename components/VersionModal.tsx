import React, { useState, useEffect, useCallback } from 'react';
import { SpinnerIcon, CloseIcon } from './icons';

interface VersionModalProps {
  onClose: () => void;
}

const VersionModal: React.FC<VersionModalProps> = ({ onClose }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersionHistory = async () => {
      try {
        // Fetch from the root, as it's a static asset in the public directory
        const response = await fetch('/version.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch version history: ${response.statusText}`);
        }
        const data = await response.json();
        setContent(data.description);
      } catch (err: any) {
        setError(err.message || 'Could not load version history.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersionHistory();
  }, []);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [handleKeyDown]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-cyan-400">Version History</h2>
          <button
            onClick={onClose}
            className="bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600 transition-colors"
            aria-label="Close version history"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto flex-grow">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <SpinnerIcon className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
              <h3 className="font-semibold">Error</h3>
              <p>{error}</p>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-300">
              {content}
            </pre>
          )}
        </main>
      </div>
    </div>
  );
};

export default VersionModal;
