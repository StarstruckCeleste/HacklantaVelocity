# GarageGuard

[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r180-000000?style=flat&logo=three.js&logoColor=white)](https://threejs.org/)
[![Roboflow](https://img.shields.io/badge/Roboflow-Serverless_Workflow-purple?style=flat&logo=roboflow&logoColor=white)](https://roboflow.com/)
[![Deployment](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)

> *Say GG to parking deck hazards with GarageGuard!*

**Live Demo:** [www.ggeznodiff.us](https://www.ggeznodiff.us)
**Interactive Dashboard:** [www.ggeznodiff.us/#/dashboard](https://www.ggeznodiff.us/#/dashboard)

---

## Highlights

- **Automated Hazard & Spill Detection:** Identifies oil slicks, liquid puddles, broken glass, and litter from camera feeds using computer vision.
- **Leverages Existing Infrastructure:** Integrates directly with existing parking deck security and operational cameras, so no costly hardware overhauls required.
- **Worker-First Operations Dashboard:** Replaces exhausting blind sweeps with an intuitive 2D blueprint map, real-time task queue, and camera monitors designed specifically for cleaning crews and facility managers.
- **Real Roboflow Cloud Workflow:** Full image-upload detection powered by serverless Roboflow Workflows, client-side image compression, and server-side API key protection.
- **Recurrence Tracking & Hotspot Analytics:** Pinpoints repeat hazard areas to minimize facility downtime and mitigate multi-million dollar slip-and-fall liability insurance claims.

---

## Overview

### Problem Statement

In modern parking decks spanning ten or more floors and thousands of spaces, maintenance often falls on a single worker or small custodial crew. Cleaners typically rely on **circular sweeps:**: walking entire structures floor-by-floor in search of spills and trash. This routine is physically exhausting, wastes hours of valuable labor, and leaves critical hazards unaddressed until someone files a complaint or an injury occurs.

Parking facility operators face **millions of dollars in liability claims** every year stemming from slip-and-fall accidents, vehicle skidding, and property damage caused by unaddressed oil slicks, broken glass, and debris.

### The GarageGuard Solution

**GarageGuard** bridges the gap between passive surveillance and active maintenance. By tapping into the thousands of operational cameras already installed throughout modern garages, GarageGuard applies computer vision to continuously monitor decks for hazards.

When a hazard is identified:

1. It is mapped to its exact floor and zone on a 2D digital blueprint.
2. An actionable cleaning task is dispatched with priority classification.
3. Custodial workers are routed directly to the problem, eliminating blind searching.
4. Operators gain visibility into hotspot recurrence to prevent future incidents.

The result is safer parking structures, protected workers, lower operational costs, and reduced facility liability.

---

## Usage Instructions

GarageGuard is accessible directly via web browser at [www.ggeznodiff.us](https://www.ggeznodiff.us) (or `http://localhost:5173` locally).

### 1. Exploring the 3D Experience

- **Scroll Navigation:** Scroll vertically or use the `←` / `→` arrow keys to tour the multi-level 3D parking deck.
- **Inspect Hazards:** Click directly on the black oil spill on the top deck to immediately open the Chapter 3 incident report.
- **Deep-Dive Chapters:** Click `[read more]` on any narrative slide to expand full operational case studies and cleaner safety analyses.
- **Launch the Dashboard:** Click **Enter the Experience** or navigate to Chapter 06 to access the live operations environment.

### 2. Operating the Facilities Dashboard

The dashboard is purpose-built for facility directors, janitorial supervisors, and cleaning crews:

- **Daily Incident Triage (Dashboard Tab):** View total detections, open tasks, high-priority warnings, and repeat hotspot summaries at a glance. Select any detection to inspect its location, camera tag, and confidence score.
- **2D Floor Blueprint Navigation (Floor Map Tab):** Select floors (Levels 1–4) to view top-down spatial layouts. Click color-coded markers (High, Medium, Low, Resolved) to view item details and pinpoint exact locations instead of sweeping blind.
- **CCTV Feed Monitoring (Live Cameras Tab):** Browse camera stills across floors and zones (A–F). Review AI-detected hazard bounding boxes and click **Create / View Task** to initiate cleaning jobs directly from footage.
- **Task Dispatch & Management (Tasks Tab):** Manage active cleaning jobs across the deck. Filter by status (`Pending`, `Assigned`, `In Progress`, `Completed`) and update task states with the responsive dropdown menu as crews finish their sweeps.
- **Recurrence & Spill Tracking (Repeated Incidents Tab):** Identify persistent problem areas where waste or fluid regularly accumulates in the same floor and zone. View sighting history timelines, inspect repeat counts, or click **Simulate Repeat** to test operational alerts.
- **Analytics & Reporting (Analytics Tab):** Review detection volume breakdown by floor and hazard risk distribution. Click **Export CSV** to download complete telemetry and incident logs for facility audits.

### 3. Running Real AI Cleanup Detection

- Navigate to the **AI Cleanup Detection** tab from the dashboard sidebar.
- **Upload an Image:** Drag and drop or browse for a parking garage image (JPG, PNG, or WebP), or click **Try sample** to use a preloaded photo.
- **Automated Processing:** The client automatically resizes and compresses the photo before sending it to the serverless Roboflow cloud pipeline.
- **Review Detections:** Inspect generated bounding boxes, class labels, and confidence ratings drawn directly over the image.
- **Tune Sensitivity:** Adjust the **Confidence Filter** slider in real time to filter out low-confidence predictions.
- **Inspect Payload:** Expand the **Raw JSON Output** accordion to review raw model responses and telemetry.

### 4. Contact & Consultation

- Facility owners and parking deck operators can submit inquiries or request deployment assistance via the consultation form at `#/contact`.

---

## How AI Detection Works

```
[ User Image Upload ]
         │
         ▼
[ Client-side Resizing & Base64 Encoding ]
         │
         ▼
[ POST /api/detect ] ─── (Vite Local Proxy or Vercel Serverless Function)
         │                └── Injects private ROBOFLOW_API_KEY safely
         ▼
[ Roboflow Cloud Workflow ] (irfan-5hnr6 / Serverless API)
         │
         ▼
[ Predictions JSON (bounding boxes, labels, confidence) ]
         │
         ▼
[ Canvas Overlay & Interactive Hazard Review ]
```

- **Zero Client Key Leaks:** The browser never sees or stores `ROBOFLOW_API_KEY`.
- **Serverless Simplicity:** No local Python environments, Docker containers, or background inference servers required.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `yarn`

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/max-h-777/HacklantaVelocity.git
cd HacklantaVelocity
npm install
```

### 2. Configure Environment Variables (Required for live AI detection)

Create a `.env.local` file in the root directory:

```env
ROBOFLOW_API_KEY=your_private_roboflow_api_key_here
```

> **Where to get your key:** In your [Roboflow Dashboard](https://app.roboflow.com/) under **Workspace Settings → API Keys**.The project connects to the preconfigured serverless workflow:
>
> - **Workspace:** `irfan-5hnr6`
> - **Workflow:** `my-first-project-vmy-first-project-5j964-1-rfdetr-small-t1-logic`
>
> *(Optional)* To enable the contact page submission form:
>
> ```env
> VITE_CONTACT_FORM_ENDPOINT=https://formspree.io/f/your_form_id
> ```

### 3. Run Locally

```bash
npm run dev
```

Visit the application in your browser:

- **3D Landing Page:** [http://localhost:5173/](http://localhost:5173/)
- **Operator Dashboard:** [http://localhost:5173/#/dashboard](http://localhost:5173/#/dashboard)
- **AI Cleanup Detection:** [http://localhost:5173/#/dashboard](http://localhost:5173/#/dashboard) (select **AI Cleanup Detection** in the sidebar)
- **Contact Page:** [http://localhost:5173/#/contact](http://localhost:5173/#/contact)

---

## Deployment (Vercel)

GarageGuard is pre-configured for one-click deployment on [Vercel](https://vercel.com/):

1. Push your repository to GitHub (ensure `.env.local` is **not** committed; it is ignored by default in `.gitignore`).
2. In Vercel, click **Add New Project** and import your repository.
3. Framework Preset: **Vite**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Settings → Environment Variables**, add:
   - `ROBOFLOW_API_KEY` = `your_private_roboflow_api_key`
   - *(Optional)* `VITE_CONTACT_FORM_ENDPOINT` = `https://formspree.io/f/...`
5. Click **Deploy**. Vercel will host the frontend and automatically mount `api/detect.js` as a secure serverless endpoint.

---

## Testing & Validation

Run unit tests for the detection pipeline and payload handlers:

```bash
# Run API & parsing tests
npm run test

# Run production build validation
npm run build
```

The test suite validates request formatting, mock Roboflow response parsing, bounding box validation, and fallback handling.

---

## Built With

- **Frontend & UI:** [React 19](https://react.dev/), [Vite 7](https://vitejs.dev/)
- **3D Graphics & Animation:** [Three.js](https://threejs.org/)
- **Computer Vision & Cloud AI:** [Roboflow Serverless Workflows](https://roboflow.com/)
- **Backend & Middleware:** Node.js, Vercel Serverless Functions (`api/detect.js`), Vite dev server proxy
- **Styling:** Custom Vanilla CSS with responsive CSS Grid & Flexbox

---

## Authors

Created by **Team Velocity for the Hacklanta 2026 Hackathon.**

* Vedant Patel
* Aiden Sutton
* Saji Saravana
* Celeste Tung
