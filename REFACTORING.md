# LaTeX Style Files Refactoring Guide

This document describes the refactoring applied to `cvstyle.sty` and `biblatex_science_mods.sty` to improve robustness, maintainability, and compatibility with evolving LaTeX packages.

## Table of Contents

1. [Overview](#overview)
2. [Key Improvements](#key-improvements)
3. [API Stability Guidelines](#api-stability-guidelines)
4. [Migration Guide](#migration-guide)
5. [Best Practices Applied](#best-practices-applied)
6. [Troubleshooting](#troubleshooting)

## Overview

The refactoring focused on making the style files more robust against LaTeX package updates while maintaining backward compatibility. No changes were made to the public API—all existing CV documents should continue to work without modification.

## Key Improvements

### 1. Version Compatibility

**Problem:** No minimum version requirements specified, leading to potential compatibility issues.

**Solution:**
- Added explicit version requirements for packages with breaking changes:
  ```latex
  \RequirePackage{xparse}[2018/04/06]  % xparse syntax stabilized
  \RequirePackage{etoolbox}[2011/01/03]  % Provides \csnumgdef
  ```
- Documented TeX Live 2020+ requirement in package comments

### 2. FontAwesome Version Alignment

**Problem:** `cvstyle.sty` used fontawesome7, but `biblatex_science_mods.sty` documented fontawesome5, creating confusion.

**Solution:**
- Updated documentation in both files to consistently reference fontawesome7
- Added note that fontawesome5 is compatible but deprecated
- Ensured consistent icon command usage across both files

### 3. Namespace Protection

**Problem:** Global definitions could conflict with other packages or user code.

**Solution:**
- Prefixed internal macros with `cv@` (e.g., `\cv@ifempty`)
- Documented which commands are internal vs. public
- Used `\providecommand` for `\iconlink` to prevent definition conflicts
- Added comments noting global namespace usage (e.g., `linkcolour` color)

### 4. Error Handling and Robustness

**Problem:** No defensive programming for package load order or missing packages.

**Solution:**
- Wrapped `\makeatletter`/`\makeatother` in `\begingroup`/`\endgroup`
- Added detailed comments about critical load order (fontawesome7 → pdfx → bookmark)
- Created reusable helper macro `\cv@ifempty` to reduce code duplication
- Used `\providecommand` to handle duplicate definitions gracefully

### 5. Documentation Improvements

**Problem:** Insufficient explanation of internal behaviors and constraints.

**Solution:**
- Added comprehensive troubleshooting sections to both `.sty` files
- Documented rationale for magic numbers (e.g., 45% column width clamp)
- Explained implicit package loading (pdfx loads hyperref)
- Created three-tier API documentation (public/semi-public/internal)

### 6. Code Organization

**Problem:** Some duplicated patterns and unclear abstraction levels.

**Solution:**
- Extracted `\cv@ifempty` helper macro for consistent empty-string testing
- Improved code comments to explain "why" not just "what"
- Added section headers for better file navigation
- Documented which macros are stable vs. may evolve

## API Stability Guidelines

The refactoring introduced three stability tiers:

### Public API (Stable)
These commands are guaranteed to remain backward-compatible:
- `\cvcontact` - Contact header
- `\cvjob` - Position entry
- `\cvperson` - Mentee/collaborator entry
- `\cvproject` - Funded project entry
- `\teachentry` - Teaching entry

**Promise:** Parameters, behavior, and output will not change without a major version bump.

### Semi-Public API (May Evolve)
These commands are documented but may gain features or change slightly:
- `\activityrow` - Generic activity listing
- `\iconlink` - Icon with hyperlink

**Promise:** Changes will maintain backward compatibility where possible; deprecation warnings will be added before removal.

### Internal Macros (No Guarantees)
Prefixed with `cv@` or undocumented in the header:
- `\cv@ifempty` - Empty string test helper
- `\cvpersonRightWidth` - Layout calculation length

**Promise:** None. These may change or be removed at any time.

## Migration Guide

### For Existing CV Documents

**No changes required.** All existing documents using cvstyle.sty should continue to work as-is.

### For Custom Style Files Based on cvstyle.sty

If you've created a derived style file:

1. **Check for `\iconlink` conflicts:**
   - Old: `\newcommand{\iconlink}[4]...`
   - New: `\providecommand{\iconlink}[4]...`
   - Action: Change to `\providecommand` to coexist peacefully

2. **Update internal macro prefixes:**
   - Old: Custom helpers without prefixes
   - New: Prefix with `\mystyle@` or similar
   - Action: Prevent namespace collisions

3. **Add version requirements:**
   ```latex
   \RequirePackage{xparse}[2018/04/06]
   \RequirePackage{biblatex}[2020/01/01]
   ```

4. **Document API stability:**
   - Clearly mark which commands are public vs. internal
   - Add troubleshooting sections for common issues

## Best Practices Applied

### 1. Package Load Order Documentation

**Pattern:**
```latex
% -------------------------
% ICONS, PDF/A, AND HYPERLINKS
% (Load order critical: fontawesome7 → pdfx → bookmark)
% -------------------------
% WARNING: Package load order matters here!
%   1. fontawesome7 must load before pdfx...
%   2. pdfx loads hyperref internally...
```

**Why:** Makes implicit dependencies explicit, preventing mysterious errors.

### 2. Reusable Helpers for Common Patterns

**Pattern:**
```latex
% Internal helper
\newcommand{\cv@ifempty}[2]{%
  \if\relax\detokenize{#1}\relax
  \else
    #2%
  \fi
}

% Usage in multiple commands
\cv@ifempty{#3}{, \textit{#3}}
```

**Why:** DRY principle, easier to maintain and debug.

### 3. Rationale Comments for Magic Numbers

**Pattern:**
```latex
% Clamp to max 45% of line width to prevent negative left column width
% Rationale: If year/status text is very long (>45% line width), the left
% column would become negative or too narrow. This ensures minimum usable space.
```

**Why:** Future maintainers understand *why* the constraint exists.

### 4. Defensive Programming

**Pattern:**
```latex
\begingroup
\makeatletter
  % ... code using @ in command names ...
\makeatother
\endgroup  % Always restore, even if error occurs
```

**Why:** Prevents category code changes from leaking into user code.

### 5. Troubleshooting Sections

**Pattern:**
```latex
%% TROUBLESHOOTING & KNOWN ISSUES
%%
%% FONTAWESOME ICONS NOT DISPLAYING:
%%   • Ensure fontawesome7 is installed...
%%   • Run: tlmgr install fontawesome7
```

**Why:** Users can self-diagnose common problems without filing issues.

## Troubleshooting

### Build Errors After Updating

**Symptom:** LaTeX compilation fails with "Undefined control sequence" errors.

**Diagnosis:**
```bash
# Check installed package versions
tlmgr info xparse
tlmgr info biblatex
tlmgr info fontawesome7
```

**Solution:**
```bash
# Update TeX Live packages
tlmgr update --self --all

# If specific packages are too old
tlmgr install xparse biblatex fontawesome7
```

### Icons Not Displaying in PDF

**Symptom:** PDF builds but icons appear as boxes or missing glyphs.

**Diagnosis:**
- Check console output for font loading warnings
- Verify fontawesome7 is installed: `tlmgr info fontawesome7`

**Solution:**
```bash
# Install fontawesome7
tlmgr install fontawesome7

# Rebuild with clean intermediate files
rm -f *.aux *.bbl *.bcf *.blg *.run.xml
latexmk -pdflua -lualatex="lualatex --shell-escape %O %S" cv.tex
```

### Bibliography Reverse Numbering Wrong

**Symptom:** Publications numbered in wrong order (not reverse chronological).

**Diagnosis:**
- Check if entries are sorted correctly in .bib file
- Verify biber ran successfully: `biber --validate-datamodel cv.bcf`

**Solution:**
- Ensure entries in .bib file are in forward chronological order
- Or use biblatex sorting options: `sorting=ydnt` (year descending, name, title)

### Namespace Conflicts with Other Packages

**Symptom:** LaTeX errors about "Command \iconlink already defined."

**Diagnosis:**
- Another package defines `\iconlink`
- Check package load order in your document

**Solution:**
```latex
% Load cvstyle.sty FIRST, then other packages
\usepackage{cvstyle}
\usepackage{otherpackage}  % If this defines \iconlink, cvstyle's version wins

% Or rename one definition:
\let\cvIconlink\iconlink
\usepackage{otherpackage}  % Defines its own \iconlink
\let\iconlink\cvIconlink   % Restore cvstyle version
```

## Validation Checklist

After applying this refactoring to a CV project:

- [ ] Document builds without new warnings
- [ ] PDF output is identical to pre-refactoring version
- [ ] All icons display correctly
- [ ] Bibliography numbering is correct
- [ ] Links are clickable and colored correctly
- [ ] PDF/A validation passes (if using pdfx)
- [ ] No LaTeX "Overfull hbox" warnings introduced

## Future Improvements

### Not Included in This Refactoring

These improvements were considered but deferred to maintain minimal changes:

1. **Splitting into multiple files** - Would break existing workflows
2. **Adding LaTeX3 syntax** - Requires newer TeX distributions
3. **Comprehensive unit tests** - LaTeX package testing is complex
4. **Configuration interface** - Would change user-facing API
5. **Conditional feature loading** - Adds complexity without clear benefit

### Recommended for Future Work

If continuing to evolve these style files:

1. **Version detection and warnings:**
   ```latex
   \@ifpackagelater{biblatex}{2020/01/01}{}{%
     \PackageWarningNoLine{cvstyle}{%
       biblatex version too old (< 3.16)\MessageBreak
       Some features may not work correctly
     }%
   }
   ```

2. **Configuration hooks:**
   ```latex
   \newcommand{\cvSetLinkColor}[3]{%
     \definecolor{linkcolour}{rgb}{#1,#2,#3}%
     \hypersetup{urlcolor=linkcolour, linkcolor=linkcolour}%
   }
   ```

3. **Graceful degradation:**
   ```latex
   \IfPackageLoadedTF{fontawesome7}{%
     \newcommand{\cv@icon}[1]{\raisebox{-0.05\height}{#1}}%
   }{%
     \newcommand{\cv@icon}[1]{}% No icons if package unavailable
     \PackageWarningNoLine{cvstyle}{fontawesome7 not loaded; icons disabled}%
   }
   ```

## References

- [LaTeX2e for package writers](https://www.latex-project.org/help/documentation/clsguide.pdf)
- [The xparse package documentation](https://ctan.org/pkg/xparse)
- [BibLaTeX documentation](https://ctan.org/pkg/biblatex)
- [LaTeX best practices for package development](https://texfaq.org/FAQ-writecls)

## Changelog

### v1.2 (2026-01-28) - Refactoring for Robustness

**Improvements:**
- Added package version requirements (xparse, etoolbox)
- Fixed fontawesome version documentation inconsistency
- Improved namespace protection with `cv@` prefix convention
- Added reusable `\cv@ifempty` helper macro
- Wrapped `\makeatletter` blocks in groups for safety
- Used `\providecommand` for `\iconlink` to prevent conflicts
- Added comprehensive troubleshooting sections
- Documented API stability levels (public/semi-public/internal)
- Improved code comments with rationale explanations

**Non-Breaking Changes:**
- All existing CV documents continue to work without modification
- No changes to public command signatures or behavior
- PDF output remains identical

**Technical Debt Addressed:**
- Reduced code duplication through helper macros
- Made implicit dependencies explicit (load order, package requirements)
- Added defensive programming patterns
- Improved maintainability with better code organization

---

*Last updated: 2026-01-28*
