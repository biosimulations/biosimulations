# deployment

> Kubernetes configuration for BioSimulations.

**Group:** Core platform / infra · **PRs since 2022-09:** 51 (50 automated; **1 human PR** — config is maintained via direct commits + a deploy daemon) · **Active span:** continuous through 2026-06 · **Key contributors:** biosimulations-daemon (automated, 1390 commits), bilalshaikh42 (675), jcschaff, jonrkarr

## Project background
`deployment` holds the **Kubernetes/GitOps configuration** that runs the BioSimulations platform — manifests, overlays, and the continuous-deployment wiring for the cluster. It is the operational backbone: a `biosimulations-daemon` bot continuously reconciles/auto-commits config (1390 commits), and Renovate keeps base images and GitHub Actions current. Human architecture decisions land mostly as direct commits rather than PRs.

## Timeline (themed milestones)
- **Continuous GitOps** — Throughout the window the repo is driven by the **biosimulations-daemon** (automated config reconciliation) and **Renovate** (image/action bumps), so the PR stream is almost entirely automation. The single human PR since Sept 2022 is **#73 "update hsds config"** (2023-08-28, jcschaff), aligning the cluster with the HSDS data-service work then underway in the monorepo.
- **2024–2026 maintenance** — Ongoing automated updates to the Grafana monitoring stack and CI actions (e.g., `actions/checkout` v5→v7), reflecting steady operational upkeep rather than feature work.

## Notable PRs
| PR | Date | Author | Why it matters |
|---|---|---|---|
| [#73](https://github.com/biosimulations/deployment/pull/73) | 2023-08-28 | jcschaff | HSDS cluster config update (only human PR) |

## Key contributors
- **bilalshaikh42** — original author of the deployment architecture (675 commits).
- **jcschaff / jonrkarr** — operational updates via direct commits.
- **biosimulations-daemon** — automated continuous deployment.

## Tech & stack notes
- **Kubernetes** manifests/overlays (Shell + YAML); GitOps via an auto-committing daemon.
- **Grafana** monitoring stack; Renovate-managed base images and GitHub Actions.
- *Caveat:* PR history under-represents activity — most operational change is direct-commit/daemon-driven.
