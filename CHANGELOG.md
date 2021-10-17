# [5.6.0](https://github.com/biosimulations/biosimulations/compare/v5.5.0...v5.6.0) (2021-10-17)


### Bug Fixes

* **api:** update api to use updated hsds client ([e7832aa](https://github.com/biosimulations/biosimulations/commit/e7832aaf2c6d34c78903227dfc7e7db254b5b73d))
* **dispatch:** add flag to skip downloading test results to simulators service ([cbd63cc](https://github.com/biosimulations/biosimulations/commit/cbd63ccc6ecf757dec0da6cf000c200f2e8ebc4c)), closes [#3197](https://github.com/biosimulations/biosimulations/issues/3197)
* **dispatch:** fix alg list to empty list to prevent crashing ([338be99](https://github.com/biosimulations/biosimulations/commit/338be997320e053b054137a44546a82a21c13e34))
* make changes to update mongoose ([4653155](https://github.com/biosimulations/biosimulations/commit/46531556323e5d84cc96afbd87f4a58aa335be23))
* **platform,dispatch:** corrected link to simulation results in files tab ([00aa363](https://github.com/biosimulations/biosimulations/commit/00aa363a059fc9b0f0f95d316c1313efadb890b7))
* **platform:** redirect to 404 for non-existent projects; closes [#3234](https://github.com/biosimulations/biosimulations/issues/3234) ([173439a](https://github.com/biosimulations/biosimulations/commit/173439a2c322d933dc2ad4f5f1b3bcbeee666e80))
* **simulators:** fix json-ld metadata on index.html ([95b3d98](https://github.com/biosimulations/biosimulations/commit/95b3d983c1be2ddf633570214f8d35a920d98f1e))


### Features

* **api:** add custom styling to swagger ui ([90830c0](https://github.com/biosimulations/biosimulations/commit/90830c02f53df0fc9f86c7211b2fa3359a1b8807))
* **hsds:** update client library ([5746832](https://github.com/biosimulations/biosimulations/commit/574683246e7abb8a338d35d2a7a98ba25ce96d41))
* **simulators:** added repository digest to image model; closes [#3194](https://github.com/biosimulations/biosimulations/issues/3194) ([1293410](https://github.com/biosimulations/biosimulations/commit/129341077889888b41397cf471389d8921c8c2f8))
* **simulators:** expanded full text search; closes [#3209](https://github.com/biosimulations/biosimulations/issues/3209) ([c877189](https://github.com/biosimulations/biosimulations/commit/c877189fc5ece4943f3577602ff770660cdf01c0))


### Reverts

* **deps:** revert update dependency eslint to v8 ([0fdb3d8](https://github.com/biosimulations/biosimulations/commit/0fdb3d81a59710e4667974ecf0e42c8ec65ffd34))
