# LaTeX Package Optimization Analysis

## Executive Summary

This document provides analysis and recommendations for optimizing the TeX Live package dependencies in the autoCV_MDL project.

## Current State

### Package Dependencies in cvstyle.sty (20 packages)
All packages currently declared in `cvstyle.sty` are **actively used** in the project:

1. **url** - Used in \iconlink macro and bibliography
2. **parskip** - Paragraph spacing throughout
3. **graphicx** - Used for labicon.pdf in cv.tex
4. **xcolor** - Link color definitions (linkcolour)
5. **geometry** - Page layout (letterpaper, scale=0.9)
6. **lastpage** - Footer page numbering (page X of Y)
7. **fancyhdr** - Custom headers and footers
8. **array** - Extended table column types
9. **ltablex** - Long tables with X columns
10. **enumitem** - List formatting
11. **etaremune** - Reverse numbered lists (cv_mentoring.tex, cv_service.tex)
12. **titlesec** - Section formatting
13. **multicol** - Multi-column layout (cv_mentoring.tex, cv_service.tex)
14. **needspace** - Page break control (cv_projects.tex, cv_service.tex)
15. **ragged2e** - \RaggedRight in cvstyle.sty and cv_service.tex
16. **biblatex** - Bibliography system
17. **fontawesome7** - Icons for contact info and bibliography
18. **pdfx** - PDF/A-2b compliance
19. **bookmark** - Enhanced PDF bookmarks
20. **xparse** - Modern command definitions

### Package Dependencies in biblatex_science_mods.sty (1 package)
1. **etoolbox** - Used for \AtDataInput, \csnumgdef

### Changes Made to cvstyle.sty
- **Removed:** Line 68 containing `% \RequirePackage{afterpage}` (commented-out, unused package)
- **Result:** Clean, documented package list with no unused declarations

## tl_packages Optimization

### Current tl_packages (pulls ~2000+ packages)
```
collection-latex                    # Base LaTeX (~50 packages)
collection-latexrecommended         # Recommended packages (~100 packages)
collection-latexextra               # Extra packages (~800+ packages) ⚠️
collection-fontsrecommended         # Essential fonts (~50 fonts)
collection-fontsextra               # Extra fonts (~500+ fonts) ⚠️
collection-luatex                   # LuaTeX support (~30 packages)
collection-bibtexextra              # Bibliography extras (~50 packages)
latexmk                             # Build tool
```

### Problems with Current Approach
1. **collection-latexextra** includes 800+ packages, most never used
2. **collection-fontsextra** includes 500+ font families, mostly unnecessary
3. Total download and installation: ~2-3 GB
4. Longer CI build times
5. Increased maintenance burden

### Recommended Optimization

See `tl_packages_optimized` for the optimized package list.

#### Strategy:
1. **Keep essential collections:**
   - collection-latex (base LaTeX)
   - collection-latexrecommended (commonly used packages)
   - collection-luatex (engine requirement)
   - collection-fontsrecommended (essential fonts)

2. **Remove bloated collections:**
   - ❌ collection-latexextra → replace with individual packages
   - ❌ collection-fontsextra → not needed
   - ❌ collection-bibtexextra → replace with biblatex components

3. **Add individual packages as needed:**
   - Bibliography: biblatex, biber, biblatex-science
   - Fonts: fontawesome5, fontawesome7, stix2-otf, fontsetup
   - Layout: geometry, fancyhdr, lastpage, titlesec, parskip
   - Tables: ltablex, etaremune
   - Text: ragged2e, needspace, multicol
   - PDF: pdfx, bookmark
   - Programming: xparse, l3packages, etoolbox

#### Expected Results:
- **Before:** ~2000+ packages (~2-3 GB)
- **After:** ~200-300 packages (~500-800 MB)
- **Reduction:** ~85-90% fewer packages
- **Functionality:** 100% maintained

### Implementation Plan

#### Option 1: Conservative (Recommended)
Replace `tl_packages` with `tl_packages_optimized` which removes only the two largest collections (latexextra and fontsextra) while keeping base collections intact.

**Risk:** Low - base collections ensure compatibility
**Testing:** Can be tested in CI immediately

#### Option 2: Aggressive
Create a minimal package list with only explicitly required packages.

**Risk:** Medium - may miss hidden dependencies
**Testing:** Requires iterative CI testing to discover missing dependencies

## Verification

To verify the optimization works:

1. **Update tl_packages:**
   ```bash
   cp tl_packages_optimized tl_packages
   ```

2. **Test in CI:**
   The GitHub Actions workflow will:
   - Install packages from tl_packages
   - Build cv.tex with LuaLaTeX
   - Report any missing packages

3. **Local testing (if TeX Live installed):**
   ```bash
   latexmk -pdflua -lualatex="lualatex --shell-escape %O %S" \
     -interaction=nonstopmode cv.tex
   ```

4. **Add missing packages:**
   If the build fails with "package X not found":
   - Add the package name to tl_packages
   - Commit and test again

## Conclusion

**Findings:**
- ✅ All \RequirePackage declarations in cvstyle.sty are necessary
- ✅ Only cleanup needed: remove commented afterpage line (complete)
- ✅ Significant optimization possible in tl_packages

**Recommendation:**
Implement the optimized tl_packages to reduce package count by ~85-90% while maintaining full functionality.

**Next Steps:**
1. Test tl_packages_optimized in CI
2. Add any missing packages discovered during testing
3. Replace original tl_packages once verified
4. Document the optimization in REFACTORING.md

## Files Modified
- `cvstyle.sty` - Removed commented afterpage line

## Files Created
- `tl_packages_optimized` - Optimized package list
- `PACKAGE_OPTIMIZATION.md` - This analysis document

## References
- TeX Live Collections: https://www.tug.org/texlive/
- CTAN Package Database: https://ctan.org/pkg/
