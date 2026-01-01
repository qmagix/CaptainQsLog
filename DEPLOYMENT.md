# Deployment Guide

## 1. Build the Application
To create a production-ready build of Captain's Log, run the following command in your terminal:

```bash
npm run build
```

This will generate a `dist` folder containing:
- `index.html` (Entry point)
- `assets/` (Compiled JavaScript and CSS)

## 2. Preview Locally
You can verify the production build locally before deploying:

```bash
npm run preview
```

## 3. Deploy to Hosting Providers

### Option A: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root.
3. Follow the prompts (defaults are usually correct).

### Option B: Netlify
1. Drag and drop the `dist` folder into the [Netlify Drop](https://app.netlify.com/drop) interface.
2. OR use the CLI: `netlify deploy --prod --dir=dist`

### Option C: GitHub Pages
1. Update `vite.config.js` to set `base` to your repository name:
   ```js
   export default defineConfig({
     base: '/captains-log/', // Replace with your repo name
     plugins: [react()],
   })
   ```
2. Build and push the `dist` folder to a `gh-pages` branch.

## 4. Static Server
You can serve the `dist` folder with any static file server:
```bash
npx serve dist
```
