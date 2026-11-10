# biosim-client

> Python library/client for accessing the BioSimulations APIs.

**Group:** Verification / BSVS era · **PRs since 2022-09:** 41 (~5 substantive, rest dependency automation) · **Active span:** 2024-11 – 2025-09 · **Key contributors:** jcschaff (lead), luciansmith

## Project background
`biosim-client` is the Python client library for the modern BioSimulations APIs — primarily the **simdata-api** (HDF5 result data) and the **biosim-server / verification API**. It lets users programmatically run simulations, fetch results, and compare simulator outputs (verification) from notebooks or scripts, and is the external SDK counterpart to the `platform` and `compose-api` servers. The repo was created in November 2024.

## Timeline (themed milestones)

### 2025-H1 — Verification client + notebooks
- **Simulation verification via biosim-server** (#25) — The defining PR (168 files): the client gained access to both the `simdata-api` and `biosim-server` remote APIs, enabling users to **compare biosimulations runs by run id**, and to **run and compare** runs directly from an OMEX file against named simulator versions.
- **Notebooks & reports** (#27, #28) — Added a Jupyter notebook and a summary verification report (#27), then surfaced saved simulator plots inside the notebook (#28), making verification results readable interactively.

### 2025-H2 — Usability fixes
- **Plot download robustness** (#35) — Fixed failure to download PDF plot files when "plot" wasn't in the filename.
- **OMEX by URL** (#42) — Accept OMEX archives by URL in addition to local files, smoothing remote workflows.

## Notable PRs
| PR | Date | Author | Why it matters |
|---|---|---|---|
| [#25](https://github.com/biosimulations/biosim-client/pull/25) | 2025-02-07 | jcschaff | Verification via biosim-server + simdata-api access |
| [#27](https://github.com/biosimulations/biosim-client/pull/27) | 2025-02-08 | jcschaff | Notebook + verification summary reports |
| [#28](https://github.com/biosimulations/biosim-client/pull/28) | 2025-02-10 | jcschaff | Show saved simulator plots in notebook |
| [#42](https://github.com/biosimulations/biosim-client/pull/42) | 2025-09-25 | jcschaff | Accept OMEX archives by URL |

## Key contributors
- **jcschaff** — primary author across all substantive features.
- **luciansmith** — minor contribution.

## Tech & stack notes
- **Python** client library with Jupyter notebook integration.
- Talks to `simdata-api` (HDF5 results) and `biosim-server` / verification API.
- Works with OMEX archives (local + URL) and named simulator versions; produces verification comparison reports.
- *Note (forward-looking):* the verification `platform` convergence work (platform #51) flagged assessing whether `biosim-client` should be absorbed into that monorepo.
