# Retrospective Methodology & Playbook

How this BioSimulations org retrospective was produced — its motivation, approach, decisions, and the exact technique — written both as a record and as a **reusable guide for repeating this on another GitHub organization**.

If you only read one thing: skip to [Reusable playbook](#reusable-playbook-for-another-org).

---

## 1. Motivation

We wanted a **comprehensive historical retrospective and feature timeline** of an entire GitHub organization (BioSimulations) since a fixed start date (September 2022), spanning **many repositories and hundreds of PRs**. The goals:

- Produce a **readable executive summary** and an **org-wide timeline** of what was built and why — not a tedious PR-by-PR dump.
- Give each repo a **project description / background** (useful on its own) plus a **chronological, themed history**.
- Capture **provenance** (raw data) so claims are auditable and the report can be regenerated.
- Do it **economically and under user control** (token/cost-aware), because the same method will be repeated on other orgs.

The output had to work at two altitudes: a short report a busy reader skims, backed by detailed per-repo files for anyone who wants depth.

## 2. What we produced (deliverable shape)

```
docs/retrospective/
  00-executive-summary.md     ← readable top-level report (eras, numbers, people)
  01-timeline.md              ← org-wide chronological narrative + key transitions
  catalog.md                  ← repo catalog table (counts, contributors, caveats)
  METHODOLOGY.md              ← this file
  repos/<repo>.md             ← one detailed entry per repo or repo-group
  data/prs/<repo>.json        ← raw PR metadata per repo (provenance)
  data/repos.json             ← org repo inventory
```

Per-repo entry template (each `repos/*.md`):
1. One-line description + a header line (group · PR count · active span · key contributors)
2. **Project background** (2–4 sentences)
3. **Timeline (themed milestones)** — grouped by half-year/quarter, narrative with inline `#PR` links
4. **Notable PRs** table (PR link · date · author · why it matters)
5. **Key contributors**
6. **Tech & stack notes**

The top-level docs are *synthesized from* the per-repo entries, so the detail and the summary never drift.

## 3. Approach & the key decisions

We treated this as **Phase 0 reconnaissance → ask scoping questions → Phase 1 per-repo deep-dives → Phase 2 synthesis**. The decisions that shaped it (worth re-deciding for each new org):

| Decision | What we chose here | Why / trade-off |
|---|---|---|
| **Start-date cutoff** | 2022-09-01 | Fixed business reason. Everything older becomes "background," not timeline. |
| **Scope of repos** | Active repos in 4 logical groups; forks/vendored deps noted but not deep-dived | Forks add noise (mostly upstream + Renovate). Group repos so the report has structure. |
| **Explicit exclusions** | Excluded two adjacent bodies of work (here: vivarium-core internals, DARPA-specific) | The org contained related-but-out-of-scope work; naming exclusions up front avoids scope creep. |
| **Analysis depth** | Read PR **bodies + diff sizes** for *substantive* PRs (not every PR) | Bodies add real narrative; reading all 661 would be wasteful. Prioritize by author≠bot and diff size. |
| **Execution model** | **Serial, in-thread, batched with check-ins** | Originally planned a multi-agent fan-out (one agent/repo). Switched to serial at the user's request to **control token spend** and allow stopping at any point. See [§6](#6-execution-model-serial-vs-parallel-fan-out). |
| **Output location** | Committed to `docs/retrospective/` in the repo, on a branch, draft PR | Keeps the report versioned next to the code; draft PR invites review before "ready." |

We surfaced the depth/scope/execution/location choices as an explicit multiple-choice question to the user **before** the expensive phase, then re-confirmed once after the first repo to validate format. That early checkpoint is cheap and prevents redoing work.

## 4. Step-by-step implementation (with commands)

Everything ran through the `gh` CLI (authenticated) + `jq`. Raw data was saved to files so the analysis is reproducible and the model's context stays lean.

### Phase 0 — Inventory the org

```bash
# Full repo list with metadata (archived/fork flags, languages, last push)
gh repo list <ORG> --limit 300 \
  --json name,description,isArchived,isFork,pushedAt,createdAt,primaryLanguage,stargazerCount,diskUsage \
  > data/repos.json

# Sorted view: last-push | archived? | fork? | language | name
jq -r 'sort_by(.pushedAt)|reverse|.[]
  | [.pushedAt[0:10], (if .isArchived then "ARCH" else "live" end),
     (if .isFork then "fork" else "----" end), (.primaryLanguage.name // "—"), .name]
  | @tsv' data/repos.json | column -t -s$'\t'
```

Use `pushedAt` to filter to repos active since the cutoff. A repo last pushed **before** the cutoff has no in-window contributions and can be dropped immediately.

### Phase 0 — Size the effort (PR counts per repo)

```bash
for r in <repo1> <repo2> ...; do
  c=$(gh pr list -R <ORG>/$r --state all --limit 1000 \
        --search "created:>=2022-09-01" --json number 2>/dev/null | jq 'length')
  echo -e "$c\t$r"
done | sort -rn
```

This grand total (here ~661) tells you whether to go serial or fan out, and which repos dominate.

### Phase 0 — Find the named projects & people

Map the user's informal names ("the verification API", "Lucian's scripts") to real repos:

```bash
# Search org repos by keyword / description
gh api graphql -f query='{search(query:"org:<ORG> verification", type:REPOSITORY, first:10){
  nodes{... on Repository{name description}}}}' | jq '.data.search.nodes'

# Identify people by contributions across candidate repos
for r in <repos...>; do echo "--- $r ---";
  gh api repos/<ORG>/$r/contributors | jq -r '.[]? | "\(.contributions)\t\(.login)"' | head -6
done
```

(Here this is how we learned `platform` == the BSVS "verification-api", and `luciansmith` == "Lucian".)

### Phase 0 — Pull all PR metadata (the data foundation)

```bash
for r in <active repos...>; do
  gh pr list -R <ORG>/$r --state all --limit 1000 --search "created:>=2022-09-01" \
    --json number,title,state,createdAt,mergedAt,closedAt,author,labels,additions,deletions,changedFiles \
    > data/prs/$r.json
done
```

Sanity-check coverage (date range + bot share) before trusting it:

```bash
# date span + merged count for one repo
jq -r '"earliest:\([.[].createdAt]|min) latest:\([.[].createdAt]|max) total:\(length)"' data/prs/<repo>.json
# org-wide volume by half-year (reveals the "eras")
cat data/prs/*.json | jq -r '.[] | .createdAt[0:4] + "-H" +
  (if (.createdAt[5:7]|tonumber)<=6 then "1" else "2" end)' | sort | uniq -c
```

### Phase 1 — Per-repo deep-dive

For each repo, list **substantive** PRs (filter bots + release automation), then read bodies for the significant ones:

```bash
# chronological, non-bot, non-release PRs: date | #num | author | files±add/del | title
jq -r '[.[] | select((.author.login // "")|test("bot|renovate|dependabot|semantic")|not)
        | select(.title|test("chore\\(release\\)")|not)]
  | sort_by(.createdAt) | .[]
  | "\(.createdAt[0:10]) | #\(.number) | \(.author.login) | \(.changedFiles)f +\(.additions)/-\(.deletions) | \(.title)"' \
  data/prs/<repo>.json

# read bodies for the pivotal PRs (largest diffs / feature PRs)
gh pr view <N> -R <ORG>/<repo> --json title,body | jq -r '.title+"\n---\n"+(.body//"(no body)")'
```

Then write `repos/<repo>.md` using the template in §2, grouping PRs into **themes**, not a flat list.

### Phase 2 — Synthesis

With all per-repo entries written (and held in working context), author the three top-level docs **directly** — no further `gh` calls needed:
- `catalog.md` — the master table (regenerate counts from `data/prs/*.json`).
- `01-timeline.md` — weave milestones across repos by half-year; end with "Key transitions."
- `00-executive-summary.md` — overview, the eras, by-the-numbers, compact catalog, key people.

### Commit

```bash
git checkout -b docs/org-retrospective-since-2022
git add docs/retrospective
git commit -m "docs: add <ORG> org retrospective (<start>–<end>)"
git push -u origin docs/org-retrospective-since-2022
gh pr create --draft --base <default-branch> --title "..." --body "..."
```

## 5. Technical context & gotchas (the things that bite)

These are the non-obvious lessons — read before repeating:

- **PR count ≠ activity.** Many repos do real work via **direct commits to `main`** or **scheduled GitHub Actions**, leaving a PR history that is *only* Renovate/Dependabot. Here `deployment` (1 human PR / 51), the model importers, and the PBG libraries were all like this. **Always cross-check `gh api repos/<ORG>/<repo>/contributors`** (commit counts) against PR authorship, and explicitly caveat repos where PRs understate the work.
- **Filter three kinds of noise** from narratives: bot authors (`login` matches `bot|renovate|dependabot`), `semantic-release`, and `chore(release)` title PRs. Keep them out of the story but mention dependency-automation in one line.
- **`author.login` is null** for some deleted/ghost accounts — guard with `(.author.login // "")` in every `jq` filter or it throws.
- **Repo renames/moves hide history.** A repo created by moving another keeps commits but the early work won't appear as PRs in the new repo, and big contributors can look "invisible." We saw this on `platform` (a contributor's 54 commits predated the rename). Note it rather than guessing.
- **"Bootstrapped from X"** — repos that start as a copy of another (here `compose-api` from `sms-api`) point to predecessor repos that may be private/renamed/out-of-org. Flag as an open item; don't fabricate.
- **`gh pr list` caps at `--limit`.** Set it generously (1000) and verify the returned count is below the cap, or you'll silently truncate.
- **`--search "created:>=<date>"`** filters by creation, which is what you usually want for "contributions since." If you care about *merged* in-window instead, filter on `mergedAt` in `jq` afterward.
- **Group tiny repos.** Repos with 0–3 substantive PRs are best combined into one entry (we made `_infra-misc.md` and `model-importers.md`) so the report isn't padded with near-empty files.
- **Pre-commit hooks** (lint-staged / formatters) may reformat your markdown/JSON on commit — expected; let them run.
- **Keep raw JSON as provenance.** Committing `data/prs/*.json` lets anyone re-derive counts and re-audit claims, and lets you regenerate the report without re-hitting the API.

