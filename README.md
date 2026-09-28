<div align="center">

# GymMane — PWA

### Lift. Log it. Grow.

A free, offline-first gym log and workout tracker Progressive Web App (PWA) for **Android**, **iOS**, and **Web**.<br/>
Tap the muscles you want to train, log your sets, track PRs, and watch your numbers go up.

<br/>

[![PWA Ready](https://img.shields.io/badge/PWA-Installable-blue.svg?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Android Supported](https://img.shields.io/badge/Android-PWA%20%2F%20Chrome-3DDC84?style=flat&logo=android&logoColor=white)](https://f-droid.org/packages/com.gymmane.app/)
[![iOS Safari Supported](https://img.shields.io/badge/iOS-Safari%20PWA-000000?style=flat&logo=apple&logoColor=white)](https://apple.com)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222222?style=flat&logo=github&logoColor=white)](https://pages.github.com/)
[![License GPLv3](https://img.shields.io/badge/Code-GPLv3-C2410C?style=flat&logo=gnu&logoColor=white)](LICENSE)
[![Art CC BY-SA 4.0](https://img.shields.io/badge/Art-CC%20BY--SA%204.0-8A6B41?style=flat&logo=creativecommons&logoColor=white)](https://creativecommons.org/licenses/by-sa/4.0/)

<br/>

</div>

---

## What it does

<table>
<tr>
<td width="50%" valign="top">

### Training

- **Interactive Body Map**: Front and back views — tap any muscle to highlight and discover exercises
- **Live Workout Session**: Reps, weight (kg / lb), set types (*Working, Warm-up, Drop set, To failure*), and RPE
- **Rest Timer**: Automatic countdown with authentic audio chime and haptic feedback
- **Plate Math Calculator**: Instantly breakdowns plates required per side right from the active set
- **Routines & Templates**: Full Body, Push Pull Legs, Upper Lower, StrongLifts 5×5, Home / No Kit, plus custom builder
- **Minimized Workout Bar**: Minimized pill keeps your session and rest timer ticking while you browse

</td>
<td width="50%" valign="top">

### Progress

- **Total Volume & Streaks**: Auto-computed volume curves, active streak, and weekly goal
- **Personal Records (PRs)**: Auto-detected records and estimated 1RM calculated from your own lifts
- **Activity Heatmap**: 60-day visual activity calendar
- **Muscle Split**: Proportional set distribution across Chest, Back, Legs, Shoulders, Arms, and Core
- **Body Measurements**: Track bodyweight and body measurements (waist, arms, chest, thighs, neck, body fat %)
- **Trophy Cabinet**: 20 authentic unlockable achievement medals with celebration animations

</td>
</tr>
<tr>
<td width="50%" valign="top">

### Exercises and Tools

- **540+ Exercises**: Full exercise catalog with animated vector illustrations and step-by-step instructions
- **Filters**: Instant search, muscle targeting, equipment kits, and difficulty levels
- **Six Built-in Calculators**:
  1. **1RM Calculator** (Epley, Brzycki, Lombardi formulas)
  2. **Plates Math** (Barbell plate breakdown per side)
  3. **BMI Calculator** (Body Mass Index with healthy range)
  4. **Calories & TDEE** (Daily energy expenditure & macro splits)
  5. **Body Fat %** (U.S. Navy circumference method)
  6. **Warm-up Sets** (Progressive ramp-up percentage calculator)
- **Places & Kits**: Switch between Commercial Gym, Home Gym, or Calisthenics / Bodyweight Park

</td>
<td width="50%" valign="top">

### Privacy & Data Ownership

- **100% Offline-First**: No account, no ads, no trackers, and no external server requirements
- **Device Storage**: Everything stays encrypted and local to your device's browser/PWA storage
- **Full JSON Backup & Restore**: Export and import your complete history anytime
- **CSV Export**: Export your workout sessions and sets to clean spreadsheets
- **Training Journal**: Record workout notes, recovery reflections, and injury cues
- **One-Tap Wipe**: Delete all local data instantly whenever you want

</td>
</tr>
</table>

---

## Installing as a PWA

GymMane is built as a compliant **Progressive Web App (PWA)** that runs directly in any browser and installs as a standalone app with its own icon, full-screen viewport, and offline access.

### On Android (Chrome / Edge / Brave / Firefox)
1. Open the website in your browser.
2. Tap the **Install App** button in the top bar (or tap the browser menu `⋮` and select **Install app** / **Add to Home screen**).
3. GymMane will install onto your home screen and app drawer as an independent application.

### On iPhone & iPad (iOS Safari)
1. Open the website in **Safari**.
2. Tap the **Share** button (`⎋` with an arrow pointing up).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** in the top right. GymMane will appear on your iOS home screen as an app with no browser chrome.

---

## Hosting on GitHub Pages

The build is configured with relative base paths (`base: './'`), making it directly hostable on any GitHub Pages repository (e.g. `https://<username>.github.io/<repo>/`).

### Method 1: Using GitHub Actions (Recommended)
1. In your GitHub repository, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy GymMane PWA to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. Go to your repository **Settings** → **Pages** → under **Build and deployment**, select **GitHub Actions**.
3. Push to `main`. Your PWA will be live!

### Method 2: Manual Build & Push
```bash
# 1. Install dependencies
npm install

# 2. Build production assets (outputs to dist/)
npm run build

# 3. Deploy the dist/ folder to your gh-pages branch
npx gh-pages -d dist
```

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/<your-username>/GymMane.git
cd GymMane

# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript linter
npm run lint

# Production build
npm run build
```

---

## Credits & Attribution

GymMane PWA is based on the open source [GymMane](https://github.com/InlitX/GymMane) project.

- **GymMane Core & Logic**: Developed by **InlitX** ([github.com/InlitX/GymMane](https://github.com/InlitX/GymMane)), licensed under [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html).
- **Exercise Art & Anatomy**: The exercise illustrations and vector data originate from [Workout Guide](https://github.com/bryllim/workout-guide) by **Bryl Lim**, based on [Everkinetic](https://github.com/everkinetic/data), licensed under [Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).
- **Typography**: The Nunito font family is designed by Vernon Adams and licensed under the [SIL Open Font License (OFL)](https://scripts.sil.org/OFL).
- **Icons**: [Lucide Icons](https://lucide.dev/) (ISC License).
- **Achievements & Badges**: Authentic GymMane medal badges created by InlitX.
