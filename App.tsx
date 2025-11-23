import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { Header } from './components/Header';
import { OptionsPanel } from './components/OptionsPanel';
import { ImageGrid } from './components/ImageGrid';
import { Loader } from './components/Loader';
import { ImageUploader } from './components/ImageUploader';
import { generateImage } from './services/geminiService';
import type { GenerationOptions } from './types';
import { CloseIcon, DownloadIcon } from './components/icons';
import AdBanner from './components/AdBanner';
import { topLeaderboardAds, bottomLeaderboardAds } from './ads';
import VersionModal from './components/VersionModal';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [customBackground, setCustomBackground] = useState<File | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  const initialOptions: GenerationOptions = useMemo(() => ({
    numImages: 4,
    background: 'black',
    proCamera: false,
    scenario: 'none',
    debugMode: false,
  }), []);

  const [options, setOptions] = useState<GenerationOptions>(initialOptions);

  // Hidden debug mode activation logic
  const keySequenceRef = useRef('');
  useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
          // Obfuscated trigger word: "bilan"
          const triggerWord = atob('YmlsYW4='); 
          keySequenceRef.current = (keySequenceRef.current + event.key).slice(-triggerWord.length);
          if (keySequenceRef.current.toLowerCase() === triggerWord) {
              setOptions(prev => ({ ...prev, debugMode: true }));
          }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
      };
  }, []);

  const resetState = useCallback(() => {
    setSourceImage(null);
    setCustomBackground(null);
    setGeneratedImages([]);
    setPrompts([]);
    setIsLoading(false);
    setStatusMessage('');
    setProgress(0);
    setError(null);
    setOptions(initialOptions);
  }, [initialOptions]);

  const handleCustomBackgroundUpload = (file: File | null) => {
    setCustomBackground(file);
    if (file) {
      // When a custom background is added, lock scenario to 'none' for composite mode
      setOptions(prev => ({...prev, scenario: 'none'}));
    }
  }

  const handleGenerate = useCallback(async () => {
    if (!sourceImage) {
      setError('Please upload a source image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setPrompts([]);
    setProgress(0);

    const newImages: string[] = [];
    const newPrompts: string[] = [];

    try {
      for (let i = 0; i < options.numImages; i++) {
        setStatusMessage(`Generating image ${i + 1} of ${options.numImages}...`);
        const result = await generateImage(sourceImage, options, customBackground, i);
        newImages.push(result.image);
        newPrompts.push(result.prompt);
        setGeneratedImages([...newImages]);
        setPrompts([...newPrompts]);
        setProgress((i + 1) / options.numImages);
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during image generation.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  }, [sourceImage, options, customBackground]);
  

  const dataURLToBlob = (dataURL: string) => {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }

  const handleDownloadAll = async () => {
    if (generatedImages.length === 0) return;
    const zip = new JSZip();
    generatedImages.forEach((imgSrc, index) => {
        const blob = dataURLToBlob(imgSrc);
        zip.file(`zGenMedia_image_${index + 1}.png`, blob);
    });
     if (options.debugMode && prompts.length > 0) {
      const promptsText = prompts.map((p, i) => `--- PROMPT FOR IMAGE ${i + 1} ---\n\n${p}`).join('\n\n\n');
      zip.file('prompts.txt', promptsText);
    }
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'zGenMedia_Generated_Images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {topLeaderboardAds.length > 0 && <AdBanner ad={topLeaderboardAds[0]} />}
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-6">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-cyan-400">1. Upload Subject</h2>
                <ImageUploader 
                    label="Source Image"
                    onImageUpload={setSourceImage}
                    onClear={() => setSourceImage(null)}
                    id="source-uploader"
                />
            </div>
            
            <OptionsPanel
              options={options}
              setOptions={setOptions}
              onGenerate={handleGenerate}
              onReset={resetState}
              isDisabled={isLoading}
              isReady={!!sourceImage}
              customBackground={customBackground}
              onCustomBackgroundUpload={handleCustomBackgroundUpload}
            />
          </aside>

          <section className="w-full lg:w-2/3 xl:w-3/4 bg-gray-800 p-6 rounded-2xl shadow-lg min-h-[60vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-cyan-400">3. Generated Images</h2>
              {generatedImages.length > 0 && !isLoading && (
                  <button onClick={handleDownloadAll} className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 text-cyan-300 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                      <DownloadIcon className="w-4 h-4" />
                      Download All as ZIP
                  </button>
              )}
            </div>

            <div className="flex-grow flex items-center justify-center">
              {isLoading ? (
                <Loader message={statusMessage} progress={progress} />
              ) : error ? (
                <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Generation Failed</h3>
                  <p>{error}</p>
                </div>
              ) : generatedImages.length > 0 ? (
                <ImageGrid images={generatedImages} onZoom={setZoomedImage} />
              ) : (
                <div className="text-center text-gray-400">
                  <p className="text-lg">Your generated images will appear here.</p>
                  <p className="text-sm">Upload an image and configure the options to get started.</p>
                </div>
              )}
            </div>
            {options.debugMode && prompts.length > 0 && !isLoading && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-bold text-cyan-400 mb-2">Debug Prompts</h3>
                <div className="bg-gray-900 p-4 rounded-lg max-h-48 overflow-y-auto font-mono text-xs">
                  {prompts.map((p, i) => (
                    <div key={i} className="mb-2 border-b border-gray-700 pb-2">
                      <p className="font-bold text-gray-400">Prompt for Image {i+1}:</p>
                      <pre className="whitespace-pre-wrap text-gray-300">{p}</pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-xs">
        {bottomLeaderboardAds.length > 0 && <AdBanner ad={bottomLeaderboardAds[0]} />}
        <p className="mt-4">Based off of Replicate's flux-kontext-apps/portrait-series. Thank you everyone that supports us on our group (<a href="https://www.facebook.com/groups/alrevolutionmidjourneydalle2stablediffusion" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">join here</a>).</p>
        <p>If you have any issues or want an app of your own make a request on our fb or our socials. We are ©zgenmedia everywhere and blkcosmo.com</p>
        <p className="mt-2">
          <button 
            onClick={() => setIsVersionModalOpen(true)}
            className="hover:underline text-gray-600 hover:text-cyan-400 transition-colors"
          >
            v2.0
          </button>
        </p>
      </footer>

      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" 
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <img src={zoomedImage} alt="Zoomed view" className="object-contain w-full h-full rounded-lg shadow-2xl" />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-colors"
              aria-label="Close zoomed image"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {isVersionModalOpen && <VersionModal onClose={() => setIsVersionModalOpen(false)} />}
    </div>
  );
};

export default App;