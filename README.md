# UP FX Alerts Demo

Minimal demo scaffold (React + Vite) that simulates ingesting Universal Partners' homepage and sending a WhatsApp-style alert.

Quick start:

```bash
cd /Users/rorie/Code/JavaScript/ZachFX
npm install
npm run dev
```

Open the app, tap "Simulate Ingest" to load mock data, then "Send WhatsApp" to simulate sending a paraphrased alert.

Next steps I can take for you:
- Wire a simple backend endpoint to actually fetch the target site and run NER/sentiment (Node/Express).
- Implement a mocked LLM summarizer that produces concise WhatsApp-friendly messages.
- Add Twilio integration (requires credentials) and opt-in flow.

Tell me which next step to prioritize.

Deploying to Render
-------------------

To host this demo on Render as a static site:

1. Push this repo to GitHub (or GitLab).
2. Create a new Static Site on Render and connect your repository.
3. Use the build command: `npm ci && npm run build`.
4. Set the publish directory to `dist`.
5. (Optional) Add a `render.yaml` at the repo root — an example is included as `render.yaml`.

After deployment Render will serve the built `dist` directory. If you want me to add automated deploy configuration (Dockerfile or a CI workflow) or actually wire Twilio credentials, I can add that next.