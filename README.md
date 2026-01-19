# autoCV_MDL

[![build and deploy](https://github.com/mdlew/autoCV_MDL/actions/workflows/build.yml/badge.svg)](https://github.com/mdlew/autoCV_MDL/actions/workflows/build.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

LaTeX CV template with CI that builds `cv.pdf` and publishes site files (PDF, `index.html`, optional `CNAME`). GitHub Pages-ready by default, with an optional Cloudflare Worker to serve the built site at a custom domain.

Adapted with gratitude from Jitin Nair's [autoCV repository](https://github.com/jitinnair1/autoCV).

Live demo: [cv.matthewlew.info](https://cv.matthewlew.info)

## Table of contents

- Features
- Requirements
- Quick start (GitHub Pages)
- Local build
- Cloudflare Worker deploy (optional)
- Repository layout
- Package scripts
- Custom domain
- Troubleshooting
- License and credits

## Features

- One-source CV: edit `cv.tex`, styles in `cvstyle.sty`, bibliographies in `*.bib`.
- CI build with `latexmk`/`lualatex`; artifacts include `cv.pdf`, `index.html`, `CNAME` (if present).
- Ready for GitHub Pages; no `build` branch or manual uploads required.
- Optional Cloudflare Worker that serves the built site from `dist` with security headers and TLS 1.2+ enforcement.

## Requirements

- LaTeX distribution with `lualatex` and `latexmk` (TeX Live or MiKTeX). Install packages listed in `tl_packages`.
- Node 18+ and `pnpm` (or `npm`) for the Cloudflare Worker tooling (`wrangler`, TypeScript).

## Quick start (GitHub Pages)

1) Edit `cv.tex` (plus any `.sty` / `.bib` as needed).  
2) Commit and push.  
3) GitHub Actions builds and uploads the site artifact.  
4) Visit `https://<username>.github.io/<repo>/` after Pages deploys (or your custom domain).

Workflow permissions: In **Settings → Actions → General**, set **Workflow permissions** to **Read and write** so the deploy job can publish Pages.

## Local build

From the repo root:

```bash
latexmk -pdflua -lualatex="lualatex --shell-escape %O %S" -interaction=nonstopmode -output-directory=. ./cv.tex
```

Outputs `cv.pdf` in the root.

## Cloudflare Worker deploy (optional)

The Worker serves static assets from `dist` via the `ASSETS` binding (see `wrangler.jsonc`).

```bash
pnpm install
pnpm dev      # local preview with wrangler
pnpm build    # TypeScript -> dist
pnpm deploy   # publish to Cloudflare Workers
```

- Routes and asset dir are configured in `wrangler.jsonc` (example: `cv.matthewlew.info`).
- Ensure `dist` contains your built site files (e.g., `cv.pdf`, `index.html`, `CNAME`).

## Repository layout

- `cv.tex` — main CV source
- `cvstyle.sty`, `biblatex_science_mods.sty` — style and bibliography config
- `*.bib` — bibliographies (e.g., `pubs_journal.bib`, `patents.bib`)
- `tl_packages` — TeX Live packages for CI
- `.github/workflows/build.yml` — CI pipeline for PDF build + Pages artifact
- `wrangler.jsonc`, `src/index.ts` — Cloudflare Worker config and handler

## Package scripts

- `pnpm build` — compile TypeScript for the Worker (`tsc`).
- `pnpm dev` — local Worker dev server (`wrangler dev`).
- `pnpm deploy` — deploy Worker (`wrangler deploy`).
- `pnpm generate-types` — fetch Cloudflare Worker types.

## Custom domain

- GitHub Pages: add `CNAME` at the repo root with your domain; CI copies it into the artifact.
- Cloudflare Worker: update the `routes` section in `wrangler.jsonc` to match your domain.

## Troubleshooting

- CI build fails: check the failing step in the Actions logs; confirm `tl_packages` dependencies are available.
- Site not published (Pages): confirm the deploy job succeeded and Pages shows a recent deployment; verify workflow permissions are set to Read/Write.
- Local LaTeX build fails: ensure `lualatex` and `latexmk` are on `PATH` and rerun the `latexmk` command above.
- Worker issues: verify `dist` exists and `pnpm build` succeeded; confirm `wrangler.jsonc` matches your domain and asset directory.

## License and credits

- License: MIT (see `LICENSE`).
- Credits: Adapted from Jitin Nair's [autoCV](https://github.com/jitinnair1/autoCV).
