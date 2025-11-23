import React from 'react';
import type { GenerationOptions } from '../types';
import { MAX_IMAGES, BACKGROUND_OPTIONS, SCENARIOS } from '../constants';
import { GenerateIcon, ResetIcon } from './icons';
import { ImageUploader } from './ImageUploader';

interface OptionsPanelProps {
  options: GenerationOptions;
  setOptions: React.Dispatch<React.SetStateAction<GenerationOptions>>;
  onGenerate: () => void;
  onReset: () => void;
  isDisabled: boolean;
  isReady: boolean;
  customBackground: File | null;
  onCustomBackgroundUpload: (file: File | null) => void;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ 
    options, setOptions, onGenerate, onReset, isDisabled, isReady, customBackground, onCustomBackgroundUpload
}) => {
  const handleOptionChange = <K extends keyof GenerationOptions,>(key: K, value: GenerationOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };
  
  const isCustomBgMode = customBackground !== null;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
      <h2 className="text-xl font-bold text-cyan-400">2. Configure Scene</h2>

      <div className="space-y-4">
        <ImageUploader 
            label="Custom Background (Optional)"
            onImageUpload={onCustomBackgroundUpload}
            onClear={() => onCustomBackgroundUpload(null)}
            id="background-uploader"
            acceptedFormatsText='PNG, JPG, WEBP, AVIF'
        />
      </div>

      <div>
        <label htmlFor="scenario" className="block text-sm font-medium text-gray-300 mb-1">Scenario</label>
        <select
          id="scenario"
          value={options.scenario}
          onChange={(e) => handleOptionChange('scenario', e.target.value)}
          disabled={isDisabled || isCustomBgMode}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {SCENARIOS.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
         {isCustomBgMode && <p className="text-xs text-gray-500 mt-1">Scenarios are disabled when using a custom background.</p>}
      </div>

      <div>
        <label htmlFor="numImages" className="block text-sm font-medium text-gray-300">
          Quantity: <span className="font-bold text-white">{options.numImages}</span>
        </label>
        <input
          id="numImages"
          type="range"
          min="1"
          max={MAX_IMAGES}
          value={options.numImages}
          onChange={(e) => handleOptionChange('numImages', parseInt(e.target.value, 10))}
          disabled={isDisabled}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="background" className="block text-sm font-medium text-gray-300 mb-1">Standard Background</label>
        <select
          id="background"
          value={options.background}
          onChange={(e) => handleOptionChange('background', e.target.value)}
          disabled={isDisabled || isCustomBgMode}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {BACKGROUND_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {isCustomBgMode && <p className="text-xs text-gray-500 mt-1">Standard backgrounds are disabled when using a custom background.</p>}
      </div>

      <div className="pt-4 border-t border-gray-700 space-y-4">
        <label htmlFor="proCamera" className="flex items-center justify-between text-sm font-medium text-gray-300 cursor-pointer">
            <span>Pro Camera Mode</span>
            <div className="relative">
                <input 
                    id="proCamera" 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={options.proCamera}
                    onChange={(e) => handleOptionChange('proCamera', e.target.checked)}
                    disabled={isDisabled} 
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </div>
        </label>
      </div>


      <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700">
        <button
          onClick={onGenerate}
          disabled={isDisabled || !isReady}
          className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <GenerateIcon className="w-5 h-5"/>
          {isDisabled ? 'Generating...' : 'Generate'}
        </button>
        <button
          onClick={onReset}
          disabled={isDisabled}
          className="w-full flex items-center justify-center gap-2 bg-gray-600 text-gray-200 font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors duration-200 disabled:opacity-50"
        >
          <ResetIcon className="w-5 h-5"/>
          Reset
        </button>
      </div>
    </div>
  );
};