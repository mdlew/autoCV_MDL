# Copilot Instructions for autoCV_MDL

## Project Overview

This is a LaTeX CV template project with automated CI/CD that builds `cv.pdf` and publishes to both GitHub Pages and Cloudflare Workers. The project combines LaTeX document generation with modern web deployment infrastructure.

## Technology Stack

- **LaTeX**: LuaLaTeX for document compilation with `latexmk`
- **TypeScript**: Cloudflare Worker handler
- **CI/CD**: GitHub Actions for building and deployment
- **Package Manager**: pnpm (preferred) or npm
- **Runtime**: Node 18+

## Repository Structure

### Core LaTeX Files
- `cv.tex` - Main CV source document
- `cvstyle.sty` - Custom style package with CV entry commands and layout
- `biblatex_science_mods.sty` - Citation style customizations
- `*.bib` - Bibliography files (journals, conferences, patents, talks, reviews)
- `tl_packages` - TeX Live package list for CI

### Cloudflare Worker
- `src/index.ts` - Worker handler serving static assets
- `wrangler.jsonc` - Worker configuration (routes, assets binding)
- `dist/` - Built site files (PDF, HTML, CNAME)

### CI/CD
- `.github/workflows/build.yml` - Main build and deployment pipeline
- `.github/workflows/dependabot-auto-merge.yml` - Automated dependency updates
- `.github/dependabot.yml` - Dependabot configuration

## Key Conventions

### LaTeX Style Files
1. **Namespace Protection**: Internal commands use `cv@` prefix
2. **API Stability**: Public commands documented at file top; internal commands may change
3. **Package Versions**: Critical packages specify minimum versions
4. **Documentation**: Comprehensive comments for troubleshooting
5. **Defensive Programming**: Robust error handling and fallbacks

See `REFACTORING.md` for detailed style file documentation and best practices.

### TypeScript/Worker Code
- Use TypeScript for type safety
- Follow Cloudflare Workers patterns and conventions
- Security headers and TLS 1.2+ enforcement are required

### Build Process
- LaTeX builds use: `latexmk -pdflua -lualatex="lualatex --shell-escape %O %S" -interaction=nonstopmode`
- Worker builds use: `pnpm build` (runs `tsc`)
- CI outputs to `dist/` directory

## Making Changes

### LaTeX Changes
1. Edit `cv.tex` for content changes
2. Edit `cvstyle.sty` for styling changes (maintain namespace conventions)
3. Edit `*.bib` files for bibliography entries
4. Test locally with `latexmk` before pushing
5. Check CI build logs if build fails

### Worker Changes
1. Edit `src/index.ts` for handler logic
2. Edit `wrangler.jsonc` for configuration
3. Run `pnpm build` to compile TypeScript
4. Test locally with `pnpm dev`
5. Deploy with `pnpm deploy` or via CI

### CI/CD Changes
1. Workflow files should maintain existing job structure
2. Preserve artifact paths: `dist/` for Cloudflare, `github_artifacts/` for Pages
3. Keep package manager as pnpm
4. Maintain workflow permissions for Pages deployment

## Testing

### Local LaTeX Build
```bash
latexmk -pdflua -lualatex="lualatex --shell-escape %O %S" -interaction=nonstopmode -output-directory=. ./cv.tex
```

### Local Worker Development
```bash
pnpm install
pnpm build    # Compile TypeScript
pnpm dev      # Local preview
```

### CI Validation
- Push changes to trigger build workflow
- Check Actions tab for build status
- Review build logs for errors

## Common Tasks

### Adding TeX Packages
1. Add package name to `tl_packages`
2. Test in CI or ensure package is in TeX Live

### Updating Dependencies
- Worker deps: Managed by dependabot, auto-merged via workflow
- LaTeX packages: Update via `tl_packages`

### Custom Domain Setup
- GitHub Pages: Add `CNAME` file at repo root
- Cloudflare Worker: Update `routes` in `wrangler.jsonc`

## Troubleshooting

### CI Build Failures
- Check Actions logs for specific error
- Verify `tl_packages` has required dependencies
- Ensure LaTeX syntax is valid

### Worker Deployment Issues
- Verify `dist/` exists and contains required files
- Check `wrangler.jsonc` configuration
- Ensure secrets are set in repository settings

### Pages Not Publishing
- Confirm deploy job succeeded in Actions
- Verify workflow permissions: Settings → Actions → General → Read and write
- Check Pages settings for deployment status

## Important Notes

- **Workflow Permissions**: Must be set to "Read and write" for Pages deployment
- **Asset Directory**: Worker serves from `dist/` via ASSETS binding
- **Shell Escape**: Required for LaTeX compilation (`--shell-escape`)
- **No Build Branch**: Uses Pages artifact upload, not `gh-pages` branch

## Related Documentation

- Main README: Project features and quick start
- REFACTORING.md: Detailed style file documentation and best practices
- LICENSE: MIT License