## 6. Execution model: serial vs. parallel fan-out

Two viable ways to run Phase 1, and the choice is mostly about **cost control**, not quality:

- **Parallel multi-agent fan-out** — one agent per repo, all at once. Fastest wall-clock; each agent has isolated context so the main thread stays lean. But it commits a large token spend up front and is harder to halt mid-run. Good when you want it *done* and aren't watching the budget.
- **Serial, in-thread, batched with check-ins** *(what we did)* — process repos one/a-few at a time, writing each file as you go, pausing for the user. Slower, but you can **stop at any point**, the cost accrues gradually, and the user sees output early and can correct format. Chosen here because the user wanted to preserve token budget for other work.

Rule of thumb: **serial for cost-sensitive or exploratory runs; parallel fan-out when the scope is settled and speed matters.** Either way, the per-repo and synthesis *artifacts* are identical — only the orchestration differs.

## 7. Reusable playbook (for another org)

A condensed checklist to repeat this elsewhere. Set these parameters first:

- `ORG` — the GitHub organization.
- `CUTOFF` — start date (e.g. `2022-09-01`).
- `EXCLUDES` — adjacent work to leave out (name it explicitly).
- `OUTDIR` — e.g. `docs/retrospective/`.

Then:

1. **Auth & verify:** `gh auth status`; confirm you can read the org.
2. **Inventory:** `gh repo list $ORG --json ... > data/repos.json`; sort by `pushedAt`; drop repos last pushed before `CUTOFF`.
3. **Size it:** PR counts per active repo since `CUTOFF`; compute the grand total and the by-half-year histogram (this reveals the eras).
4. **Map names→repos & people:** resolve the user's informal project names; list contributors across candidate repos.
5. **Scope decisions (ask the user):** depth (bodies vs titles), repo scope (groups, include forks?), execution model (serial vs fan-out), output location. Re-confirm format after the first repo.
6. **Pull data:** save all PR metadata to `data/prs/<repo>.json`.
7. **Group repos** into 3–6 logical buckets; plan to combine trivial repos.
8. **Per-repo entries:** for each (group), list substantive PRs, read pivotal bodies, write `repos/<repo>.md` (template §2). Cross-check contributors for direct-commit-heavy repos.
9. **Synthesize:** `catalog.md`, `01-timeline.md` (with "Key transitions"), `00-executive-summary.md`.
10. **Caveat honestly:** flag direct-commit repos, renames, "bootstrapped-from" predecessors, and any unresolved questions as explicit open items.
11. **Ship:** branch → commit (include `data/` for provenance) → push → draft PR → review → ready.

