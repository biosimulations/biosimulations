# pbsim_common & pbsim_actin (PBG libraries)

> `pbsim_common`: standard library of processes/steps/composites for Process Bi-Graph. · `pbsim_actin`: multiscale-actin wrapper for PBG.

**Group:** Process Bi-Graph (PBG) · **PRs since 2022-09:** pbsim_common 16, pbsim_actin 11 (**all functional work landed via direct commits; nearly every PR is dependency automation**) · **Active span:** 2026-03 – 2026-06 · **Key contributors:** Ezequiel-Valencia

## Project background
These two repos round out the Process Bi-Graph ecosystem:
- **`pbsim_common`** is the **standard library** for Process Bi-Graph — a curated collection of high-quality processes, steps, and composites reused across PBG models, analogous to a stdlib for the toolkit.
- **`pbsim_actin`** is a **domain-specific PBG wrapper for multiscale actin** simulation, demonstrating how a real scientific model is packaged as a Process Bi-Graph (notably integrating the **ReaDDy** particle simulator).

## Timeline (themed milestones)
Both repos came online in early 2026 and were developed primarily through **direct commits to `main`** (Ezequiel-Valencia: ~5 commits on `pbsim_common`, ~36 on `pbsim_actin`), so the PR history is dominated by Dependabot/Renovate dependency bumps rather than feature PRs.

- **pbsim_actin** — Renovate configured (#1, 2026-03); the one substantive PR is **"Update readdy pt2"** (#10, 2026-03-13, Ezequiel-Valencia), advancing the ReaDDy-based actin model. The remaining PRs bump shared dependencies (tornado, cryptography, pillow, uv, etc.), several scoped to a vendored `/pbsim_common` directory — indicating `pbsim_common` is consumed as a sub-package.
- **pbsim_common** — Renovate configured (#9, 2026-05); all 16 PRs are Dependabot/Renovate version bumps. The library content itself was committed directly.

## Notable PRs
| PR | Date | Author | Why it matters |
|---|---|---|---|
| [pbsim_actin #10](https://github.com/biosimulations/pbsim_actin/pull/10) | 2026-03-13 | Ezequiel-Valencia | ReaDDy multiscale-actin update (only substantive PR) |

## Key contributors
- **Ezequiel-Valencia** — author of both libraries (predominantly via direct commits).

## Tech & stack notes
- **Python**, managed with **uv**; Dependabot + Renovate for dependency hygiene.
- `pbsim_actin` integrates the **ReaDDy** particle-based reaction-diffusion simulator and vendors/depends on `pbsim_common`.
- *Caveat:* because feature work bypassed PRs, this entry reflects commit/dependency signals rather than PR narratives.
