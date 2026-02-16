# Deployment Guide - Tribal Wars TMA

This guide explains how to deploy the Tribal Wars Telegram Mini App to GitHub Pages.

## Prerequisites

- GitHub repository with proper permissions
- Node.js 20+ installed locally
- Repository settings configured for GitHub Pages

## Deployment Configuration

### 1. Vite Configuration

The project is configured for GitHub Pages with the correct base path in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/tribal-wars-tma/',  // Must match repository name
  build: {
    outDir: 'dist',
  },
})
```

### 2. GitHub Actions Workflow

Automated deployment is configured in `.github/workflows/deploy.yml`:

- **Trigger**: Pushes to `main` branch or manual dispatch
- **Build**: Uses Node.js 20 with `--legacy-peer-deps` for React 19 compatibility
- **Deploy**: Uploads artifacts and deploys to GitHub Pages

### 3. Jekyll Configuration

A `.nojekyll` file in the `public/` directory prevents GitHub Pages from processing the site with Jekyll, ensuring proper asset loading.

## Deployment Steps

### Automatic Deployment (Recommended)

1. **Merge to main branch**:
   ```bash
   git checkout main
   git merge copilot/build-telegram-mini-app
   git push origin main
   ```

2. **Enable GitHub Pages** (one-time setup):
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"
   - Save the settings

3. **Monitor deployment**:
   - Go to the "Actions" tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow
   - Once complete, the site will be live at: `https://dopaton.github.io/tribal-wars-tma/`

### Manual Deployment

If you need to trigger deployment manually:

1. Go to the "Actions" tab
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the `main` branch
5. Click "Run workflow" button

## Local Testing

Before deploying, test the production build locally:

```bash
# Install dependencies
npm install --legacy-peer-deps

# Build for production
npm run build

# Preview the production build
npm run preview
```

The preview server will start at: `http://localhost:4173/tribal-wars-tma/`

## Verification After Deployment

1. **Check GitHub Pages URL**: Visit `https://dopaton.github.io/tribal-wars-tma/`
2. **Verify Telegram Integration**: 
   - Open the Telegram Web App in Telegram
   - Check that theme colors are applied correctly
   - Test all navigation and game features
3. **Check Console**: Open browser DevTools and ensure no 404 errors for assets
4. **Test Functionality**:
   - Navigate between all pages (Village, Map, Barracks, Build, Rally)
   - Upgrade a building and verify timer works
   - Train units and check queue functionality
   - Test map dragging and village selection

## Troubleshooting

### Assets Not Loading (404 Errors)

If you see 404 errors for CSS/JS files:
- Verify `base` path in `vite.config.ts` matches repository name exactly
- Ensure `.nojekyll` file exists in `public/` directory
- Clear browser cache and reload

### Workflow Fails

If the GitHub Actions workflow fails:
- Check the workflow logs in the Actions tab
- Ensure GitHub Pages is enabled with "GitHub Actions" as source
- Verify repository has proper permissions for Pages deployment

### Blank Page After Deployment

If you see a blank page:
- Check browser console for errors
- Verify routing is configured correctly with `basename="/tribal-wars-tma"`
- Ensure all assets use the correct base path

## Repository Settings Required

For GitHub Pages to work, these settings must be configured:

1. **Pages Source**: GitHub Actions
2. **Branch**: Deployment from `gh-pages` or actions artifacts
3. **Permissions**: Workflow has `pages: write` and `id-token: write`

## Environment URLs

- **Production**: `https://dopaton.github.io/tribal-wars-tma/`
- **Local Development**: `http://localhost:5173/tribal-wars-tma/`
- **Local Preview**: `http://localhost:4173/tribal-wars-tma/`

## Updating the Deployment

To update the deployed site:

1. Make changes on a feature branch
2. Test locally with `npm run dev`
3. Build and preview with `npm run build && npm run preview`
4. Create a pull request to `main` branch
5. Once merged, GitHub Actions will automatically deploy

## Rollback

If you need to rollback to a previous version:

1. Go to the Actions tab
2. Find the successful workflow run you want to rollback to
3. Click "Re-run all jobs"
4. Alternatively, revert the commit and push to `main`

## Additional Resources

- [Vite Static Deploy Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)