### Quick-start

There are two ways to run Phase 0 — **use both as you see fit**: the one-command
helper to get moving fast, and the raw commands when you need to understand or adjust
the procedure. On a new org, running the manual steps is recommended: they reinforce
what's actually happening and let you tweak filters/scope mid-flight, since `run.sh`
may not fit every repo layout.

#### Option A — one command (`run.sh`)

Steps 1–4 (auth check, inventory, sizing, data pull, half-year histogram) are
automated by **[`run.sh`](run.sh)**:

```bash
./run.sh <ORG> [CUTOFF=2022-09-01] [OUTDIR=.]

# e.g.
./run.sh my-org 2022-09-01 docs/retrospective
```

It writes `data/repos.json` + `data/prs/<repo>.json`, prints a total-vs-substantive
PR table per active repo and the org-wide PR-by-half-year histogram, then prints the
exact Phase-1 commands to continue. From there, proceed by hand/agent through steps
7–11 (group repos → per-repo entries → synthesis → caveats → ship).

`run.sh` is **read-only against GitHub** (only `gh repo list` / `gh pr list`) and
re-runnable; it overwrites `data/` in `OUTDIR`, so point `OUTDIR` at a scratch dir
first if you want to preview without touching committed provenance. Works on macOS
Bash 3.2 (no `mapfile`). Requires `gh` (authenticated) + `jq`.

