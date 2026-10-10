# GarageGuard AI — 3D Website, Dashboard & Roboflow Cloud Detector

A React + Vite parking garage experience with an interactive dashboard and **real image-upload object detection** powered by the Roboflow Cloud Workflow.

## 1. Configure Roboflow (required for real detection)

Create `.env.local` in the project root:

```env
ROBOFLOW_API_KEY=YOUR_ROBOFLOW_PRIVATE_API_KEY
```

Get your key from **Roboflow → Workspace Settings → API Keys**. The app is already configured to use:

- Cloud URL: `https://serverless.roboflow.com`
- Workspace: `irfan-5hnr6`
- Workflow: `my-first-project-vmy-first-project-5j964-1-rfdetr-small-t1-logic`
- Workflow input: `image`

**Do not** put the key in React files, in a `VITE_` environment variable, or in GitHub. The included `.gitignore` excludes `.env.local`. If your key has been exposed publicly, rotate it in Roboflow.

## 2. Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173/#/demo`, then click **AI Detection** in the sidebar. Upload a JPG, PNG, or WebP image (or click **Try sample**). The image is resized locally and automatically submitted to the **real Roboflow cloud workflow**. The result appears with bounding boxes, class labels, confidence scores, and a confidence slider.

**No `localhost:9001` inference server, Python process, or separate API process is needed.** The included Vite development middleware handles `/api/detect` locally.

## 3. Deploy to Vercel

1. Push this project to your GitHub repo (without `.env.local`).
2. Import the repository in Vercel. Select **Vite** if prompted. Build command: `npm run build`; output directory: `dist`.
3. In **Vercel → Project → Settings → Environment Variables**, add `ROBOFLOW_API_KEY` with your private key. Set it for Production (and Preview if needed).
4. Redeploy after saving the environment variable.
5. Open `https://YOUR_DOMAIN/#/demo` and select **AI Detection**.

Vercel runs `api/detect.js` as a serverless function. The browser never receives your API key. The key must be set both in Vercel and in `.env.local` if you want detection to work in both environments.

## How detection works

`Browser upload → /api/detect → Roboflow Cloud Workflow → predictions → bounding boxes on the uploaded photo`

The endpoint returns real model predictions. It does **not** fake detections if the model returns none or if the API fails. The other dashboard panels still contain simulated incident/camera/task data, and there is no live CCTV integration.

**Important:** The model will detect the *classes it was trained to recognize*. If the current workflow was trained only on oil spills, it will not reliably detect plastic bottles, cups, wrappers, or other litter. Train those classes in Roboflow and ensure your Workflow **Outputs** block exposes the model's `predictions` (not just a visualization image). The app accepts typical Workflows output names and nested prediction formats.

If you see a 503 configuration error, check your API key. If you see a workflow-output error, connect the object detection predictions to the Outputs block in the Roboflow Workflow editor.

## Other site features

- 3D scroll-driven garage landing page and black oil spill on the top floor.
- Compact GarageGuard logo in both headers; no center crosshair or live-view title overlay.
- Clickable `...` story text, expanded without a shadow fade.
- Dashboard with repeated incidents, sample camera stills, floor map, tasks and analytics.

## Tests

```bash
npm run test
npm run build
```

> The included tests validate request formatting and response parsing with mock Roboflow replies. Live Roboflow inference requires a valid API key and a deployed workflow.
