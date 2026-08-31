# sed

> All Python code related to the new SED (Simulation Experiment Description) standard.

**Group:** Verification / BSVS era · **PRs since 2022-09:** 33 (~7 substantive, rest dependency automation) · **Active span:** 2025-12 – 2026-05 · **Key contributors:** luciansmith (Lucian Smith), Ezequiel-Valencia, prismofeverything (Ryan Spangler), CodeByDrescher

## Project background
`sed` houses the Python reference implementation for the **next-generation SED (Simulation Experiment Description) standard** — the successor to SED-ML for describing how a simulation experiment should be run. It is led by **Lucian Smith**, a long-time COMBINE/standards contributor, and is the "standalone biosim scripts" effort: a clean Python data model plus exporters that bridge the standard to executable form. Critically, it includes a **Process Bigraph (PBG) prototype**, tying the SED standard into the new Process Bi-Graph execution ecosystem.

## Timeline (themed milestones)

### 2025-H2 — Establishing the repo
- **SED branch becomes main** (#1, Ezequiel-Valencia) — The working SED branch was promoted to the primary line, establishing the repo's direction in December 2025.

### 2026-H1 — Lucian's data model, PBG prototype, and Python export
- **Testing infrastructure** (#21, Ezequiel-Valencia) — Built out the test harness before the major data-model work.
- **Lucian's new draft** (#27) — Lucian Smith's first major contribution: 50 files reworking the implementation to match the new SED draft, with passing functional tests (linting deferred).
- **SED + PBG prototype** (#29) — A prototype connecting SED to **Process Bigraph**, the key integration point between the standards layer and the PBG execution toolkit.
- **Core data model + Python export** (#30/#31) — A broad set of updates to both the core data model and the Python export path. Followed by **more Python exporting** (#33, 122 files) — the largest single change, fleshing out how SED documents are serialized/exported for execution.

## Notable PRs
| PR | Date | Author | Why it matters |
|---|---|---|---|
| [#1](https://github.com/biosimulations/sed/pull/1) | 2025-12-19 | Ezequiel-Valencia | SED branch promoted to main |
| [#21](https://github.com/biosimulations/sed/pull/21) | 2026-03-30 | Ezequiel-Valencia | Testing infrastructure |
| [#27](https://github.com/biosimulations/sed/pull/27) | 2026-04-22 | luciansmith | Lucian's new SED draft implementation |
| [#29](https://github.com/biosimulations/sed/pull/29) | 2026-04-27 | luciansmith | SED ↔ Process Bigraph prototype |
| [#30](https://github.com/biosimulations/sed/pull/30) | 2026-05-04 | luciansmith | Core data model + Python export |
| [#33](https://github.com/biosimulations/sed/pull/33) | 2026-05-18 | luciansmith | Expanded Python exporting (122 files) |

## Key contributors
- **luciansmith (Lucian Smith)** — drives the SED standard's data model and Python exporters; the PBG prototype.
- **Ezequiel-Valencia** — repo setup, testing infrastructure, PBG-side integration.
- **prismofeverything (Ryan Spangler)** and **CodeByDrescher** — supporting contributions.

## Tech & stack notes
- **Python**; a clean SED data model with exporters.
- Integrates with **Process Bigraph (PBG)** as the execution target (#29).
- Part of the standards layer consumed by `compose-api` (SED-ML endpoint) and the verification `platform`.
