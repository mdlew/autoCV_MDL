# autoCV_MDL

[![build and deploy](https://github.com/mdlew/autoCV_MDL/actions/workflows/build.yml/badge.svg)](https://github.com/mdlew/autoCV_MDL/actions/workflows/build.yml)

A LaTeX-based CV template that automatically builds a PDF via GitHub Actions and can publish site files (PDF, `index.html`, `CNAME`) to GitHub Pages.

Adapted with gratitude from Jitin Nair's [autoCV repository](https://github.com/jitinnair1/autoCV).

## Contents

- `cv.tex` — main CV source
- `cvstyle.sty`, `biblatex_science_mods.sty` — style and bibliographic configuration
- `*.bib` — bibliographies (e.g., `pubs_journal.bib`, `patents.bib`)
- `tl_packages` — list of TeX Live packages required by CI
- `.github/workflows/build.yml` — CI workflow that builds the PDF and deploys site files

## Quickstart (edit → push → published)

- Edit your CV in `cv.tex` (and any supporting `.sty`/`.bib` files).
- Commit and push changes to GitHub.
- The GitHub Actions workflow will build `cv.pdf` and upload site files as a Pages artifact.
- After the workflow completes and Pages deploys, visit `https://<username>.github.io/<repo>/` (or your custom domain).

## Prerequisites (for local builds)

- A LaTeX distribution with `lualatex` and `latexmk`:
  - TeX Live (Unix/macOS) or MiKTeX (Windows). Ensure required packages from `tl_packages` are installed.

## Build locally

From the repository root via direct `latexmk`:

```bash
latexmk -pdflua -lualatex="lualatex --shell-escape %O %S" -interaction=nonstopmode -output-directory=. ./cv.tex
```

## What the CI workflow does

See `.github/workflows/build.yml` — summary:

- Checks out the repository.
- Installs TeX Live packages listed in `tl_packages`.
- Builds `cv.tex` with `latexmk` using `lualatex`.
- Collects the generated `cv.pdf` and site files (`index.html`, `CNAME` if present) into an artifact directory.
- Uploads those files for GitHub Pages deployment.

## Enabling publishing to GitHub Pages

1. Ensure the Actions workflow has proper permissions:
   - Go to **Settings → Actions → General** in your repository.
   - Under **Workflow permissions**, enable **Read and write permissions** if not already set (this allows the deployment job to publish Pages).
2. After a successful workflow run, Pages will receive the artifact and publish the site. Check **Settings → Pages** to confirm the published site and URL.

Note: This workflow uploads artifacts for Pages and does not require you to manually create a `build` branch.

## Custom domain

- Add a `CNAME` file at the repository root that contains your custom domain (for example `cv.example.com`).  
- The CI copies `CNAME` into the published artifact so Pages will use the custom domain on deployment.

## Editing tips

- Main content: `cv.tex`
- Layout / macros: `cvstyle.sty`, `biblatex_science_mods.sty`
- Bibliography sources: the `.bib` files in the repository (e.g., `pubs_journal.bib`, `patents.bib`)
- Icons: Font Awesome usage and setup are configured in the style files (`cvstyle.sty`, `biblatex_science_mods.sty`)

## Troubleshooting

- CI build fails:
  - Inspect the Actions run logs in the **Actions** tab for the failing step.
  - Confirm all packages listed in `tl_packages` are available or included by the CI.
- Site not published:
  - Confirm the `deploy` job completed successfully and that Pages shows a recent deployment under **Settings → Pages**.
  - Verify workflow permissions (see "Enabling publishing to GitHub Pages").
- Local build fails:
  - Verify `lualatex` and `latexmk` are installed and present on your `PATH`.
  - Reproduce locally with:

    ```bash
    latexmk -pdflua -lualatex="lualatex --shell-escape %O %S" -interaction=nonstopmode -output-directory=. ./cv.tex
    ```

## License

See `LICENSE` in the repository root.

## Credits

Adapted with gratitude from Jitin Nair's [autoCV](https://github.com/jitinnair1/autoCV).