#### Option B — the same steps, by hand

`run.sh` is just a wrapper around the §4 commands. When the helper isn't enough — a
weird repo layout, a non-standard noise filter, a different in-window definition —
run them yourself. This is also the better way to *learn* the procedure before
adapting it. The full commands live in
**[§4](#4-step-by-step-implementation-with-commands)**; the minimal skeleton:

```bash
ORG=<org>; CUTOFF=2022-09-01; OUT=docs/retrospective
mkdir -p "$OUT/repos" "$OUT/data/prs"

# 1. inventory every repo
gh repo list "$ORG" --limit 1000 \
  --json name,description,isArchived,isFork,pushedAt,createdAt,primaryLanguage \
  > "$OUT/data/repos.json"

# 2. eyeball active repos (last push >= cutoff), pick the ones to pull
jq -r --arg c "$CUTOFF" 'sort_by(.pushedAt)|reverse|.[]
  | select(.pushedAt[0:10] >= $c)
  | [.pushedAt[0:10], (if .isArchived then "ARCH" else "live" end),
     (if .isFork then "fork" else "----" end), (.primaryLanguage.name // "-"), .name]
  | @tsv' "$OUT/data/repos.json" | column -t -s$'\t'

# 3+4. pull PRs per repo + size it (list the repos you chose in step 2)
for r in <repo1> <repo2> ...; do
  gh pr list -R "$ORG/$r" --state all --limit 1000 --search "created:>=$CUTOFF" \
    --json number,title,state,createdAt,mergedAt,closedAt,author,labels,additions,deletions,changedFiles \
    > "$OUT/data/prs/$r.json"
  echo -e "$(jq 'length' "$OUT/data/prs/$r.json")\t$r"
done | sort -rn

# org-wide PR volume by half-year (reveals the eras)
cat "$OUT"/data/prs/*.json | jq -r '.[] | .createdAt[0:4] + "-H" +
  (if (.createdAt[5:7]|tonumber)<=6 then "1" else "2" end)' | sort | uniq -c
```

Then continue with the Phase-1 / Phase-2 commands in §4.
