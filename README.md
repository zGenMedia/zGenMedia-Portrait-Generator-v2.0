<div align="center">
<img width="1200" alt="PortraitGeneratorBanner" src="https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b509955d-13b3-4a1e-bf8a-69323b28dd78/original=true,quality=90/Untitled%20design.jpeg" />
</div>

<br/>

<div align="center">

# zGenMedia’s Portrait Generator v2.0  
Create stunning AI portraits and scenes from a single image — with identity preserved and zero prompt-writing required.

Powered by Google’s Gemini 2.5 Flash Image model.

<br/>

🔗 **Live App:** [add link here]  
💬 **Discord Community:** https://discord.gg/Aj2zqx7S  
☕ **Support development:** https://ko-fi.com/zgenmedia

</div>

---

## 🎨 What It Does

Portrait Generator v2.0 takes one source photo and turns it into a full set of new portraits or scenes while keeping the same person recognizable.

- **Identity-Preserving Portraits**  
  Upload a source image and generate new poses, angles, and lighting while maintaining facial features, hair, and overall identity.

- **Portrait Grid Mode**  
  Produce a grid of varied portraits in one run (e.g., different expressions, crops, and subtle style changes).

- **Scenario Mode**  
  Drop the subject into pre-built environments like:
  - Selfie-style shots  
  - Beach or outdoor scenes  
  - Movie set or cinematic lighting  
  - Rainy streets, fashion runway, and more  

- **Custom Background (Composite Mode)**  
  Upload a separate background image and let the app composite the subject into that scene with matched lighting and perspective.

- **Pro Camera Mode**  
  Optional toggle that applies “hyper-real” photography rules:
  - Emphasis on skin texture and natural detail  
  - Controlled lighting and exposure  
  - Minimal fake blur; everything kept crisp and readable  

- **Output Management**  
  - Responsive gallery view  
  - Click to zoom images in a modal  
  - Download single images or export everything as a ZIP  

- **Safety & SFW Focus**  
  The built-in prompts enforce wholesome, SFW content only.

---

## 🧩 Extra App Features

- **Protected Prompt Logic**  
  The detailed prompt recipes are encoded inside the app to reduce prompt scraping and keep results consistent.

- **Optional Debug Mode**  
  A hidden debug toggle (for advanced users) can reveal the exact prompts used and include them in the ZIP export. Useful for people who want to study or extend the workflow.

- **Engagement & Monetization Hooks**  
  - Integrated ad banner area for leaderboard-style ads  
  - Simulated “active user” counter in the header to showcase activity  

These extras are there so the app can be shared widely and still help support further development.

---

## 🛠 Tech Overview

- **Frontend:** React 19, TypeScript, Vite  
- **Styling:** Tailwind CSS  
- **AI Model:** Google Gemini 2.5 Flash Image (`gemini-2.5-flash-image` via `@google/genai`)  
- **Downloads:** jszip for bundling multiple images into a single ZIP file  

Built for web first, but the logic can be adapted into other tools and pipelines.

---

## 💡 How It Works (End-User Flow)

1. Upload a clear portrait of a person  
2. Choose a mode:
   - Portrait / grid
   - Scenario
   - Custom background composite  
3. (Optional) Enable Pro Camera Mode for extra realism  
4. Generate images and review the gallery  
5. Download your favorites or export everything at once

Good-quality source images give the best results.

---

## 💻 Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
---
✅ Licensing

Free for personal and commercial use.
Attribution appreciated but not required.

---

💛 Support the Project

This app — along with Group Photo Fusion, clothing tools, and meme generators — is intentionally free so creators don’t have to rely on paywalled AI platforms.

If it helps you, consider supporting development:

https://ko-fi.com/zgenmedia

Tiers available:

Supporter — $3/mo
Creator Access — $9/mo
Power User — $25/mo
Sponsor — $60/mo
Corporate / Agency — $250/mo

Your support covers API + hosting costs and funds new features and apps.

🧠 Feedback & Feature Requests

Found a bug? Want a new scenario, pose pack, or composite option?

Discord: https://discord.gg/Aj2zqx7S

Or open an Issue here on GitHub.

---

👤 Creator

Built by zGenMedia — AI tools made for creators, not gatekeepers.

More experiments and apps coming soon.

<div align="center">

✨ Power to the creators ✊

</div> ```
