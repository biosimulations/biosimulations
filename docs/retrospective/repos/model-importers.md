# Model-repository importers (bigg · modeldb · biomodels-regression · biomodels-qc)

> Command-line programs + scheduled GitHub Actions that publish external model repositories into BioSimulations, plus QC/regression tooling for BioModels.

**Group:** Model importers · **PRs since 2022-09:** bigg 17, modeldb 14, biomodels-regression 8, biomodels-qc 6 (**publishing work runs via scheduled Actions / direct commits — most PRs are dependency automation**) · **Active span:** 2023 – 2026-06 · **Key contributors:** jonrkarr (Jonathan Karr), BrmnYng, luciansmith (Lucian Smith)

## Project background
This group keeps BioSimulations populated with curated, runnable models from major external repositories, and maintains quality of the BioModels corpus:
- **`biosimulations-bigg`** — CLI + scheduled GitHub Action that publishes the **BiGG** genome-scale metabolic model repository to BioSimulations.
- **`biosimulations-modeldb`** — CLI + scheduled GitHub Action that publishes the **ModelDB** computational-neuroscience model repository to BioSimulations.
- **`biomodels-qc`** — Quality-control tool for the **BioModels** repository of biochemical models (validation, metadata correctness).
- **`biomodels-regression`** — Regression testing for the BioModels repository.

Because publishing is **automated** (scheduled Actions run the CLI and commit results) and human edits often land as direct commits, the PR streams are dominated by Renovate/Dependabot. The substantive human PRs cluster in `biomodels-qc`.

## Timeline (themed milestones)

### Continuous automated publishing (2023 → 2026)
- `biosimulations-bigg` and `biosimulations-modeldb` run as scheduled importers (authored by **jonrkarr**: 67 and 58 commits respectively; **BrmnYng** contributed 22 to modeldb). Their PR history since Sept 2022 is entirely Renovate (GitHub Actions and codecov bumps) — the model-publishing itself is direct-commit / Action-driven.
- `biomodels-regression` likewise shows only Dependabot bumps (starlette, tornado, cryptography), indicating an automated regression service kept current but not feature-churned.

### biomodels-qc — the human-edited member
- **2023** — Lucian Smith improved OMEX/metadata handling: pass the OMEX name to libOMEXmeta (#6), restore an SVGLint test (#7), and flag `metadata.rdf` as the **"omex metadata"** type rather than generic RDF (#8).
- **2025** — Switched setup/install from **pip to Poetry** (#9); recognized that `comp` and `groups` SBML models are still core and translatable to other formats (#10); housekeeping (#11).

## Notable PRs
| PR | Date | Author | Why it matters |
|---|---|---|---|
| [biomodels-qc #8](https://github.com/biosimulations/biomodels-qc/pull/8) | 2023-05-25 | luciansmith | Correct OMEX-metadata typing for `metadata.rdf` |
| [biomodels-qc #10](https://github.com/biosimulations/biomodels-qc/pull/10) | 2025-05-21 | luciansmith | Treat `comp`/`groups` SBML as translatable core models |
| [biomodels-qc #9](https://github.com/biosimulations/biomodels-qc/pull/9) | 2025-05-16 | luciansmith | Migrate tooling pip → Poetry |

## Key contributors
- **jonrkarr (Jonathan Karr)** — authored and maintains the BiGG and ModelDB importers.
- **BrmnYng** — ModelDB importer contributions.
- **luciansmith (Lucian Smith)** — BioModels QC/metadata correctness.

## Tech & stack notes
- **Python** CLIs run on **scheduled GitHub Actions**; outputs published as OMEX/COMBINE archives to BioSimulations.
- `biomodels-qc` uses **libOMEXmeta** for RDF/metadata validation; migrated to **Poetry**.
- Formats: SBML (incl. `comp`/`groups` packages), BiGG/ModelDB exports; Renovate + Dependabot for upkeep.
- *Caveat:* PR counts understate activity — model publishing is Action-driven, not PR-driven.
