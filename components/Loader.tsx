import React from 'react';

interface LoaderProps {
  message?: string;
  progress: number; // A value from 0 to 1
}

export const Loader: React.FC<LoaderProps> = ({ message, progress }) => {
  const fillPercentage = Math.round(progress * 100);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-40 h-56 bg-gray-700/50 rounded-xl overflow-hidden relative border-2 border-gray-600 shadow-lg flex flex-col justify-center items-center p-4">
        {/* The liquid fill element */}
        <div
          className="absolute bottom-0 left-0 w-full bg-cyan-600 transition-all duration-300 ease-out"
          style={{ height: `${fillPercentage}%` }}
        >
          {/* A subtle wave-like element at the top of the liquid */}
          <div
            className="absolute top-0 left-0 w-full h-4 bg-cyan-500 opacity-50 blur-md"
            style={{ transform: 'translateY(-50%)' }}
          />
        </div>

        {/* Text content, always visible */}
        <div className="relative z-10 text-white">
          <p className="font-semibold">Generating</p>
          <p className="text-4xl font-bold my-2">{fillPercentage}%</p>
          {message && <p className="text-xs text-gray-300 h-8">{message}</p>}
        </div>
      </div>
    </div>
  );
};