# Infra & config repos (auth0 · secrets · static · registry)

> Low-activity configuration repositories supporting the BioSimulations platform.

**Group:** Core platform / infra · **PRs since 2022-09:** auth0 3, secrets 1, static 1, registry 1 (**all dependency/Renovate automation — content maintained via direct commits**) · **Active span:** 2022 – 2026

## Project background
These four repos hold configuration and assets rather than application code; they change rarely and via direct commits, so their PR histories are essentially Dependabot/Renovate onboarding.

- **`auth0`** — Configuration settings for the Auth0 tenant (authentication for biosimulations.org). The only repo here with multiple PRs since Sept 2022, all Dependabot bumps to the deploy tooling (qs, jsonwebtoken/auth0-deploy-cli, cookiejar) across 2022-12 → 2023-01.
- **`secrets`** — Kubernetes deployment secrets (sealed secrets); single Renovate-onboarding PR (#12, 2023-12). Actual secret material is managed directly/securely.
- **`static`** — Static files hosted at `static.biosimulations.org`; single Renovate-onboarding PR (#1, 2023-12). Assets added via direct commits.
- **`registry`** — Registry of all supported repositories that have **PBG (Process Bi-Graph) wrappers** — i.e., the index of which repos expose PBG-compatible simulators. Created in the 2026 PBG era; single Renovate-onboarding PR (#1, 2026-05). Notable mainly as evidence of the PBG ecosystem's growth into a discoverable registry.

## Notable PRs
None substantive — these repos are configuration/asset stores maintained outside the PR workflow.

## Tech & stack notes
- `auth0`: HTML/JS Auth0 tenant config (auth0-deploy-cli).
- `secrets`: Kubernetes sealed secrets (Shell/YAML).
- `static`: static web assets (CSS/HTML).
- `registry`: PBG wrapper index — ties into the `pbest` / `process-bigraph-lang` ecosystem.
