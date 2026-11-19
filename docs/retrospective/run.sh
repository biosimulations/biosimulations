#!/usr/bin/env bash
#
# run.sh — Phase 0 bootstrap for a GitHub-org retrospective.
#
# Automates the reconnaissance + data-pull steps from METHODOLOGY.md §4 so a
# new org starts with one command:
#   - inventory all repos (data/repos.json)
#   - select repos active since CUTOFF
#   - count substantive vs total PRs per active repo
#   - pull all PR metadata (data/prs/<repo>.json)
#   - print the org-wide PR-by-half-year histogram (reveals the "eras")
#
# It does NOT write narrative — that's Phase 1/2 (per-repo entries + synthesis),
# done by hand/agent using the data this produces.
#
# Usage:
#   ./run.sh <ORG> [CUTOFF] [OUTDIR]
#
# Examples:
#   ./run.sh biosimulations 2022-09-01 docs/retrospective
#   ./run.sh my-org                       # defaults: CUTOFF=2022-09-01, OUTDIR=.
#
# Requires: gh (authenticated: `gh auth status`), jq.

set -euo pipefail

ORG="${1:-}"
CUTOFF="${2:-2022-09-01}"
OUTDIR="${3:-.}"

if [[ -z "$ORG" ]]; then
  echo "usage: $0 <ORG> [CUTOFF=YYYY-MM-DD] [OUTDIR]" >&2
  exit 2
fi

for tool in gh jq; do
  command -v "$tool" >/dev/null 2>&1 || { echo "error: '$tool' not found in PATH" >&2; exit 1; }
done
gh auth status >/dev/null 2>&1 || { echo "error: gh not authenticated — run 'gh auth login'" >&2; exit 1; }

DATA="$OUTDIR/data"
PRS="$DATA/prs"
mkdir -p "$PRS" "$OUTDIR/repos"

# jq filter for "substantive" PRs: drop bot/release-automation authors and
# semantic-release `chore(release)` PRs. Reused in the Phase-1 hint at the end.
SUBST_FILTER='[.[]
  | select((.author.login // "")|test("bot|renovate|dependabot|semantic")|not)
  | select((.title // "")|test("chore\\(release\\)")|not)]'

echo "==> Org: $ORG   Cutoff: $CUTOFF   Output: $OUTDIR"
echo

# ---------------------------------------------------------------------------
# 1. Inventory every repo
# ---------------------------------------------------------------------------
echo "==> [1/4] Inventorying repos -> $DATA/repos.json"
gh repo list "$ORG" --limit 1000 \
  --json name,description,isArchived,isFork,pushedAt,createdAt,updatedAt,primaryLanguage,stargazerCount,diskUsage \
  > "$DATA/repos.json"
TOTAL_REPOS=$(jq 'length' "$DATA/repos.json")
echo "    $TOTAL_REPOS repos found."

# ---------------------------------------------------------------------------
# 2. Select repos active since CUTOFF (pushed on/after cutoff)
#    Forks are listed separately; deep-dive them only if you mean to.
# ---------------------------------------------------------------------------
echo
echo "==> [2/4] Repos active since $CUTOFF (last-push | ARCH? | fork? | lang | name):"
jq -r --arg c "$CUTOFF" 'sort_by(.pushedAt)|reverse|.[]
  | select(.pushedAt[0:10] >= $c)
  | [.pushedAt[0:10],
     (if .isArchived then "ARCH" else "live" end),
     (if .isFork then "fork" else "----" end),
     (.primaryLanguage.name // "-"), .name] | @tsv' \
  "$DATA/repos.json" | column -t -s$'\t' | sed 's/^/    /'

# Active, non-fork repo names drive the PR pull.
# (read loop instead of mapfile — macOS ships Bash 3.2, which has no mapfile.)
ACTIVE=()
while IFS= read -r name; do
  [[ -n "$name" ]] && ACTIVE+=("$name")
done < <(jq -r --arg c "$CUTOFF" \
  '.[] | select(.pushedAt[0:10] >= $c) | select(.isFork|not) | .name' "$DATA/repos.json")

FORKS=$(jq -r --arg c "$CUTOFF" \
  '[.[] | select(.pushedAt[0:10] >= $c) | select(.isFork) | .name] | join(", ")' "$DATA/repos.json")
[[ -n "$FORKS" ]] && echo && echo "    (forks active since cutoff, not pulled: $FORKS)"

# ---------------------------------------------------------------------------
# 3. Pull PR metadata + count total vs substantive per active repo
#    (no pipe here, so GRAND_TOTAL survives the loop)
# ---------------------------------------------------------------------------
echo
echo "==> [3/4] Pulling PR metadata since $CUTOFF -> $PRS/<repo>.json"
printf '    %-34s %6s %6s\n' "repo" "total" "subst"
GRAND_TOTAL=0
for r in "${ACTIVE[@]}"; do
  gh pr list -R "$ORG/$r" --state all --limit 1000 --search "created:>=$CUTOFF" \
    --json number,title,state,createdAt,mergedAt,closedAt,author,labels,additions,deletions,changedFiles \
    > "$PRS/$r.json" 2>/dev/null || echo '[]' > "$PRS/$r.json"
  total=$(jq 'length' "$PRS/$r.json")
  subst=$(jq "$SUBST_FILTER | length" "$PRS/$r.json")
  printf '    %-34s %6s %6s\n' "$r" "$total" "$subst"
  GRAND_TOTAL=$(( GRAND_TOTAL + total ))
done
echo "    --------------------------------------------------"
echo "    grand total PRs since $CUTOFF: $GRAND_TOTAL across ${#ACTIVE[@]} active non-fork repos"

# ---------------------------------------------------------------------------
# 4. Org-wide PR volume by half-year (reveals the eras)
# ---------------------------------------------------------------------------
echo
echo "==> [4/4] Org-wide PRs by half-year:"
cat "$PRS"/*.json | jq -r '.[] | .createdAt[0:4] + "-H" +
  (if (.createdAt[5:7]|tonumber) <= 6 then "1" else "2" end)' \
  | sort | uniq -c | sed 's/^/    /'

cat <<EOF

==> Phase 0 complete. Next (see METHODOLOGY.md §4):
    Phase 1 — per repo: list substantive PRs, read pivotal bodies, write repos/<repo>.md
      jq -r '$SUBST_FILTER | sort_by(.createdAt) | .[]
              | "\\(.createdAt[0:10]) | #\\(.number) | \\(.author.login) | \\(.changedFiles)f | \\(.title)"' \\
        "$PRS/<repo>.json"
      gh pr view <N> -R $ORG/<repo> --json title,body | jq -r '.title+"\\n"+(.body//"")'
    Phase 2 — synthesis: catalog.md, 01-timeline.md, 00-executive-summary.md
EOF
