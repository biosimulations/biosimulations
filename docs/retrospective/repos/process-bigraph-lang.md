# process-bigraph-lang

> Domain Specific Language and Language Server for Process Bigraphs.

**Group:** Process Bi-Graph (PBG) · **PRs since 2022-09:** 44 (~16 substantive human PRs; later work via direct commits + dependency bots) · **Active span:** 2025-04 – 2026-02 · **Key contributors:** jcschaff (lead, 128 commits), CodeByDrescher

## Project background
`process-bigraph-lang` is the **domain-specific language (DSL) and language server** for authoring **Process Bigraphs** — a human-readable, strongly-typed syntax that compiles to the Process Bigraph JSON document model executed by `pbest`. It provides parsers (ANTLR4, for Python and C++), a Pydantic-backed AST, a standalone native CLI, and generators (e.g., SBML stubs), giving the PBG ecosystem an authoring front-end. Most substantive design landed as PRs in spring 2025; later refinement continued via direct commits.

## Timeline (themed milestones)

### 2025-Q2 — DSL bring-up (April–June 2025)
- **Python wrapper + native CLI** — A Python wrapper and Pythonic datamodel for the CLI (#7), then a **standalone native executable** for the DSL CLI built with esbuild + nexe (#8) and a Deno-based native CLI build (#9). This made the language usable as a self-contained tool.
- **AST + typed model** — JSON generation from the AST with **Pydantic** capturing the AST (#11); `CompositeDef` added to the AST/Pydantic (#17); schema and state separated in the PB datamodel (#24).
- **Parsers & grammar** — **ANTLR4 parsers** for Python and C++ (#15, 13,645 lines); a refactored DSL grammar with a compiler (#21), removal of unused grammar syntax (#22), and finally a **new strongly-typed DSL grammar** (#25).
- **Integration & generation** — Python path → process-def registry population (#16); binding to objects as well as paths for language references (#18); integrating generation from the `SimpleProcessBigraphRuntime` repo (#19); a **Process Bigraph JSON document assembler** (#20); an SBML stub-generation command (#13); and `spatio_flux` model tests against the PB datamodel (#23).

### 2025-H2 → 2026 — Maintenance via direct commits
- After June 2025 the PR stream is dependency automation; functional refinement (and CodeByDrescher's contributions) continued through direct commits, with the repo last active early 2026.

## Notable PRs
| PR | Date | Author | Why it matters |
|---|---|---|---|
| [#8](https://github.com/biosimulations/process-bigraph-lang/pull/8) | 2025-04-21 | jcschaff | Standalone native DSL CLI executable |
| [#15](https://github.com/biosimulations/process-bigraph-lang/pull/15) | 2025-05-03 | jcschaff | ANTLR4 parsers (Python + C++) |
| [#19](https://github.com/biosimulations/process-bigraph-lang/pull/19) | 2025-05-16 | jcschaff | Integrate SimpleProcessBigraphRuntime generation |
| [#20](https://github.com/biosimulations/process-bigraph-lang/pull/20) | 2025-05-17 | jcschaff | Process Bigraph JSON document assembler |
| [#21](https://github.com/biosimulations/process-bigraph-lang/pull/21) | 2025-05-22 | jcschaff | Refactor DSL grammar + compiler |
| [#25](https://github.com/biosimulations/process-bigraph-lang/pull/25) | 2025-06-02 | jcschaff | New strongly-typed DSL grammar |

## Key contributors
- **jcschaff** — designed and built the DSL, parsers, AST, native CLI, and JSON assembler.
- **CodeByDrescher** — supporting contributions (largely via direct commits).

## Tech & stack notes
- **TypeScript/Node** native CLI (esbuild + nexe, Deno build) plus **Python** tooling.
- **ANTLR4** grammars (Python + C++ targets); **Pydantic** AST model.
- Generates the **Process Bigraph JSON** document consumed by `pbest`; SBML stub generation; `spatio_flux` test models.
