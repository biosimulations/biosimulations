# platform

> Server for the Biological Simulation Verification Service (BSVS) — the "verification-api".

**Group:** Verification / BSVS era · **PRs since 2022-09:** 57 (many are Snyk base-image bumps; ~18 substantive) · **Active span:** 2025-01 – 2026-06 · **Key contributors:** jcschaff (lead, 233 commits), AlexPatrie (54), HarrisonCreates (frontend)

## Project background
`platform` is the backend (and, from 2026, the full-stack monorepo) for the **Biological Simulation Verification Service (BSVS)** — the service that runs the same model/experiment across multiple simulators and verifies that their results agree. It orchestrates simulation runs as **Temporal workflows**, parses OMEX archives, matches algorithms to simulators via the **KiSAO** ontology, executes on HPC/SLURM, and stores results in MongoDB/GCS. It is the verification heart of the modern BioSimulations stack and, in 2026, absorbed a web frontend to become the user-facing verification webapp.

## Timeline (themed milestones)

### 2025-H1 — Foundations and the move to GCP
- **Cloud + scoring** — The first PR migrated storage from S3 to GCS and adopted the `biosimulations-runutils` scoring function for comparing simulator outputs (#1), establishing the result-comparison core. Persistence, caching, and a broad refactor followed (#2).
- **Repo move/rename** — The repo was moved and renamed (#5); much of AlexPatrie's 54 commits of earlier history carried over from the pre-rename codebase.

### 2025-H2 — Hardening (mostly maintenance)
- A long run of Snyk security upgrades kept the Python base image current (3.11 → 3.13 → 3.14 series). Functional change was light apart from a Swagger-UI CDN fix (#24).

### 2026-Q1 — Backend-for-frontend for the new webapp
- **Compatibility + run endpoints** (#37) — The pivotal PR: new BFF endpoints for the biosimulations webapp. `/compatibility/check` parses OMEX archives, extracts formats/algorithms, and uses **KiSAO ontology-based equivalence** to return eligible simulators and versions. `/simulations/run` triggers runs across user-selected simulators as a trackable "conglomerate" of jobs with a two-phase submit/poll workflow for real-time status. KiSAO data + generation scripts added.

### 2026-H1 — Monorepo, frontend integration, and convergence
- **Monorepo restructure** (#38) — Moved the backend to `backend/` and bumped to 0.4.0, setting up for a combined frontend/backend repo.
- **Frontend/backend integration (phased)** — A documented multi-phase plan: pre-work (#39), local dev stack (#40), **joint Kubernetes deployment** with ingress subdomain split, multi-arch buildx images, and per-overlay frontend config (#41), then integration tests + a joint-stack smoke workflow (#42). Follow-up fixes addressed GKE subdomain cutover, Windows local-dev, per-service `.env` files, and SSR hydration bugs (#43–#47).
- **Simulation-runs convergence series** (#48–#53) — A deliberate refactor (documented in `simulation-runs-convergence-plan.md`) to unify the *run* path and the *verify* path. `SimulationRunWorkflow` was converged onto a child **`OmexSimWorkflow`** (the same per-run unit the verification path uses), deleting duplicate submit/poll activities (#51), with a notable finding that a Temporal parent cannot query a running child. Added a `/simulations/runs` listing endpoint (#48) and enriched run metadata from biosimulations.org (#50).
- **Release + frontend runs page** — Tag-triggered image publish + GitHub Release CI (#55), bump to 0.5.0 with prod overlay repoint (#56), and HarrisonCreates' full **runs page** with pagination and backend integration (#57).

## Notable PRs
| PR | Date | Author | Why it matters |
|---|---|---|---|
| [#1](https://github.com/biosimulations/platform/pull/1) | 2025-01-29 | jcschaff | S3→GCS + runutils scoring function |
| [#2](https://github.com/biosimulations/platform/pull/2) | 2025-02-06 | jcschaff | Persistence, caching, core refactor |
| [#37](https://github.com/biosimulations/platform/pull/37) | 2026-02-26 | jcschaff | Compatibility-check + run endpoints (KiSAO, Temporal) for the webapp |
| [#38](https://github.com/biosimulations/platform/pull/38) | 2026-05-08 | jcschaff | Restructure to monorepo (backend/) |
| [#41](https://github.com/biosimulations/platform/pull/41) | 2026-05-15 | jcschaff | Joint K8s deployment, ingress split, multi-arch images |
| [#51](https://github.com/biosimulations/platform/pull/51) | 2026-05-29 | jcschaff | Converge run path onto OmexSimWorkflow child |
| [#57](https://github.com/biosimulations/platform/pull/57) | 2026-06-09 | HarrisonCreates | Frontend runs page with pagination |

## Key contributors
- **jcschaff** — overall lead; cloud migration, BFF endpoints, Temporal workflow architecture, monorepo + frontend/backend integration, convergence refactor.
- **AlexPatrie** — substantial earlier backend work (54 commits, much from the pre-rename history).
- **HarrisonCreates** — web frontend (runs page).

## Tech & stack notes
- **Python** backend; **Temporal** for durable simulation/verification workflows (`OmexVerifyWorkflow`, `OmexSimWorkflow`, `SimulationRunWorkflow`).
- **MongoDB** + **GCS** for persistence/caching; migrated off AWS S3.
- **KiSAO** ontology for algorithm-equivalence and simulator-compatibility matching; OMEX archive parsing.
- HPC/**SLURM** execution; results scored via `biosimulations-runutils`.
- 2026 monorepo with a web **frontend** (SSR), deployed via Kustomize overlays on **GKE/RKE**, multi-arch (`amd64`/`arm64`) buildx images, tag-triggered release CI.
