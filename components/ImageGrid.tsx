import React from 'react';
import { ZoomIcon, DownloadIcon } from './icons';

interface ImageGridProps {
  images: string[];
  onZoom: (imgSrc: string) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onZoom }) => {

  const handleDownload = (imgSrc: string, index: number) => {
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = `zGenMedia_portrait_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
        {images.map((imgSrc, index) => (
            <div key={index} className="aspect-w-1 aspect-h-1 bg-gray-900 rounded-lg overflow-hidden shadow-md group relative">
              <img 
                  src={imgSrc} 
                  alt={`Generated portrait ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => onZoom(imgSrc)}
                  className="p-3 bg-gray-700/50 rounded-full text-white hover:bg-cyan-600/80 transition-all transform hover:scale-110"
                  title="Zoom"
                >
                  <ZoomIcon className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => handleDownload(imgSrc, index)}
                  className="p-3 bg-gray-700/50 rounded-full text-white hover:bg-cyan-600/80 transition-all transform hover:scale-110"
                  title="Download"
                >
                  <DownloadIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
        ))}
        </div>
    </div>
  );
};