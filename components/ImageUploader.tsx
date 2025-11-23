import React, { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { UploadIcon, CloseIcon } from './icons';

interface ImageUploaderProps {
  label: string;
  id: string;
  onImageUpload: (file: File | null) => void;
  onClear?: () => void;
  acceptedFormatsText?: string;
  key?: string | number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, id, onImageUpload, onClear, acceptedFormatsText = "PNG, JPG, WEBP" }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
      setFileName(file.name);
    } else {
      setPreview(null);
      onImageUpload(null);
      setFileName('');
    }
  }, [onImageUpload]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files ? e.target.files[0] : null);
  };
  
  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files ? e.dataTransfer.files[0] : null);
  };
  
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    setFileName('');
    onImageUpload(null);
    if(onClear) {
        onClear();
    }
    const input = document.getElementById(id) as HTMLInputElement;
    if(input) input.value = '';
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <label
        htmlFor={id}
        className={`relative group flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
        ${isDragging ? 'border-cyan-400 bg-gray-700' : 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="object-contain w-full h-full rounded-lg p-1" />
            {onClear && (
                <button
                    onClick={handleClear}
                    className="absolute top-2 right-2 bg-gray-800/70 text-white rounded-full p-1.5 hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Clear image"
                >
                    <CloseIcon className="w-4 h-4" />
                </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
            <UploadIcon className="w-8 h-8 mb-3" />
            <p className="mb-2 text-sm"><span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop</p>
            <p className="text-xs">{acceptedFormatsText}</p>
          </div>
        )}
        <input id={id} type="file" className="hidden" accept="image/*" onChange={onFileChange} />
      </label>
      {fileName && <p className="text-xs text-gray-500 mt-1 truncate">File: {fileName}</p>}
    </div>
  );
};