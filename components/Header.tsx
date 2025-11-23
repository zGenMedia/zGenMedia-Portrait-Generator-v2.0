import React, { useState, useEffect } from 'react';

export const Header: React.FC = () => {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    const baseCount = 14782;
    const initialCount = baseCount + Math.floor(Math.random() * 50);
    setUserCount(initialCount);

    const intervalId = setInterval(() => {
      setUserCount(prevCount => (prevCount ? prevCount + Math.floor(Math.random() * 3) + 1 : initialCount + 1));
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 shadow-lg sticky top-0 z-10 border-b border-gray-700">
      <div className="container mx-auto flex items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-700 mt-1 sm:mt-0">
            <img 
                src="https://storage.ko-fi.com/cdn/useruploads/641ac8f7-0ccd-47d0-b775-532bf235d9c4_7f5b18e9-ba-4cb3-a029-d6d243fdaabe.png" 
                alt="zGenMedia Logo" 
                className="w-full h-full object-cover"
            />
        </div>
        <div className="flex-grow">
            <h1 className="text-2xl font-bold text-white">zGenMedia's Portrait Generator v2.0</h1>
            <p className="text-sm text-gray-400">
              Create stunning portraits and scenes from a single image using AI.
              <span className="block sm:inline sm:ml-1">
                AI can make mistakes. We will update this daily. <a href="https://ko-fi.com/zgenmedia" target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-400 hover:underline">Donations</a> are appreciated.
              </span>
            </p>
            {userCount !== null && (
              <p className="text-xs text-cyan-300/80 mt-1 font-mono">
                {userCount.toLocaleString()} users strong and counting!
              </p>
            )}
            <div className="mt-3 pt-2 border-t border-gray-700">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Explore other zGenMedia apps:</h2>
                <nav className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <a href="https://ai.studio/apps/drive/12d9lkTyUpsW6RIK0PUTUu1g4OktC3HUM" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline font-medium">
                    InstaMeme Generator
                    </a>
                    <a href="https://ai.studio/apps/drive/1Mzco4JGgDjy_u0uNd3-bEnhpXegLpP74" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline font-medium">
                    Group Photo Fusion
                    </a>
                    <a href="https://ai.studio/apps/drive/1nwkCHVk9YtueBc_yv1pFr325IwZTpUPU" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline font-medium">
                    Snapchat Generator
                    </a>
                    <a href="https://ai.studio/apps/drive/1U9xDutUGtL6m2z45iI0YWUnnR5l2pTXh" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline font-medium">
                    E-commerce Clothing Extractor
                    </a>
                    <a href="https://ai.studio/apps/drive/1VH9w6Ffurr-IsK03bQ6uEQtnoQfJxJ5N" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline font-medium">
                    Garment Grabber
                    </a>
                </nav>
            </div>
        </div>
      </div>
    </header>
  );
};