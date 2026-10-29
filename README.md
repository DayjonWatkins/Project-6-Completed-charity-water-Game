# charity: water – Water Drop Game

An interactive, pure HTML, JavaScript, and CSS game inspired by charity: water's mission to bring clean and safe drinking water to every person on the planet.

Built with **zero framework dependencies** so you can deploy directly from the `main` branch root (`/`) on GitHub Pages without using a `/docs` folder or requiring build steps.

## Features

- **Difficulty Modes:**
  - **Easy (Gentle Rain):** 40s duration, 15-drop goal, relaxed fall speed (4.6s), 15% bad drops.
  - **Normal (Community Well):** 30s duration, 20-drop goal, standard speed (3.4s), 25% bad drops.
  - **Hard (Monsoon Rush):** 22s duration, 25-drop goal, fast fall speed (2.3s), 35% bad drops.
- **Interactive Game Elements:**
  - **Clean Drops (+1 pt):** Catch falling blue drops to supply clean water.
  - **Yellow Jerry Can Bonus (+3 pts):** Catch falling charity: water jerry cans for high-value bonuses!
  - **Contaminated Drops (-1 pt):** Avoid murky drops that reduce your score.
  - **Clean Water Reservoir:** Live water gauge that fills in real-time toward your community goal.
  - **Audio & Haptic Feedback:** Web Audio API sound synthesizers for drops, splash ripples, and victory fanfare (with mute toggle).
  - **High Scores:** Saved locally per difficulty mode.
- **charity: water Mission & Donation Section:**
  - Direct links to donate ($40 brings clean water to one person), explore "The Spring" monthly giving, and view GPS-mapped project proof.
  - Explanation of the 100% donation model (private donors cover overhead, so 100% of public gifts go directly to clean water projects).

---

## Deploying Directly from `main` on GitHub Pages (No `/docs` Needed!)

Because the game is built with standard `index.html`, `style.css`, and `script.js` directly in the repository root:

1. Push this repository to GitHub on branch `main`.
2. Go to your repository on GitHub and open **Settings** (top navigation tab).
3. In the left sidebar, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment**:
   - **Source**: Select **Deploy from a branch**.
   - **Branch**: Select **`main`** and folder **`/ (root)`**.
5. Click **Save**.
6. GitHub Pages will publish your site immediately at:
   ```
   https://<your-username>.github.io/<repository-name>/
   ```
   No `/docs` folder, no build commands, and no GitHub Actions required!

---

## Local Development (Optional)

You can view the game locally by simply opening `index.html` in any web browser, or using the included dev server:

```bash
# Start local dev server (port 3000)
npm run dev

# Lint syntax check
npm run lint
```
