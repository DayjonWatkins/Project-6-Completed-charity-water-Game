# charity: water – Water Drop Game (React)

An interactive React web game inspired by charity: water's mission to bring clean and safe drinking water to every person on the planet.

## Features

- **Difficulty Modes:**
  - **Easy (Gentle Rain):** 40s duration, 15-drop goal, relaxed fall speed (4.6s), 15% bad drops.
  - **Normal (Community Well):** 30s duration, 20-drop goal, standard speed (3.4s), 25% bad drops.
  - **Hard (Monsoon Rush):** 22s duration, 25-drop goal, fast fall speed (2.3s), 35% bad drops.
- **Interactive Game Elements:**
  - **Clean Drops (+1 pt):** Catch falling blue drops to supply clean water.
  - **Yellow Jerry Can Bonus (+3 pts):** Catch falling charity: water jerry cans for high-value bonuses!
  - **Contaminated Drops (-1 pt):** Avoid murky drops that reduce your score.
  - **Clean Water Reservoir:** Live DOM water tank that fills in real-time toward your community goal.
  - **Audio & Haptic Feedback:** Web Audio API sound synthesizers for drops, splash ripples, and victory fanfare (with mute toggle).
  - **High Scores:** Saved locally per difficulty mode.
- **charity: water Mission & Donation Section:**
  - Direct links to donate ($40 brings clean water to one person), explore "The Spring" monthly giving, and view GPS-mapped project proof.
  - Explanation of the 100% donation model (private donors cover overhead, so 100% of public gifts go directly to clean water projects).

---

## Deploying on GitHub Pages (Recommended)

This repository includes an automated GitHub Actions deployment workflow (`.github/workflows/deploy.yml`).

### Setup Instructions:
1. Push this repository to GitHub.
2. In your GitHub repository, click **Settings** (top menu).
3. On the left sidebar, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment** -> **Source**, choose **GitHub Actions** from the dropdown.
5. Push any commit to `main` (or click **Actions** -> **Deploy to GitHub Pages** -> **Run workflow**).
6. Your game will be live at:
   ```
   https://<your-username>.github.io/<repository-name>/
   ```

Because Vite is configured with `base: './'`, all scripts, styles, and images load seamlessly on GitHub Pages repository subpaths without 404 errors.

---

## Deploying to Vercel, Netlify, or Cloudflare Pages

If you connect this repository to Vercel, Netlify, or Cloudflare Pages, use these default settings:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

## Local Development

```bash
# Install dependencies
npm install

# Start local dev server (port 3000)
npm run dev

# Build for production
npm run build
```
