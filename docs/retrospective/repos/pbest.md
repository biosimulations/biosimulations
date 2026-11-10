# pbest

> Process Bi-Graph Extensible Simulation Toolkit — Python tool for creating and executing Process Bi-Graphs locally or remotely.

**Group:** Process Bi-Graph (PBG) · **PRs since 2022-09:** 31 (~19 substantive) · **Active span:** 2025-11 – 2026-05 · **Key contributors:** Ezequiel-Valencia (lead), CodeByDrescher, luciansmith, prismofeverything (Ryan Spangler)

## Project background
`pbest` (the **P**rocess **B**i-graph **E**xtensible **S**imulation **T**oolkit) is the Python toolkit for building and running **Process Bi-Graphs (PBG)** — compositional, multiscale simulation models — either on a local machine or remotely on HPC. It provides a compiler, a composite builder, simulator-process wrappers, result aggregation/comparison, and CLI + containerized execution. It sits at the center of the PBG ecosystem alongside `process-bigraph-lang` (the DSL), `pbsim_common` (standard library), and `pbsim_actin` (a domain wrapper), and is invoked by `compose-api` for remote execution.

## Timeline (themed milestones)

### 2025-H2 — Compiler, composites, and comparison
- **Compiler + composite builder** — Work began on the PBG compiler (#1, "3rd stage") and an initial composite builder (#8). A **comparison process** (#7) and result **aggregation** (#10) established the toolkit's role in comparing simulator outputs — the verification angle. "Harmony tests" (#12) added validation.
- **Decoupling from sed** (#13) — Removed the embedded `sed` code (−1256 lines), splitting standards concerns out into the dedicated `sed` repo.

### 2026-H1 — CLI, containerization, remote execution, and 1.0
- **CLI + containerization** — A new entry point for CLI users (#14), updated containerization (#15), and added **simulator processes** (#16) made the toolkit usable as a standalone tool.
- **Publishing + result persistence** — The repository was published (#22) and a "save results" option added (#25).
- **Remote execution** (#31) — Gained the ability to execute Process Bi-Graphs remotely (HPC), the key capability that `compose-api` builds on.
- **Process Bigraph 1.0** (#38) — Upgraded the underlying `process-bigraph` dependency from beta to its official 1.0 release; added simple versioning (#41).
- **Builder + job-submission refinement** — Iterations on a cleaner PBG builder (#46), simpler job submission (#48, #50), version-aware container constructor (#51), and a CLI container constructor (#52).

## Notable PRs
| PR | Date | Author | Why it matters |
|---|---|---|---|
| [#7](https://github.com/biosimulations/pbest/pull/7) | 2025-11-25 | Ezequiel-Valencia | Comparison process (verification core) |
| [#13](https://github.com/biosimulations/pbest/pull/13) | 2025-12-22 | Ezequiel-Valencia | Split `sed` out into its own repo |
| [#16](https://github.com/biosimulations/pbest/pull/16) | 2026-01-08 | Ezequiel-Valencia | Simulator processes |
| [#22](https://github.com/biosimulations/pbest/pull/22) | 2026-01-16 | Ezequiel-Valencia | Publish repository |
| [#31](https://github.com/biosimulations/pbest/pull/31) | 2026-02-18 | Ezequiel-Valencia | Remote (HPC) execution |
| [#38](https://github.com/biosimulations/pbest/pull/38) | 2026-03-16 | Ezequiel-Valencia | Upgrade to Process Bigraph 1.0 |
| [#52](https://github.com/biosimulations/pbest/pull/52) | 2026-05-08 | Ezequiel-Valencia | CLI container constructor |

## Key contributors
- **Ezequiel-Valencia** — primary author of the compiler, composites, comparison, CLI, containerization, and remote execution.
- **luciansmith, CodeByDrescher, prismofeverything** — supporting contributions (PBG runtime, standards, tooling).

## Tech & stack notes
- **Python**; depends on **`process-bigraph`** (upgraded beta → 1.0).
- Containerized (Docker/Singularity) execution; local **and remote/HPC** runs.
- Comparison/aggregation features tie it to the verification mission; consumed by `compose-api`.
