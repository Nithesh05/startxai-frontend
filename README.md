# StartXAI — Enterprise Business Intelligence & Strategy

StartXAI is an AI-powered Business Strategy & Intelligence platform designed to help founders, entrepreneurs, and executives formulate execution roadmaps, validate unit economics, and build high-conversion customer acquisition funnels.

## Architecture

- **Frontend:** Pure HTML5, Modern CSS3 (Enterprise Obsidian & Business Palette), Vanilla JavaScript.
- **Backend:** Spring Boot (Java 17) web service deployed on Render (`https://startxai-backend.onrender.com`).
- **Intelligence Engine:** Google Gemini API (`gemini-3.5-flash-lite`).

## Features

1. **Enterprise Business Color Palette:** Built using business psychology colors: Obsidian Navy (Trust & Security), Electric Cobalt (Authority), Emerald Mint (Profit & Growth), and Titanium Gold (High-Value Strategy).
2. **Rich Markdown Strategy Renderer:** Automatically parses structured headers, custom styled bullet lists, execution phases, and financial comparison tables.
3. **One-Click Strategy Actions:**
   - **Copy Strategy:** Instantly copies the generated roadmap to the clipboard with toast feedback.
   - **Export Report:** Downloads the entire session as a timestamped Markdown document.
   - **Reset Session:** Clears conversational memory to explore a new business initiative.
4. **Zero Client Secrets:** No API keys, credentials, or backend internals are exposed in the client code. Secure and ready for public internet hosting.
5. **Fail-Safe Reliability:** Resilient against momentary traffic spikes or cold starts, guaranteeing a smooth experience.

## Deployment to the Internet

### Option A: Render (Static Site)
1. Push this folder to a GitHub repository (e.g. `startxai-frontend`).
2. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Static Site**.
3. Connect your repository.
4. Settings:
   - **Build Command:** *(leave blank)*
   - **Publish Directory:** `.`
5. Click **Create Static Site**.

### Option B: Vercel / Netlify
- Drag and drop this folder directly into the Vercel or Netlify dashboard. No build step required.

## Local Development
Run any static server:
```powershell
python -m http.server 5500
```
Open `http://localhost:5500` in your browser.
