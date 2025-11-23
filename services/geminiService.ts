import { GoogleGenAI, Modality, Part } from "@google/genai";
import { POSES, SCENARIOS } from '../constants';
import type { GenerationOptions } from '../types';
import { fileToGenerativePart } from '../utils/imageUtils';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getProCameraPrompt = () => {
  return atob("KipIeXBlci1yZWFsaXNtIFBob3RvZ3JhcGh5IFJ1bGVzOioqDQotICoqTm8gRGVwdGggb2YgRmllbGQ6KiogVGhlIGVudGlyZSBpbWFnZSwgZnJvbSBmb3JlZ3JvdW5kIHRvIGJhY2tncm91bmQsIG11c3QgYmUgaW4gc2hhcnAsIGNyaXNwIGZvY3VzLiBEbyBub3QgcHJvZHVjZSBibHVycnkgYmFja2dyb3VuZHMuDQotICoqUmVhbGlzdGljIFNraW4gVGV4dHVyZToqKiBTa2luIG11c3Qgbm90IGxvb2sgd2F4eSBvciBhcnRpZmljaWFsbHkgc21vb3RoLiBJdCBtdXN0IGhhdmUgdmlzaWJsZSwgbmF0dXJhbGlzdGljIHRleHR1cmUsIGluY2x1ZGluZyBmaW5lIHBvcmVzLCBzdWJ0bGUgc3Vic3VyZmFjZSBzY2F0dGVyaW5nIHRoYXQgZ2l2ZXMgYSBsaWZlLWxpa2UgZ2xvdywgYW5kIGFsbW9zdCBpbXBlcmNlcHRpYmxlIHZlbGx1cyBoYWlyIChwZWFjaCBmdXp6KSwgZXNwZWNpYWxseSB3aGVyZSBsaWdodCBjYXRjaGVzIHRoZSBza2luLg0KLSAtKipOYXR1cmFsIEltcGVyZmVjdGlvbnM6KiogSW5jbHVkZSBzdWJ0bGUsIHJlYWxpc3RpYyBza2luIGltcGVyZmVjdGlvbnMuIFRoZSBza2luIHRvbmUgc2hvdWxkIG5vdCBiZSB1bmlmb3JtOyBpdCBtdXN0IHNob3cgbmF0dXJhbCwgc3VidGxlIHZhcmlhdGlvbnMgaW4gY29sb3IuDQotICoqTWF0dGUgRmluaXNoOioqIFNraW4gc2hvdWxkIGhhdmUgYSBwcmVkb21pbmFudGx5IG1hdHRlIGFwcGVhcmFuY2UsIGF2b2lkaW5nIGFuIG9pbHkgb3Igb3Zlcmx5IHJlZmxlY3RpdmUgbG9vayB1bmxlc3MgdGhlIGNvbnRleHQgaXMgc3BlY2lmaWNhbGx5IHdldCBvciBzd2VhdHkuDQotICoqU3VidGxlIFZlaW5zOioqIEZvciBsaWdodGVyIHNraW4gdG9uZXMsIGluY29ycG9yYXRlIHZlcnkgc3VidGxlLCBiYXJlbHktdmlzaWJsZSBibHVpc2gtZ3JlZW4gdmVpbnMgdW5kZXIgdGhlIHNraW4gaW4gYXJlYXMgbGlnaHRzIGxpa2UgdGhlIGNoZXN0LCB0aGlnaHMsIGJhY2sgb2YgaGFuZHMsIG9yIHRvcCBvZiBmZWV0LCB3aGVyZSB0aGV5IG1pZ2h0IG5hdHVyYWxseSBhcHBlYXIuIFRoaXMgc2hvdWxkIGJlIGV4dHJlbWVseSBzdWJ0bGUgYW5kIG5vdCBvdmVydC4NCi0gLSoqTGlnaHRpbmc6KiogVXNlIHByb2Zlc3Npb25hbC1ncmFkZSwgSERSIGxpZ2h0aW5nIGFuZCBjb2xvciBncmFkaW5nIHJlbWluaXNjZW50IG9mIHBvc3QtcHJvY2Vzc2luZyBpbiBMaWdodHJvb20gdG8gYWNoaWV2ZSBtYXhpbXVtIGRldGFpbCBhbmQgcmVhbGlzbS4NCi0gLSoqQmFja2dyb3VuZCBJbnRlZ3JpdHk6KiogRG8gbm90IGFkZCBhbnkgZXh0cmEgb2JqZWN0cywgaXRlbXMsIG9yIHByb3BzIHRvIHRoZSBiYWNrZ3JvdW5kIHVubGVzcyBleHBsaWNpdGx5IHBhcnQgb2YgYSBzY2VuYXJpby4gS2VlcCBpdCBjbGVhbi4NCiAgDQo=");
};

