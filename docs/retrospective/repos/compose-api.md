# compose-api

> An API server for reproducible biological workflows and cosimulations.

**Group:** Verification / BSVS era · **PRs since 2022-09:** 68 (~20 substantive, rest dependency automation) · **Active span:** 2025-07 – 2026-05 · **Key contributors:** Ezequiel-Valencia (lead), jcschaff, CodeByDrescher

## Project background
`compose-api` is the HTTP API server that drives reproducible biological workflows and cosimulations on HPC infrastructure. It builds simulator containers on SLURM, tracks builds/simulators/simulations in a database, and exposes endpoints for submitting Process Bigraph (PB) compositions and SED-ML experiments. It is the execution backbone of the newer BioSimulations stack — sitting alongside the verification service (`platform`) and the Process Bi-Graph toolkit (`pbest`) — and replaces ad-hoc dispatch with a container-on-SLURM model. The repo was bootstrapped in July 2025 from an earlier `sms-api` codebase.

## Timeline (themed milestones)

### 2025-H2 — Bootstrapping and core execution model
- **Repo bootstrap and identity** — Created in July 2025 from the `sms-api` base (#2, 175 files), quickly renamed from `biosim-api` to `compose-api` (#10) and given an initial deploy target on `vxrails` (#11). Tooling moved from Poetry to **uv** for dependency management (#18).
- **SLURM execution engine** — The defining milestone: a simple SLURM submission pipeline (#41) turned the repo into "an API server capable of building containers on SLURM, managing a DB of builds/simulators/simulations, and exposing submission of PB via endpoints." This established the build-container-then-submit architecture.
- **Simulator + experiment surface** — Database modeling improved to better represent packages (#47) and an allow-list table for access control (#49). COPASI was added as a simulator (#51), and a SED-ML submission endpoint landed (#55), connecting the standards layer to execution. QoL improvements for users followed (#58).
- **Desktop split** — Shared functionality was separated into a desktop tool and the wiring fixed (#61, CodeByDrescher).

### 2026-H1 — Execution kit, more engines, batch & portability
- **Execution starter kit** — A substantial refactor adopting a shared "execution starter kit" (#72) plus updated image building (#74) standardized how simulations are packaged and launched.
- **More simulators** — ReaDDy added as a simulation engine (#80); experiments gained explicit time-range specification (#86); process-bigraph dependency bumped (#101).
- **Batch processing** — Batch submission (#104) and batch configuration (#114) added throughput for running many experiments together.
- **Portable / production deployment** — "Portable deployment 2" (#115), then the HPC backend migration (#116): moved off the legacy `crbmapi` account and `/home/FCAM/crbmapi` NFS share onto the `svc_compose` service account and `/projects/CRBM`, aligning dev/local SLURM partitions with prod (`vcell`). This hardened the service for production use.

## Notable PRs
| PR | Date | Author | Why it matters |
|---|---|---|---|
| [#2](https://github.com/biosimulations/compose-api/pull/2) | 2025-07-24 | jcschaff | Repo bootstrap from `sms-api` |
| [#18](https://github.com/biosimulations/compose-api/pull/18) | 2025-08-04 | jcschaff | Switched dependency tooling to uv |
| [#41](https://github.com/biosimulations/compose-api/pull/41) | 2025-09-29 | Ezequiel-Valencia | Core SLURM container-build + submission engine |
| [#51](https://github.com/biosimulations/compose-api/pull/51) | 2025-10-14 | Ezequiel-Valencia | COPASI simulator support |
| [#55](https://github.com/biosimulations/compose-api/pull/55) | 2025-10-22 | Ezequiel-Valencia | SED-ML submission endpoint |
| [#72](https://github.com/biosimulations/compose-api/pull/72) | 2026-02-02 | Ezequiel-Valencia | Adopt shared execution starter kit |
| [#104](https://github.com/biosimulations/compose-api/pull/104) | 2026-04-10 | Ezequiel-Valencia | Batch processing |
| [#116](https://github.com/biosimulations/compose-api/pull/116) | 2026-05-18 | jcschaff | Production HPC backend migration to `svc_compose` / `/projects/CRBM` |

## Key contributors
- **Ezequiel-Valencia** — primary author; built the SLURM engine, simulator integrations (COPASI, ReaDDy), SED-ML endpoint, batch processing, and DB modeling.
- **jcschaff** — bootstrap, tooling (uv), and production HPC/deployment migration.
- **CodeByDrescher** — desktop-tool separation and wiring.

## Tech & stack notes
- **Python** API server; dependency management migrated **Poetry → uv** (#18).
- Execution on **SLURM** with **Singularity/container builds**; jobs tracked in a database (builds, simulators, simulations) with an allow-list access model.
- Simulator engines integrated: **COPASI**, **ReaDDy**; submits **Process Bigraph** compositions and **SED-ML** experiments.
- Deployed via Kubernetes overlays (`rke`, `local`) with sealed secrets; production HPC on UConn Health `vcell`/CRBM infrastructure.
