# BioSimulations — Org-wide Timeline (Sept 2022 – 2026)

A chronological narrative woven across all active repos. It traces four strategic eras: (1) the tail of the original Angular/NestJS platform, (2) the 2023 monorepo rebuild + UI unification, (3) the 2024 data-infrastructure overhaul and model-importer steady state, and (4) the 2025–2026 pivot to a new stack — the **verification service (BSVS)**, the **compose-api** execution engine, the new **SED standard**, and the **Process Bi-Graph (PBG)** ecosystem.

PR volume by half-year (all active repos): 2022-H2 **13** · 2023-H1 **118** · 2023-H2 **64** · 2024-H1 **46** · 2024-H2 **70** · 2025-H1 **58** · 2025-H2 **99** · 2026-H1 **193**.

---

## 2022-H2 — Tail of the original platform
The original team wound down dispatch-form feature work in the `biosimulations` monorepo: consolidating forms modules, the modify-archive flow (#4582), and adopting the combine-api datamodel (#4588). Activity was light (13 PRs) — a lull before the rebuild.

## 2023-H1 — The monorepo rebuild and the UI program begins (peak: 118 PRs)
The busiest period in the window. **jcschaff** led a sweeping repair of the `biosimulations` monorepo — fixing CI/build/test and migrating apps (#4624, #4640) — then made the strategic move of **merging "runBiosimulations" into the main webapp** (#4665) and tackling **scalable project browsing** for large model counts (#4620, #4673, #4675), including the stop-gap `projex` app (#4692). From May 2023, **AlexPatrie** began a sustained **UI unification program**: shared styling, pagination, a common footer, and the start of cross-repo app work.

## 2023-H2 — Cross-repo app unification + data-reliability pains
AlexPatrie reimplemented the `dispatch` (#4730) and `simulators` (#4731) apps and standardized styling/routing across all apps, adding rerun-simulation functionality (#4780) and `biosimulators-simularium` to combine-api. Meanwhile jcschaff fought **HSDS upload reliability** on SLURM (#4758–#4760) — the recurring pain that would soon force an architectural change. In parallel, **biomodels-qc** got OMEX-metadata correctness fixes from **Lucian Smith**, and the model importers (BiGG, ModelDB) ran as scheduled publishers in the background.

## 2024-H1 — The data-infrastructure overhaul
The defining infrastructure change: **replacing HSDS with the new `simdata-api`** (`biosimulations` #4791, 203 files) — a FastAPI service serving HDF5 from S3 with a Zarr v3 cache, eliminating the fine-grained upload failures that had been breaking simulation jobs. Simularium visualization landed in combine-api (#4792), and AlexPatrie added simulation **edit/rerun** of archives and custom projects (#4804, #4805). This era established the reliable data plane the platform still uses.

## 2024-H2 — Framework upgrade, "1.0," and the first architectural trim
A big housekeeping + maturity push: **Nx/Angular/NestJS framework upgrades** (#4844, 251 files), the **Biosimulations 1.0** release items (#4850), and dispatch data caching. Crucially, jcschaff **removed the unused `/run` endpoints from combine-api** (#4862) — the first visible sign that "running simulations" was being decoupled from the monorepo, foreshadowing the move to a dedicated execution/verification stack. Lucian Smith's `biosimulations-runutils` had by now contributed the **comparison scoring function** (2024-09, runutils #8) that the verification service would adopt.

## 2025-H1 — The verification service is born (BSVS) and the PBG DSL bootstraps
Two new lines start in parallel:
- **Verification / BSVS** — The `platform` repo (the "verification-api") came online: migrating storage **S3 → GCS** and adopting the **runutils scoring function** (platform #1), then persistence/caching/refactoring (#2). The **`biosim-client`** Python SDK gained verification-via-biosim-server, notebooks, and reports (biosim-client #25–#28), giving users a programmatic way to run and compare simulators.
- **Process Bi-Graph** — **`process-bigraph-lang`** bootstrapped a DSL + language server for Process Bigraphs: a native CLI (#8), ANTLR4 parsers (#15), a Pydantic AST, and a strongly-typed grammar (#25) compiling to the Process Bigraph JSON document model.

## 2025-H2 — The execution engine and the PBG toolkit take shape
- **compose-api** was bootstrapped (from `sms-api`) and quickly became the **container-on-SLURM execution engine** (compose-api #41), adding simulators (COPASI, #51) and a **SED-ML submission endpoint** (#55).
- **pbest** (the Process Bi-Graph Extensible Simulation Toolkit) grew its compiler, composite builder, **comparison process** (#7), CLI, containerization, and was published (#22).
- The **`sed`** repo split out as the home for the **new SED standard** (its branch became main, sed #1), decoupling standards code from `pbest`.
The two threads — verification and PBG — began converging on a shared idea: compose models, run them across simulators, and compare.

## 2026-H1 — Convergence and production hardening (193 PRs)
The most productive half-year, as the new stack matured toward production:
- **compose-api** added an execution starter kit (#72), ReaDDy (#80), batch processing (#104), and a **production HPC backend migration** to `svc_compose` / `/projects/CRBM` (#116).
- **platform (BSVS)** added KiSAO-based **compatibility checking** and run endpoints for a new webapp (#37), then restructured into a **frontend/backend monorepo** with joint Kubernetes deployment (#38–#42) and a **run/verify convergence series** unifying the two execution paths onto a shared `OmexSimWorkflow` (#48–#52). A web **runs page** landed (#57, HarrisonCreates).
- **pbest** upgraded to **Process Bigraph 1.0** (#38) and refined remote job submission and container construction.
- **Lucian Smith joined `sed`** with the core data model, expanded **Python export** (sed #30, #33), and a **SED ↔ Process Bigraph prototype** (#29) — directly stitching the standards layer to the PBG execution layer.
- The **PBG ecosystem widened**: `pbsim_common` (standard library), `pbsim_actin` (multiscale-actin/ReaDDy wrapper), and a `registry` of PBG-wrapped repos.
- The original **`biosimulations` monorepo** entered maintenance — deploy/release plumbing fixes only — confirming the center of gravity had shifted to the new stack.

---

## Key transitions
1. **Decoupling "run" from the monorepo** → a dedicated execution stack. Begins with removing combine-api `/run` (2024-12, #4862); realized as `compose-api` (container-on-SLURM) + `platform`.
2. **HSDS → simdata-api** (2024-01, #4791): the data-plane rewrite that made batch simulation reliable, and a template (FastAPI + cloud storage) the new services reuse.
3. **From a sharing platform to a verification + composition platform.** The mission widened from hosting models to **verifying** that simulators agree (BSVS/`platform`, runutils scoring) and **composing** multiscale models (Process Bi-Graph).
4. **A new standards + composition core.** Lucian Smith's **new SED standard** plus the **Process Bigraph** DSL/toolkit became the modeling substrate, with `sed`↔PBG prototypes tying description to execution (2026).
