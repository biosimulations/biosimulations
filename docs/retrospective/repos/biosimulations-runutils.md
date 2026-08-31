# biosimulations-runutils

> Automation tools for running and comparing biosimulations from OMEX archives.

**Group:** Verification / BSVS era · **PRs since 2022-09:** 12 (~4 substantive, rest dependency bots) · **Active span:** 2024-09 (feature work) · **Key contributors:** luciansmith (Lucian Smith), jcschaff

## Project background
`biosimulations-runutils` is a small but pivotal Python utility library for **running OMEX archives across simulators and comparing/scoring the results**. Its comparison **scoring function** became a building block of the verification service: the `platform` (BSVS) repo's first PR explicitly adopted "the runutils scoring function." It predates the larger verification refactor and seeded the quantitative comparison logic later generalized in `pbest` and `platform`.

## Timeline (themed milestones)

### 2024-H2 — Multi-simulator runs and scoring (the core)
- **Simulator versioning** (#6, jcschaff) — Specify a simulator version when running simulations.
- **Multiple simulators + resumability** (#7, luciansmith) — Run several simulators and "pick up where you left off," enabling batch comparison runs.
- **Comparison scoring** (#8, luciansmith) — Added a **score to the comparison** — the quantitative agreement metric later reused by the verification `platform`.

### 2025–2026 — Maintenance
- Subsequent PRs are Dependabot/Renovate dependency bumps; the scoring/run logic remained stable and was consumed downstream.

## Notable PRs
| PR | Date | Author | Why it matters |
|---|---|---|---|
| [#7](https://github.com/biosimulations/biosimulations-runutils/pull/7) | 2024-09-23 | luciansmith | Multiple simulators + resumable runs |
| [#8](https://github.com/biosimulations/biosimulations-runutils/pull/8) | 2024-09-24 | luciansmith | Comparison **scoring** function (reused by `platform`) |
| [#6](https://github.com/biosimulations/biosimulations-runutils/pull/6) | 2024-09-20 | jcschaff | Per-run simulator version selection |

## Key contributors
- **luciansmith (Lucian Smith)** — multi-simulator execution and the comparison scoring metric.
- **jcschaff** — simulator version selection.

## Tech & stack notes
- **Python**; operates on **OMEX** archives; produces a numeric comparison score across simulator outputs.
- Upstream dependency of the verification `platform` (scoring) and conceptually a precursor to `pbest`'s comparison process.
