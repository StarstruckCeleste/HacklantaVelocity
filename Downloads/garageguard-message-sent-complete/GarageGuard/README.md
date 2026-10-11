# GarageGuard AI — ONE PROJECT

This folder contains the **whole website and Roboflow backend together**. No need to open two terminals or manage two npm projects.

## Run on your computer

Install **Node.js 22** or newer. Open a terminal in this folder, then run:

```bash
npm install
npm run dev
```

On the **first local `npm run dev`**, the terminal asks for your existing private Roboflow API key. Paste it **in the terminal, not into website code**. It is saved in a local `.env` file that Git ignores, and the app starts automatically. Future runs need only `npm run dev`. The website starts at **http://localhost:5173/**; find the AI uploader at **http://localhost:5173/#/demo** → **AI Detection**. You can also run `npm run setup` manually if you ever need to replace your key.

## Publish the WHOLE app without needing your teammate's Vercel

1. Push this entire project to a **private** GitHub repository (do not commit `.env`).
2. Create a **Render Web Service** connected to that repository.
3. Set **Build Command**: `npm install && npm run build`.
4. Set **Start Command**: `npm start`.
5. Add **Environment Variable** `ROBOFLOW_API_KEY` with your private key in Render.
6. Deploy. Your single Render URL serves both the website and AI endpoint.

You don't need to configure CORS, add a Vercel URL, or manually edit any frontend endpoint. Both use the same origin. The model must have been trained on litter for litter to be detected.

## Notes

- **Live Camera Feed** dashboard panel and **Live Cameras** sidebar page have been removed. The simulated incident log, 3D garage, clickable oil spill, task features, contact page and real AI upload remain.
- The dashboard's historic incidents are example data. Only the **AI Detection** tab calls Roboflow Cloud.
- The Contact Us page now includes a **Send Message** button with required-field validation and success/error feedback. To actually deliver messages, create a form at https://formspree.io/ and set `VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID` in `.env` locally, or as a Render environment variable **before building/deploying**. The button will explain that delivery is not configured if no endpoint is set.
- Don't share your `.env` file or upload your key to a public GitHub repo. Rotate any previously exposed Roboflow keys.
- Production smoke test: `npm run build` then `npm start`, open `http://localhost:10000/`.

### Local vs public Roboflow setup

The first local `npm run dev` (or `npm run setup`) writes your private key to `.env` **only on your own computer**. It does not automatically configure the public website. For visitors to use AI Detection on Render, add `ROBOFLOW_API_KEY` under Render service **Environment** and redeploy. The same server-side key serves all visitors; never add it as a `VITE_` variable or embed it in frontend files.
\n**Important:** The downloadable ZIP intentionally contains **no Roboflow secret**. Putting the key in code, even a hidden JavaScript variable, would expose it to visitors. Set `ROBOFLOW_API_KEY` in Render's Environment settings once for public AI detection.\n