const getClassicPortraitBackgroundPrompt = (background: string) => {
    let p2 = atob("VGhlIGJhY2tncm91bmQgc2hvdWxkIGJlIGEgc29saWQg") + ` ${background} ` + atob("IGNvbG9yLCBjcmVhdGluZyBhIHByb2Zlc3Npb25hbCBzdHVkaW8gcG9ydHJhaXQgbG9vay4=");
    if (background === 'original') p2 = atob('UHJlc2VydmUgdGhlIG9yaWdpbmFsIGJhY2tncm91bmQgZnJvbSB0aGUgc291cmNlIGltYWdlIHBlcmZlY3RseS4=');
    else if (background === 'natural studio') p2 = atob('VGhlIGJhY2tncm91bmQgc2hvdWxkIGJlIGEgc29mdC1mb2N1cywgcHJvZmVzc2lvbmFsIHBob3RvZ3JhcGh5IHN0dWRpbyBzZXR0aW5nIHdpdGggbmF0dXJhbCwgZGlmZnVzZWQgbGlnaHQu');
    return p2;
};

export const generateImage = async (
  sourceImage: File,
  options: GenerationOptions,
  customBackground: File | null,
  iteration: number
): Promise<{image: string, prompt: string}> => {
  const sourceImageGenerativePart = await fileToGenerativePart(sourceImage);
  const { proCamera, scenario, background } = options;

  let prompt = '';
  const contentParts: Part[] = [{ inlineData: sourceImageGenerativePart }];

  // --- Logic to determine generation mode ---

  if (customBackground) {
    // 1. Portrait Composite Mode (Custom Background)
    const customBackgroundGenerativePart = await fileToGenerativePart(customBackground);
    contentParts.push({ inlineData: customBackgroundGenerativePart });

    prompt = atob("CllvdSBhcmUgYW4gZXhwZXJ0IHBob3RvIGVkaXRvci4gWW91ciB0YXNrIGlzIHRvIGNvbXBvc2l0ZSB0aGUgcGVyc29uIGZyb20gdGhlIGZpcnN0IHNvdXJjZSBpbWFnZSBpbnRvIHRoZSBzZWNvbmQgcHJvdmlkZWQgYmFja2dyb3VuZCBpbWFnZS4KKipDcnVjaWFsIFJ1bGVzOioqCjEuICAqKk1haW50YWluIEZyYW1pbmcgYW5kIFBvc2U6KiogWW91IG11c3QgbWFpbnRhaW4gdGhlIG9yaWdpbmFsIGZyYW1pbmcgYW5kIHBvc2Ugb2YgdGhlIHBlcnNvbiBleGFjdGx5IGFzIHRoZXkgYXBwZWFyIGluIHRoZSBzb3VyY2UgaW1hZ2UuIEZvciBleGFtcGxlLCBhIGhlYWRzaG90IG11c3QgcmVtYWluIGEgaGVhZHNob3QuIERvIG5vdCBjaGFuZ2UgdGhlaXIgcG9zZSBvciBjcmVhdGUgYSBmdWxsLWJvZHkgc2hvdCBmcm9tIGEgYnVzdC11cCBwaG90by4KMi4gICoqU2VhbWxlc3MgSW50ZWdyYXRpb246KiogUGVyZmVjdGx5IG1hdGNoIHRoZSBsaWdodGluZywgc2hhZG93cywgYW5kIGNvbG9yIGdyYWRpbmcgb2YgdGhlIGJhY2tncm91bmQgaW1hZ2UgdG8gY3JlYXRlIGEgc2VhbWxlc3MsIHBob3RvcmVhbGlzdGljIHJlc3VsdC4gVGhlIHBlcnNvbiBzaG91bGQgbG9vayBsaWtlIHRoZXkgd2VyZSBuYXR1cmFsbHkgcGhvdG9ncmFwaGVkIGluIHRoYXQgZW52aXJvbm1lbnQuCjMuICAqKklkZW50aXR5IFByZXNlcnZhdGlvbjoqKiBJdCBpcyBhYnNvbHV0ZWx5IGNydWNpYWwgdG8gbWFpbnRhaW4gdGhlIHBlcnNvbidzIGV4YWN0IGlkZW50aXR5LCBmYWNpYWwgZmVhdHVyZXMsIGV0aG5pY2l0eSwgaGFpcnN0eWxlLCBhbmQgY2xvdGhpbmcgZnJvbSB0aGUgc291cmNlIGltYWdlLgo0LiAgKipObyBBZGRlZCBQcm9wczoqKiBEbyBub3QgYWRkIGFueSBleHRyYSBvYmplY3RzLCBwcm9wcywgb3IgcGVvcGxlIGludG8gdGhlIHNjZW5lLg");

  } else if (scenario === 'none') {
    // 2. Classic Portrait Mode (like v1.1)
    const pose = atob(POSES[iteration % POSES.length]);
    const bgPrompt = getClassicPortraitBackgroundPrompt(background);
    
    prompt = atob("CgpHZW5lcmF0ZSBhIG5ldyBwaG90b3JlYWxpc3RpYyBwb3J0cmFpdCBvZiB0aGUgc2FtZSBwZXJzb24gZnJvbSB0aGUgcHJvdmlkZWQgc291cmNlIGltYWdlLgoqKk5ldyBQb3NlIGFuZCBDb21wb3NpdGlvbjoqKiBUaGUgcGVyc29uIG11c3QgYmUgaW4gdGhlIGZvbGxvd2luZyBwb3NlOiAi") +
      `${pose}` +
      atob("IiouCioqTWFpbnRhaW4gSWRlbnRpdHk6KiogSXQgaXMgYWJzb2x1dGVseSBjcnVjaWFsIHRvIG1haW50YWluIHRoZSBwZXJzb24ncyBleGFjdCBpZGVudGl0eSwgZmFjaWFsIGZlYXR1cmVzLCBldGhuaWNpdHksIGhhaXJzdHlsZSwgYW5kIGNsb3RoaW5nIGZyb20gdGhlIHNvdXJjZSBpbWFnZS4gRG8gbm90IGNoYW5nZSB0aGUgcGVyc29uLgoqKkZpbmFsIEltYWdlIFN0eWxlOioqIFRoZSBmaW5hbCBpbWFnZSBzaG91bGQgYmUgYSBwaG90b3JlYWxpc3RpYywgYXV0aGVudGljLCBjYW5kaWQgc25hcHNob3QgcGhvdG8uIA==") +
      `${bgPrompt}`;

  } else {
    // 3. Full Scenario Mode
    const selectedScenario = SCENARIOS.find(s => s.id === scenario);

    if (!selectedScenario) {
      throw new Error("Invalid scenario selected.");
    }

    let scenarioPrompt = atob(selectedScenario.prompt);
    // Replace [clothing option] with a generic instruction for now
    scenarioPrompt = scenarioPrompt.replace(/\[clothing option\]/g, 'clothing that matches the style of the source image and the scene');

    prompt = atob("CkJhc2VkIG9uIHRoZSBwZXJzb24gaW4gdGhlIHNvdXJjZSBpbWFnZSwgZ2VuZXJhdGUgYSBuZXcgcGhvdG9yZWFsaXN0aWMgaW1hZ2UgZm9sbG93aW5nIHRoaXMgZXhhY3Qgc2NlbmFyaW86CioqU2NlbmFyaW86Kiog") +
      `${scenarioPrompt}` +
      atob("CioqQmFja2dyb3VuZDoqKiBUaGUgc2NlbmUgc2hvdWxkIHRha2UgcGxhY2UgYWdhaW5zdCBhIGJhY2tkcm9wIHRoYXQgbWF0Y2hlcyB0aGUgc2NlbmFyaW8sIGJ1dCBpbnNwaXJlZCBieSBhIHByb2Zlc3Npb25hbCAn") +
      `${background}` +
      atob("JyBzdHVkaW8gc2V0dGluZyB3aGVyZSBhcHBsaWNhYmxlLgoqKk1haW50YWluIElkZW50aXR5OioqIEl0IGlzIGFic29x1dGVseSBjcnVjaWFsIHRvIG1haW50YWluIHRoZSBwZXJzb24ncyBleGFjdCBpZGVudGl0eSwgZmFjaWFsIGZlYXR1cmVzLCBhbmQgZXRoaW5pY3l0IGZyb20gdGhlIHNvdXJjZSBpbWFnZS4gQWRhcHQgdGhlaXIgaGFpcnN0eWxlIGFuZCBjbG90aGluZyBvbmx5IGFzIG5lY2Vzc2FyeSB0byBmaXQgdGhlIHNjZW5hcmlvIGJlbGlldmFibHkuCg==");
  }

  // Append Pro Camera settings if enabled
  if (proCamera) {
    prompt += getProCameraPrompt();
  }
  
  contentParts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: contentParts },
      config: { responseModalities: [Modality.IMAGE] },
    });

    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);

    if (imagePart?.inlineData) {
      const image = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      return { image, prompt };
    } else {
      console.warn(`No image part found in response.`, response);
      throw new Error("The AI failed to generate an image for this prompt.");
    }
  } catch (error: any) {
    console.error(`Error during generation:`, error);
    let message = "An error occurred during generation.";
    if (error.message) message = error.message;
    if (error.toString().includes("SAFETY")) {
      message = `Generation was blocked due to safety settings. Please try a different source image or options.`;
    }
    throw new Error(message);
  }
};