# BioSimulations — Retrospective Executive Summary (Sept 2022 – 2026)

## Overview
BioSimulations is an open platform for **sharing, reusing, running, and verifying biomodeling studies** (models, simulation experiments, and result visualizations). Over the last ~4 years it evolved from a single Angular/NestJS web platform into a **federation of focused services and tools**. The arc: stabilize and modernize the original platform (2023), rebuild its data infrastructure (2024), then pivot (2025–2026) to a new generation centered on **simulation verification**, a **reproducible execution engine**, a **new SED standard**, and the **Process Bi-Graph (PBG)** framework for composing multiscale models.

Across the `biosimulations` GitHub org, **~20 repositories** saw activity since Sept 2022, totaling **~661 PRs** (≈300 substantive once bot/release noise is removed). *(Excludes vivarium-core internals and DARPA-specific work, per scope.)*

## The eras

### 1. The original platform & monorepo modernization (2022–2023)
The `biosimulations` **Nx monorepo** (Angular + NestJS + Python `combine-api`) is the historical core. After a 2022 lull, **jcschaff** led a 2023 rebuild — repairing CI/build, merging "runBiosimulations" into the main webapp, and making project browsing scale to large model counts — while **AlexPatrie** ran a year-long UI-unification program standardizing the `platform`, `dispatch`, and `simulators` apps. Earlier architecture was laid by **bilalshaikh42** and **jonrkarr**.

### 2. Data-infrastructure overhaul (2024)
The unreliable **HSDS** HDF5 service was replaced by a purpose-built **`simdata-api`** (FastAPI + h5py + Zarr v3 over S3) — the change that made batch simulation reliable (#4791). The platform also upgraded its frameworks (Nx/Angular/NestJS), shipped "Biosimulations 1.0," and **removed combine-api's `/run` endpoints** — the first step in decoupling execution from the monorepo. Key people: **jcschaff**, **AlexPatrie**.

### 3. The pivot to verification — BSVS / `platform` & `compose-api` (2025–2026)
A new stack emerged to **verify** that different simulators agree and to run workflows reproducibly:
- **`platform`** — the **Biological Simulation Verification Service (BSVS)**, the "verification-api." Orchestrates runs as **Temporal workflows**, matches algorithms via the **KiSAO** ontology, and (in 2026) became a full frontend/backend monorepo with a runs/verification webapp. Lead: **jcschaff**, with **AlexPatrie** and **HarrisonCreates**.
- **`compose-api`** — the **container-on-SLURM execution engine** for reproducible workflows and cosimulations (COPASI, ReaDDy, batch processing, production HPC). Lead: **Ezequiel-Valencia**, with **jcschaff**.
- **`biosim-client`** and **`biosimulations-runutils`** — the Python SDK and the comparison **scoring** function (by **Lucian Smith**) that underpins verification.

### 4. The new SED standard — with Lucian Smith (2025–2026)
The **`sed`** repo is the Python home of the **next-generation SED (Simulation Experiment Description) standard** — the "standalone biosim scripts" effort. **Lucian Smith** drives its data model and Python exporters, and prototyped a **SED ↔ Process Bigraph** bridge tying the standard to executable form.

### 5. The Process Bi-Graph (PBG) ecosystem (2025–2026)
A compositional, multiscale modeling framework:
- **`pbest`** — the execution toolkit (compiler, composites, comparison, local + remote runs), lead **Ezequiel-Valencia**.
- **`process-bigraph-lang`** — the DSL + language server (ANTLR4, Pydantic AST, native CLI → Process Bigraph JSON), lead **jcschaff**.
- **`pbsim_common`** (standard library), **`pbsim_actin`** (multiscale-actin/ReaDDy wrapper), and **`registry`** (index of PBG-wrapped repos).

## By the numbers
- **~20 active repos**; **~661 PRs** since Sept 2022 (≈300 substantive).
- **PRs by half-year:** 2022-H2 **13** · 2023-H1 **118** · 2023-H2 **64** · 2024-H1 **46** · 2024-H2 **70** · 2025-H1 **58** · 2025-H2 **99** · 2026-H1 **193** — i.e., a 2023 peak (rebuild), a dip, then a steep 2026 ramp (the new stack).
- **Caveat:** several repos (`deployment`, the model importers, the PBG libraries) do their real work via **direct commits or scheduled Actions**, so PR counts understate them.

## Repo catalog (compact)
| Repo | Group | Description | PRs |
|---|---|---|---|
| biosimulations | Core platform | Angular/NestJS monorepo (biosimulations.org) | 240 |
| compose-api | Verification/BSVS | Reproducible workflow/cosimulation execution API | 68 |
| platform | Verification/BSVS | BSVS verification service ("verification-api") | 57 |
| deployment | Infra | Kubernetes/GitOps config | 51 |
| process-bigraph-lang | PBG | DSL + language server for Process Bigraphs | 44 |
| biosim-client | Verification/BSVS | Python client for BioSimulations APIs | 41 |
| sed | Verification/BSVS | New SED standard (Python) + PBG bridge | 33 |
| pbest | PBG | Process Bi-Graph Extensible Simulation Toolkit | 31 |
| biosimulations-bigg | Importers | Publish BiGG models (scheduled) | 17 |
| pbsim_common | PBG | PBG standard library | 16 |
| biosimulations-modeldb | Importers | Publish ModelDB models (scheduled) | 14 |
| biosimulations-runutils | Verification/BSVS | Run/compare OMEX; scoring function | 12 |
| pbsim_actin | PBG | Multiscale-actin PBG wrapper | 11 |
| biomodels-regression | Importers | BioModels regression testing | 8 |
| biomodels-qc | Importers | BioModels quality control | 6 |
| compose-api-client | Verification/BSVS | Generated compose-api clients | 4 |
| auth0 / secrets / static / registry | Infra/PBG | Config & asset repos | 6 total |

## Key people
- **jcschaff (Jim Schaff)** — overall technical lead; monorepo modernization, simdata-api, the verification `platform`, `process-bigraph-lang`, `biosim-client`.
- **Ezequiel-Valencia** — lead of `compose-api` and `pbest` (the execution engine + PBG toolkit).
- **luciansmith (Lucian Smith)** — the new SED standard (`sed`), the verification scoring function (`runutils`), BioModels QC.
- **AlexPatrie** — the 2023–2024 UI program and early `platform`/BSVS backend work.
- **CodeByDrescher** — PBG toolkit & DSL support.
- **jonrkarr (Jonathan Karr)** — model-repository importers (BiGG, ModelDB); original platform architecture.
- **bilalshaikh42 (Bilal Shaikh)** — original monorepo & deployment architecture.
- **prismofeverything (Ryan Spangler)** — Process Bigraph runtime contributions.
- **HarrisonCreates** — verification webapp frontend.
- **BrmnYng** — ModelDB importer.

## Where to read more
- **[01-timeline.md](01-timeline.md)** — the org-wide chronological narrative with notable PRs.
- **[catalog.md](catalog.md)** — full repo catalog with caveats and links.
- **[repos/](repos/)** — one detailed entry per repo/group (background, themed timeline, notable PRs, tech notes).
- **[data/prs/](data/prs/)** — raw PR metadata (provenance) for every repo.
