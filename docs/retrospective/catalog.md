# BioSimulations Org — Repository Catalog (active since Sept 2022)

Scope: repositories in the `biosimulations` GitHub organization with contributions since **September 2022**. Forks/vendored dependencies are listed at the bottom for completeness but were not deep-dived. **Excluded by request:** vivarium-core internals and DARPA-specific work.

> **PR-count caveat:** several repos do most of their work via **direct commits to `main` or scheduled GitHub Actions**, so a low PR count does *not* mean low activity. Where that's the case it's noted. "Substantive PRs" excludes Renovate/Dependabot/semantic-release noise.

## Active repositories (deep-dived)

| Repo | Group | One-line description | PRs (subst.) | Key people | Detail |
|---|---|---|---|---|---|
| **biosimulations** | Core platform | The Angular/NestJS Nx monorepo — share/reuse models, simulations, visualizations (biosimulations.org) | 240 (133) | jcschaff, AlexPatrie, bilalshaikh42 | [repos/biosimulations.md](repos/biosimulations.md) |
| **compose-api** | Verification/BSVS | API for reproducible biological workflows & cosimulations on HPC | 68 (~20) | Ezequiel-Valencia, jcschaff | [repos/compose-api.md](repos/compose-api.md) |
| **platform** | Verification/BSVS | Biological Simulation Verification Service (BSVS) server — the "verification-api" | 57 (~18) | jcschaff, AlexPatrie, HarrisonCreates | [repos/platform.md](repos/platform.md) |
| **deployment** | Core platform / infra | Kubernetes/GitOps config (daemon + direct commits) | 51 (1) | bilalshaikh42, jcschaff, daemon | [repos/deployment.md](repos/deployment.md) |
| **process-bigraph-lang** | Process Bi-Graph | DSL + language server for Process Bigraphs | 44 (~16) | jcschaff, CodeByDrescher | [repos/process-bigraph-lang.md](repos/process-bigraph-lang.md) |
| **biosim-client** | Verification/BSVS | Python client for the BioSimulations APIs | 41 (~5) | jcschaff | [repos/biosim-client.md](repos/biosim-client.md) |
| **sed** | Verification/BSVS | Python impl of the new SED standard (+ PBG prototype) | 33 (~7) | luciansmith, Ezequiel-Valencia | [repos/sed.md](repos/sed.md) |
| **pbest** | Process Bi-Graph | Process Bi-Graph Extensible Simulation Toolkit (local + remote) | 31 (~19) | Ezequiel-Valencia | [repos/pbest.md](repos/pbest.md) |
| **biosimulations-bigg** | Model importers | Publish the BiGG model repository (scheduled) | 17 (0) | jonrkarr | [repos/model-importers.md](repos/model-importers.md) |
| **pbsim_common** | Process Bi-Graph | PBG standard library of processes/steps/composites | 16 (0) | Ezequiel-Valencia | [repos/pbsim-libraries.md](repos/pbsim-libraries.md) |
| **biosimulations-modeldb** | Model importers | Publish the ModelDB model repository (scheduled) | 14 (0) | jonrkarr, BrmnYng | [repos/model-importers.md](repos/model-importers.md) |
| **biosimulations-runutils** | Verification/BSVS | Run/compare OMEX archives; the comparison **scoring** function | 12 (~4) | luciansmith, jcschaff | [repos/biosimulations-runutils.md](repos/biosimulations-runutils.md) |
| **pbsim_actin** | Process Bi-Graph | Multiscale-actin PBG wrapper (ReaDDy) | 11 (1) | Ezequiel-Valencia | [repos/pbsim-libraries.md](repos/pbsim-libraries.md) |
| **biomodels-regression** | Model importers | Regression testing for BioModels | 8 (0) | (automated) | [repos/model-importers.md](repos/model-importers.md) |
| **biomodels-qc** | Model importers | Quality-control tool for BioModels | 6 (~5) | luciansmith | [repos/model-importers.md](repos/model-importers.md) |
| **compose-api-client** | Verification/BSVS | Generated clients for compose-api | 4 (0) | (generated) | [repos/compose-api-client.md](repos/compose-api-client.md) |
| **auth0** | Core platform / infra | Auth0 tenant configuration | 3 (0) | (config) | [repos/_infra-misc.md](repos/_infra-misc.md) |
| **secrets** | Core platform / infra | Kubernetes sealed secrets | 1 (0) | (config) | [repos/_infra-misc.md](repos/_infra-misc.md) |
| **static** | Core platform / infra | Static assets at static.biosimulations.org | 1 (0) | (config) | [repos/_infra-misc.md](repos/_infra-misc.md) |
| **registry** | Process Bi-Graph | Index of repos with PBG wrappers | 1 (0) | (config) | [repos/_infra-misc.md](repos/_infra-misc.md) |

**Total substantive PRs analyzed: ~661 PRs (≈300 human/substantive after removing bots & releases).**

## Forks / vendored dependencies (noted, not deep-dived)
`eslint-plugin-exclude-strings`, `hsds`, `nestjs-bullmq`, `material-file-input`, `nx-python`, `hdf-rest-api`, `biosimulations-rulehub`, `cellml-validation`, `client` — each has 0–2 PRs since Sept 2022 (mostly Renovate onboarding or small patches against upstream forks). `hsds`/`hdf-rest-api` relate to the HDF data service later superseded by `simdata-api`.

## Archived / pre-2022 repos (out of scope)
`physiome-2`, `Biosimulations_utils`, `biosimulations-physiome`, `biosimulations-biomodels`, `Owl2Json`, `Biosimulations_Ontologies`, `Biosimulations_Dispatch`, `Biosimulations_Query`, `Biosimulations_API`, and other 2020–2021 repos — no contributions since Sept 2022.
