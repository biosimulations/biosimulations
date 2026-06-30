#!/usr/bin/env python3
"""Archive a single GitHub release tag as a new version of the BioSimulations
Zenodo concept record, preserving the DOI lineage and author metadata.

Idempotent: if the tag is already archived in the concept, it does nothing.
Metadata (authors, title, description, keywords, license) is inherited from the
previous version, so the author list stays consistent automatically; only the
version, publication date, and lineage identifiers are set per release.

Environment:
  ZENODO_TOKEN     Zenodo personal access token (scopes: deposit:write,
                   deposit:actions) from the account that owns the concept
                   record. If empty/unset, the script no-ops (exit 0) so the
                   release workflow doesn't fail before the secret is configured.
  TAG              release tag to archive, e.g. v9.66.0
  PUBDATE          publication date, YYYY-MM-DD
  CONCEPT_RECID    Zenodo concept record id (default 21053715)
  REPO             owner/repo (default biosimulations/biosimulations)
"""
import json
import os
import sys
import urllib.error
import urllib.request

API = 'https://zenodo.org/api'
TOK = os.environ.get('ZENODO_TOKEN', '').strip()
TAG = os.environ['TAG']
PUBDATE = os.environ['PUBDATE']
CONCEPT = os.environ.get('CONCEPT_RECID', '21053715')
REPO = os.environ.get('REPO', 'biosimulations/biosimulations')
OLD_CONCEPT_DOI = '10.5281/zenodo.5057108'  # pre-fork lineage, linked for provenance


def call(method, url, data=None, raw=False):
    headers = {'Authorization': f'Bearer {TOK}'}
    body = None
    if raw:
        body = data
        headers['Content-Type'] = 'application/octet-stream'
    elif data is not None:
        body = json.dumps(data).encode()
        headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=body, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req) as r:
            c = r.read()
            return r.status, (json.loads(c) if c else None)
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode(errors='replace')


def main():
    if not TOK:
        print('::warning::ZENODO_TOKEN is not set; skipping Zenodo archiving. '
              'Add the secret to enable automatic archiving.')
        return

    # Existing published versions in the concept (idempotency + latest pointer).
    st, deps = call('GET', f'{API}/deposit/depositions'
                           f'?q=conceptrecid:{CONCEPT}&all_versions=true&size=100')
    if st != 200 or not isinstance(deps, list):
        sys.exit(f'failed to list concept versions: {st} {deps}')
    published = [d for d in deps if d.get('submitted')]
    by_version = {d['metadata'].get('version'): d for d in published}
    if TAG in by_version:
        print(f'{TAG} already archived (record {by_version[TAG]["id"]}); nothing to do.')
        return
    if not published:
        sys.exit('no published version found in concept; cannot create a new version')

    latest = max(published, key=lambda d: d.get('created', ''))
    latest_id = latest['id']
    print(f'latest published version: {latest["metadata"].get("version")} (id {latest_id})')

    # Download the release source tarball (same form as the existing versions).
    tar = f'/tmp/biosimulations-{TAG}.tar.gz'
    url = f'https://github.com/{REPO}/archive/refs/tags/{TAG}.tar.gz'
    print(f'downloading {url}')
    urllib.request.urlretrieve(url, tar)
    if os.path.getsize(tar) < 1000:
        sys.exit(f'tarball for {TAG} is suspiciously small')

    # Create a new version branched off the latest, swap in the new file.
    st, r = call('POST', f'{API}/deposit/depositions/{latest_id}/actions/newversion')
    if st not in (200, 201):
        sys.exit(f'newversion failed {st}: {r}')
    st, draft = call('GET', r['links']['latest_draft'])
    if st != 200:
        sys.exit(f'get draft failed {st}: {draft}')
    nid = draft['id']
    bucket = draft['links']['bucket']
    for f in draft.get('files', []):
        call('DELETE', f"{API}/deposit/depositions/{nid}/files/{f['id']}")
    with open(tar, 'rb') as fh:
        st, _ = call('PUT', f'{bucket}/biosimulations-{TAG}.tar.gz', data=fh.read(), raw=True)
    if st not in (200, 201):
        sys.exit(f'upload failed {st}')

    # Inherit metadata (authors etc.); set only version/date/lineage.
    md = dict(draft['metadata'])
    md['version'] = TAG
    md['publication_date'] = PUBDATE
    md['related_identifiers'] = [
        # This lineage continues the pre-fork archive (frozen at v9.57.0). Kept on
        # every version so it stays visible on the concept DOI page, which always
        # shows the latest version's metadata.
        {'relation': 'continues', 'identifier': OLD_CONCEPT_DOI, 'scheme': 'doi'},
        {'relation': 'isSupplementTo',
         'identifier': f'https://github.com/{REPO}/tree/{TAG}', 'scheme': 'url'},
    ]
    md.pop('doi', None)
    md.pop('prereserve_doi', None)
    st, r = call('PUT', f'{API}/deposit/depositions/{nid}', data={'metadata': md})
    if st != 200:
        sys.exit(f'metadata update failed {st}: {r}')

    st, r = call('POST', f'{API}/deposit/depositions/{nid}/actions/publish')
    if st != 202:
        sys.exit(f'publish failed {st}: {r}')
    print(f'archived {TAG} -> {r.get("doi")}')


if __name__ == '__main__':
    main()
