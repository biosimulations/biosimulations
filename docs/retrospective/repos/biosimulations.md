# biosimulations (monorepo)

> A platform for sharing and reusing biomodeling studies — models, simulations, and visualizations of their results.

**Group:** Core platform · **PRs since 2022-09:** 240 (~133 substantive; rest are semantic-release + dependency bots) · **Active span:** 2022-09 – 2026-06 (peak 2023; maintenance from 2025) · **Key contributors:** jcschaff (lead), AlexPatrie (UI), bilalshaikh42, jmdetloff, luciansmith

## Project background
`biosimulations` is the original biosimulations.org — an **Nx monorepo** (Angular frontend + NestJS backends + Python `combine-api`) hosting the public platform for sharing and reusing biomodeling studies. It comprises several apps (`platform`, `dispatch`, `simulators`, `api`, `combine-api`, `simdata-api`, `dispatch-service`, etc.) and shared libs. Since Sept 2022 it went through a tail of the original team's feature work, a major 2023 rebuild and UI unification, a 2024 infrastructure overhaul (the simdata-api), and — from 2025 — a transition to maintenance as the new verification/PBG stack (`platform`, `compose-api`) took over active development.

## Timeline (themed milestones)

### 2022-H2 — Tail of the original dispatch work
- jmdetloff wrapped up dispatch-form features: consolidating forms modules (#4581), the **modify-archive flow** (#4582), and adopting the combine-api datamodel in the dispatch component (#4588). This is the end of the prior team's active feature stream.

### 2023-H1 — The rebuild (peak activity)
- **CI/build repair & dependency migration** — jcschaff led a large effort to repair lint/build/test/CI and migrate apps (#4624, #4634, #4640, #4657, #4660), making the monorepo buildable again.
- **runBiosimulations merged into the main webapp** (#4665) — A strategic consolidation: the separate "runBiosimulations" experience was integrated into the main platform webapp.
- **Scalable project browsing** — A recurring 2023 theme: simplify project browsing for large model counts (#4620), scalable browsing (#4673), server-side project-table filtering (#4675), improved sort (#4714), and the stop-gap **`projex` app** (#4692) to patch project browsing in production.
- **AlexPatrie joins on UI** (from May 2023) — A massive, sustained UI program: styling/pagination (#4679), simulation/profile page layouts, a **shared UI footer** (#4750), and a Binder-linked interactive notebook (#4711).

### 2023-H2 — Cross-repo app unification
- AlexPatrie drove standardized styling and routing **across all apps** (`platform`, `dispatch`, `simulators`) — full reimplementations of the `dispatch` (#4730) and `simulators` (#4731) apps, cross-repo routing (#4742), and a unified multiapp look. Added **rerun-simulation** functionality (#4780) and `biosimulators-simularium` to combine-api (#4778). jcschaff hardened **HSDS upload reliability** on SLURM (#4758–#4760).

### 2024-H1 — The simdata-api infrastructure overhaul
- **Replace HSDS with simdata-api** (#4791, 203 files) — The standout infrastructure PR: HSDS (Highly Scalable Data Service) for HDF5 was unreliable under load and failed simulation jobs. It was replaced with a new Python **`simdata-api`** (FastAPI + `h5py` + `aiobotocore` + TensorStore) that serves HDF5 from S3, caching into a **Zarr v3** store with JSON metadata — far simpler and more reliable. Follow-ups added CORS, deployment, and NaN/Infinity support.
- **Simularium + simulation editing** — Simularium file generation in combine-api (#4792); simulation **edit/rerun** of archives and custom projects (#4804, #4805).

### 2024-H2 — Framework upgrade & Biosimulations 1.0
- **Framework upgrade** (#4844, 251 files) — Nx 15→16, Angular 15→16, NestJS 9→10 via `nx update`.
- **Biosimulations 1.0 release** items (#4850); data caching in dispatch (#4858, #4859).
- **Architectural trim** — Removed the unused `/run` endpoints from combine-api (#4862), reducing service complexity and the Angular/NestJS binding surface — an early signal of moving "run" responsibility out of the monorepo toward the new stack.

### 2025 → 2026-H1 — Maintenance mode
- Sparse, targeted changes: NaN/Infinity in HDF5 (#4864), optional SLURM constraints in sbatch templates (#4875), and a cluster of 2026 **deploy/release plumbing** fixes (GitHub Actions upgrades, Node 18 in build jobs, Netlify CLI/pre-built output, SSH-key newline handling — #4876–#4880). Active feature development had shifted to `platform`/`compose-api`.

## Notable PRs
| PR | Date | Author | Why it matters |
|---|---|---|---|
| [#4665](https://github.com/biosimulations/biosimulations/pull/4665) | 2023-04-14 | jcschaff | Merge runBiosimulations into the main webapp |
| [#4673](https://github.com/biosimulations/biosimulations/pull/4673) | 2023-04-21 | jcschaff | Scalable project browsing |
| [#4730](https://github.com/biosimulations/biosimulations/pull/4730) | 2023-07-20 | AlexPatrie | Full reimplementation of the dispatch app |
| [#4791](https://github.com/biosimulations/biosimulations/pull/4791) | 2024-01-13 | jcschaff | **Replace HSDS with simdata-api** (FastAPI + Zarr v3) |
| [#4805](https://github.com/biosimulations/biosimulations/pull/4805) | 2024-04-08 | AlexPatrie | Archive simulation edit / custom rerun |
| [#4844](https://github.com/biosimulations/biosimulations/pull/4844) | 2024-10-19 | jcschaff | Framework upgrade (Nx/Angular/NestJS) |
| [#4862](https://github.com/biosimulations/biosimulations/pull/4862) | 2024-12-20 | jcschaff | Remove `/run` endpoints from combine-api |

## Key contributors
- **jcschaff** — overall lead: CI/build rescue, runBiosimulations integration, scalable browsing, the simdata-api overhaul, framework upgrades, architectural trimming.
- **AlexPatrie** — the entire 2023–2024 UI program: cross-repo styling, app reimplementations, simulation edit/rerun, data caching.
- **bilalshaikh42** — dependency/app migration (#4624) and earlier core platform work.
- **jmdetloff** — 2022 dispatch-form features.
- **luciansmith** — simulator integration (xppaut).

## Tech & stack notes
- **Nx monorepo**: Angular (frontend), NestJS (backends), Python `combine-api`; semantic-release versioning (currently v9.65+).
- Data plane evolved **HSDS → simdata-api** (FastAPI, h5py, aiobotocore, TensorStore, **Zarr v3**, S3).
- HPC execution via **SLURM**; KiSAO/biosimulators-utils for algorithm terms; Simularium for visualization.
- Deployed via Kubernetes + Netlify (frontend); heavy CI/CD in GitHub Actions.
