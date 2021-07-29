# [3.4.0](https://github.com/biosimulations/Biosimulations/compare/v3.3.0...v3.4.0) (2021-07-29)


### Bug Fixes

* **dispatch:** corrected processing of metadata while status is pinging ([e29fb0e](https://github.com/biosimulations/Biosimulations/commit/e29fb0e54343da3c43db5f949dc48e83842845ca))


### Features

* **dispatch:** added example simulation run for activity flow diagram ([f534c33](https://github.com/biosimulations/Biosimulations/commit/f534c33835274eb113c9f62209d13810cb55f778))
* **dispatch:** expanded support for connecting SED-ML to Vega ([439bbeb](https://github.com/biosimulations/Biosimulations/commit/439bbebcfcc562304018711b9e0e485cba099eb1))
* **ontology:** updated SBO for additional framework terms ([5eaa097](https://github.com/biosimulations/Biosimulations/commit/5eaa097753353e9134a81b92554f3ca7efd8335e))

# [3.3.0](https://github.com/biosimulations/Biosimulations/compare/v3.2.0...v3.3.0) (2021-07-23)


### Bug Fixes

* **dispatch:** hiding figures/tables section when there are no figures/tables ([056caf8](https://github.com/biosimulations/Biosimulations/commit/056caf8d6f7ec6c7b0f6ad2116588e8f6dea751d))


### Features

* **dispatch,simulators:** added documentation about generating data visualizations ([0066522](https://github.com/biosimulations/Biosimulations/commit/00665225875e75a62a93dd93fd545f8e823f9ecc))
* making creation data metadata optional ([7812d65](https://github.com/biosimulations/Biosimulations/commit/7812d654f1ddfed9f9c2ea00b63ae31c3a537942))

# [3.2.0](https://github.com/biosimulations/Biosimulations/compare/v3.1.0...v3.2.0) (2021-07-22)


### Bug Fixes

* **dispatch-api:** change path from 'run' to 'runs' ([ead8d80](https://github.com/biosimulations/Biosimulations/commit/ead8d807ffe48a2cb50e54d88a65e880d00b6a70))


### Features

* **dispatch:** improved Vega error handling ([56a1e0c](https://github.com/biosimulations/Biosimulations/commit/56a1e0ce1f7147130bd18651dcac9d0b6953bb09))
* **dispatch:** updated example runs for new vis and metadata ([1683451](https://github.com/biosimulations/Biosimulations/commit/168345199fb240e098f168211609973076251a0b))
* **platform,platform-api:** platform gets projects from api ([f0b010d](https://github.com/biosimulations/Biosimulations/commit/f0b010d68b592765acb172c27a1b527ca4d9d157))
* **simulators:** added documentation about recommendation to use Identifiers.org URIs ([5445b08](https://github.com/biosimulations/Biosimulations/commit/5445b08a46678b4f73ea25fec53b38c9fdc6de4d))

# [3.1.0](https://github.com/biosimulations/Biosimulations/compare/v3.0.2...v3.1.0) (2021-07-19)


### Bug Fixes

* **deps:** pin dependencies ([5c762b6](https://github.com/biosimulations/Biosimulations/commit/5c762b64117e22863f8edf96c0d358256536b765))
* **deps:** update nest monorepo ([790aa52](https://github.com/biosimulations/Biosimulations/commit/790aa52b225b7d1eca6312da65fa0ff6b3d6fb9c))
* **dispatch:** fixed handling of query arguments to run simulation route ([546c49b](https://github.com/biosimulations/Biosimulations/commit/546c49bc344dfade3fd677998a665066e35ea2ce))
* **simulators:** reenabling display of simulator validation test results ([902bc93](https://github.com/biosimulations/Biosimulations/commit/902bc9374875572f4072ffde72d369a60f6f31c1)), closes [#2696](https://github.com/biosimulations/Biosimulations/issues/2696)


### Features

* **dispatch:** added 1D histogram plot ([379e0a7](https://github.com/biosimulations/Biosimulations/commit/379e0a7d74ad74b1cdc35e7babba9be7b1155c01))
* **dispatch:** added 2D heatmap data visualization ([147b6ad](https://github.com/biosimulations/Biosimulations/commit/147b6ad4ae52e77b4c02eac6cfc5b17dacf8a5c1))
* **dispatch:** added ability to add files to COMBINE archives ([c05631e](https://github.com/biosimulations/Biosimulations/commit/c05631e52fbcba6c72ccb24380b2d66167790218))
* **dispatch:** added exporting user-configured histogram viz to Vega ([6342e44](https://github.com/biosimulations/Biosimulations/commit/6342e448059fcc100d37b7246206cfb01b1bd8e8))
* **dispatch:** added Vega export for 2D heatmap, improved visualization form validation ([784917f](https://github.com/biosimulations/Biosimulations/commit/784917f3172e2416fe3e959218ec27e452fe4a79))
* **dispatch:** added Vega export for 2d line/scatter plot ([8f2cff0](https://github.com/biosimulations/Biosimulations/commit/8f2cff046bc3db7fdab6a8690a780da1d3ae7867))
* **dispatch:** improved plotting ([852545b](https://github.com/biosimulations/Biosimulations/commit/852545b75fb4dd1bca2b0594ca519f1cab9a111d))
* **dispatch:** linked Vega signals to attributes of SED-ML simulations ([88a68c3](https://github.com/biosimulations/Biosimulations/commit/88a68c332c9f630bc9c5cffa02b9c9e2e3f0058a))
* **dispatch:** linking published figures/tables to displayed visualizations ([44c810a](https://github.com/biosimulations/Biosimulations/commit/44c810acdc8ed31173387bd5521dbc03c093008a))
* **platform:** implement viewing a project ([0ad9af3](https://github.com/biosimulations/Biosimulations/commit/0ad9af33635272cfc29e4cd9b3d2d71cdb03dbe4))
* **platform-api:** add skeleton implementation ([0758052](https://github.com/biosimulations/Biosimulations/commit/0758052e88b185d72e3cedc46256377a8e3d9753))

## [3.0.2](https://github.com/biosimulations/Biosimulations/compare/v3.0.1...v3.0.2) (2021-07-13)


### Bug Fixes

* **mail-service,dispatch-service:** fix nats-server connection ([9143d0c](https://github.com/biosimulations/Biosimulations/commit/9143d0cabba6a22d44398cd4eec1cb1a5033e2f9))

## [3.0.1](https://github.com/biosimulations/Biosimulations/compare/v3.0.0...v3.0.1) (2021-07-13)


### Bug Fixes

* try new server options ([1851742](https://github.com/biosimulations/Biosimulations/commit/1851742fdb222a6330a6b2f52b814ee7d3273c5a))

# [3.0.0](https://github.com/biosimulations/Biosimulations/compare/v2.5.2...v3.0.0) (2021-07-13)


### Bug Fixes

* **mail-service,dispatch-service:** fix import of http module ([805e48f](https://github.com/biosimulations/Biosimulations/commit/805e48f34dec1b50308c20affa786fac1ae646f5))


### Features

* **simulators-api:** add a query argument to include the results of the validation ([710be08](https://github.com/biosimulations/Biosimulations/commit/710be085ec732d851aa89e78773c4ba12e7e682e)), closes [#2668](https://github.com/biosimulations/Biosimulations/issues/2668)


### BREAKING CHANGES

* **simulators-api:** validation data is no longer returned by default. A Query argument is needed to include the validation information

## [2.5.2](https://github.com/biosimulations/Biosimulations/compare/v2.5.1...v2.5.2) (2021-07-13)


### Bug Fixes

* type and build fixes ([6812bd0](https://github.com/biosimulations/Biosimulations/commit/6812bd0de12c3716ac8928154ed73aa92953dc40))
* **dispatch-api:** fix error with parsing outputIds ([9fac99f](https://github.com/biosimulations/Biosimulations/commit/9fac99f68094919de23d632795bf131b9fb8a1ef)), closes [#2683](https://github.com/biosimulations/Biosimulations/issues/2683)

## [2.5.1](https://github.com/biosimulations/Biosimulations/compare/v2.5.0...v2.5.1) (2021-07-09)


### Bug Fixes

* **simulators-api:** Allow for date based versions ([0c8fb8d](https://github.com/biosimulations/Biosimulations/commit/0c8fb8d00a36675f652a665d9c279709e798c212)), closes [#2681](https://github.com/biosimulations/Biosimulations/issues/2681)

# [2.5.0](https://github.com/biosimulations/Biosimulations/compare/v2.4.0...v2.5.0) (2021-07-09)


### Bug Fixes

* **dispatch:** downloading created COMBINE/OMEX archives ([03895bf](https://github.com/biosimulations/Biosimulations/commit/03895bf82abfa0b6d9c7c7db186a31d29e726b49))
* correcting size of form fields ([ae69630](https://github.com/biosimulations/Biosimulations/commit/ae69630cf3e45abfbcaaec17787956e7189e5e53))
* **shared-exceptions:** include error metadata in the "meta" output ([2be0178](https://github.com/biosimulations/Biosimulations/commit/2be0178af9003156ad25fa22e8c7fe51457c9556))


### Features

* **combine-service:** adding support for creating steady-state analyses of logical models ([a9e6667](https://github.com/biosimulations/Biosimulations/commit/a9e6667034c2b35d4379dff72a2d7cefe4d4f4d8))
* **combine-service:** updating to biosimulators-utils 0.1.93 ([ca0a21e](https://github.com/biosimulations/Biosimulations/commit/ca0a21e33d7c2a54f8bd6d9aa9d8c6943da955b2))
* **shared-exceptions:** add validation pipe error factory ([35edb4d](https://github.com/biosimulations/Biosimulations/commit/35edb4d4f73d82e4bbb17bbd701d13fc580093af))

# [2.4.0](https://github.com/biosimulations/Biosimulations/compare/v2.3.0...v2.4.0) (2021-07-08)


### Bug Fixes

* **combine-service:** add protocol to server in API spec ([bcf4119](https://github.com/biosimulations/Biosimulations/commit/bcf41192f15894f7993239f16b14f415c1a85910))
* **combine-service:** debugged specifications ([f8b9420](https://github.com/biosimulations/Biosimulations/commit/f8b9420fadbcf10c367f26c6b77bf736dc5463f3))
* **combine-service:** fix api spec ([ebab457](https://github.com/biosimulations/Biosimulations/commit/ebab457a262b594744e81cfdfe4bfdd9af45a4c2))
* **platform:** enable strict template checking, fix type errors ([9facdb1](https://github.com/biosimulations/Biosimulations/commit/9facdb19c1cacae3d22d4bd952c0f1f0cbaf8035)), closes [#2185](https://github.com/biosimulations/Biosimulations/issues/2185)


### Features

* **combine-service:** add combine-service api client library ([bfa25b8](https://github.com/biosimulations/Biosimulations/commit/bfa25b8f0319de62d3c6a5902597d51c68b8eb96))
* **dispatch:** added example simulation run for GINsim ([3e639b3](https://github.com/biosimulations/Biosimulations/commit/3e639b30c49e3149d966518d5a82908a3905e831))
* **dispatch:** added example simulation runs for GINsim, LibSBMLSim ([06ad0a4](https://github.com/biosimulations/Biosimulations/commit/06ad0a4be78dc595305492e975ba856722d27b27))
* **dispatch:** adding support for GINML, ZGINML to COMBINE archive creation and execution ([9f949e5](https://github.com/biosimulations/Biosimulations/commit/9f949e561256288f2851468a83c96160cc14f7fe))
* **dispatch,ontology:** add terms for GINsim format ([22d8a7b](https://github.com/biosimulations/Biosimulations/commit/22d8a7b2daec93c086bacc3c61a279dc85481cfd))
* **ontology:** updating to KiSAO 2.19 with terms for logical modeling ([c47e63b](https://github.com/biosimulations/Biosimulations/commit/c47e63b7767eecde90c033d8c11ef55b89678d4a))
* **ontology,combine-service:** update to KiSAO 2.20 ([fadf3da](https://github.com/biosimulations/Biosimulations/commit/fadf3da7c0e714267a89ac903acf516be5f00533))

# [2.3.0](https://github.com/biosimulations/Biosimulations/compare/v2.2.1...v2.3.0) (2021-07-02)

### Features

- **dispatch:** Added tab to simulation run page to display metadata about the simulation project ([#2667](https://github.com/biosimulations/Biosimulations/issues/2667)) ([dde87fa](https://github.com/biosimulations/Biosimulations/commit/dde87faae5e558c3bbe86f6f17467ae747da55d8)), closes [#2661](https://github.com/biosimulations/Biosimulations/issues/2661)

## [2.2.1](https://github.com/biosimulations/Biosimulations/compare/v2.2.0...v2.2.1) (2021-07-01)

### Bug Fixes

- **dispatch:** fix example simulation runs ([60d91c1](https://github.com/biosimulations/Biosimulations/commit/60d91c1bb70e6ae08274a9380143baa19fa51043)), closes [#2653](https://github.com/biosimulations/Biosimulations/issues/2653)
- **simulators-api:** fix getting latest version ([4594c96](https://github.com/biosimulations/Biosimulations/commit/4594c96b53859e03960458cd001cf8614d64f64c)), closes [#2664](https://github.com/biosimulations/Biosimulations/issues/2664)

# [2.2.0](https://github.com/biosimulations/Biosimulations/compare/v2.1.0...v2.2.0) (2021-06-30)

### Bug Fixes

- **dispatch:** correct integration between simulation results and SED plots ([0bab60f](https://github.com/biosimulations/Biosimulations/commit/0bab60fe06cc52d55a670d8957e385dc7f247854))
- **dispatch:** download file instead of redirect ([cd2840d](https://github.com/biosimulations/Biosimulations/commit/cd2840d98d84f13eab34cea479a09da23187fe14)), closes [#2435](https://github.com/biosimulations/Biosimulations/issues/2435)
- **dispatch:** use correct api to get simulator info ([1e66f1f](https://github.com/biosimulations/Biosimulations/commit/1e66f1f85f4436987ca034c3cdafad9536c12b9e))

### Features

- add some shared endpoints ([567e4c2](https://github.com/biosimulations/Biosimulations/commit/567e4c27de05655d3b78b441e84231977afd234b))
- **auth-client:** Cache tokens locally ([f53c9f8](https://github.com/biosimulations/Biosimulations/commit/f53c9f8d4c9c3e2bed497ec85c4c53d774af9fb1)), closes [#2503](https://github.com/biosimulations/Biosimulations/issues/2503)
- **auth-common:** add util functions ([e0ac842](https://github.com/biosimulations/Biosimulations/commit/e0ac842518af8e6909493cb1b2b774a56faf6b17))

### Performance Improvements

- **dispatch-service:** use /local as the singularity cache/working directory ([c63b58c](https://github.com/biosimulations/Biosimulations/commit/c63b58c35a0c3da71910523a3baf0f445f5e493a))

# [2.1.0](https://github.com/biosimulations/Biosimulations/compare/v2.0.0...v2.1.0) (2021-06-18)

### Bug Fixes

- **dispatch-service:** remove check for process flag ([f7f88cc](https://github.com/biosimulations/Biosimulations/commit/f7f88cce2fbc54df13e34ef5212f1491036ec8b5)), closes [#2577](https://github.com/biosimulations/Biosimulations/issues/2577)

### Features

- **dispatch-api, dispatch-service:** add status reason to datamodel ([ca9bcb6](https://github.com/biosimulations/Biosimulations/commit/ca9bcb6c7d7ffcb0328ef679d5a82801995add45)), closes [#2441](https://github.com/biosimulations/Biosimulations/issues/2441)

# [2.0.0](https://github.com/biosimulations/Biosimulations/compare/v1.0.0...v2.0.0) (2021-06-17)

### Bug Fixes

- **dispatch-api:** bind class to this variable in map ([b4bb3ca](https://github.com/biosimulations/Biosimulations/commit/b4bb3ca27cd52d27abe68dcaa524a158a1a73507))
- dispatch frontend uses the updated api parameter ([#2636](https://github.com/biosimulations/Biosimulations/issues/2636)) ([a13779c](https://github.com/biosimulations/Biosimulations/commit/a13779cdc320d58c595f85399ca4d7747d603657)), closes [#2635](https://github.com/biosimulations/Biosimulations/issues/2635)

### Features

- **dispatch-api, dispatch-service:** Use HSDS to get simulation run data ([33b8030](https://github.com/biosimulations/Biosimulations/commit/33b8030e60fcbd2eb693e2a962620cf42855b4e4)), closes [#2533](https://github.com/biosimulations/Biosimulations/issues/2533) [#2442](https://github.com/biosimulations/Biosimulations/issues/2442) [#2440](https://github.com/biosimulations/Biosimulations/issues/2440) [#2369](https://github.com/biosimulations/Biosimulations/issues/2369) [#2069](https://github.com/biosimulations/Biosimulations/issues/2069)

### BREAKING CHANGES

- **dispatch-api, dispatch-service:** Dispatch API no longer has endpoints for creating or updating "Result" objects.
  The output of the results endpoints are updated to include information about type and shape of the data.
  The parameter "sparse" has been changed to "includeData".
  The datamodel for results has been adjusted to include all outputs, not just reports. "reports" has been renamed to "outputs"

# 1.0.0 (2021-06-16)

This is an arbitrary starting point for tracking changes and versioning. It should not be considered as the "first release".

### Bug Fixes

- bash script ([866b58a](https://github.com/biosimulations/Biosimulations/commit/866b58a244d3483fa6afa2ae0e8383e234920ba6))
- add check for large files downloading ([ca10aa5](https://github.com/biosimulations/Biosimulations/commit/ca10aa5f2c44fafcff8471c0da0bbd9db2a655ed)), closes [#2536](https://github.com/biosimulations/Biosimulations/issues/2536)
- bring inline with datamodel ([af53a54](https://github.com/biosimulations/Biosimulations/commit/af53a54a5e5bc91835e114e67e10fc69883c7f9b))
- change url to download results ([3d264d4](https://github.com/biosimulations/Biosimulations/commit/3d264d4abfdb85aa4cae99e1477cbf4666b8ba36)), closes [#2561](https://github.com/biosimulations/Biosimulations/issues/2561)
- check job status after completion ([c16649c](https://github.com/biosimulations/Biosimulations/commit/c16649c507c35f1e086d41fb496a573549f925ba))
- cleanup logs ([fbd330f](https://github.com/biosimulations/Biosimulations/commit/fbd330f2762f6192b7e269ffcd2e8ede93c5ad14))
- correct value for constant ([e2d3a68](https://github.com/biosimulations/Biosimulations/commit/e2d3a68a39f5e6ad3216daf109087a2b1c43f26b))
- fix error in reading port ([e1f6fb9](https://github.com/biosimulations/Biosimulations/commit/e1f6fb923a42283d1b42765b4d0376a146f406ef))
- fix logs and context buttons ([777e8e8](https://github.com/biosimulations/Biosimulations/commit/777e8e8f79f829b3762c7aa189a9d6184f4b24a1)), closes [#2543](https://github.com/biosimulations/Biosimulations/issues/2543) [#2540](https://github.com/biosimulations/Biosimulations/issues/2540)
- fix redis queue and port ([5f33a19](https://github.com/biosimulations/Biosimulations/commit/5f33a192203323e30d6badd4b6500cc056b3ef34))
- fix s3 key for downloading outputs ([f585a9a](https://github.com/biosimulations/Biosimulations/commit/f585a9a6295cbbf60e73c05d5ae908713d1ef5ee)), closes [#2622](https://github.com/biosimulations/Biosimulations/issues/2622)
- fix spelling of library ([a471e95](https://github.com/biosimulations/Biosimulations/commit/a471e95e6684ee093d036f343efbba50df327563))
- fix test ([6f236df](https://github.com/biosimulations/Biosimulations/commit/6f236df6b5186e44ccf9c459faa83698cf22d7ae))
- fix test ([6af0ca8](https://github.com/biosimulations/Biosimulations/commit/6af0ca8a0b9f2d557a0fd416475151261a46fb88))
- lint fix ([a26c24b](https://github.com/biosimulations/Biosimulations/commit/a26c24b17e9d1f72bdb53860b7f27b300030ec68))
- order of operations for creating results ([eac31e0](https://github.com/biosimulations/Biosimulations/commit/eac31e01bde327b1d3ff89f6a7cf7480e5d0c96d))
- propely set name and filetype of outputs ([951c239](https://github.com/biosimulations/Biosimulations/commit/951c239983ea93009565287a8ac9bfd3deae8052))
- Remove bad library import ([ecc86fa](https://github.com/biosimulations/Biosimulations/commit/ecc86fa6d9abf59b466ea02d25d62c1119d07de8)), closes [#2420](https://github.com/biosimulations/Biosimulations/issues/2420)
- remove xdg runtime directory ([f5ec15b](https://github.com/biosimulations/Biosimulations/commit/f5ec15bd726ab4afa01b0c2be4688217d4d89198))
- resolve build errors ([6691ebe](https://github.com/biosimulations/Biosimulations/commit/6691ebedbda107862cbf731cb891044c426e5fc9))
- typo in return statement ([1f6c4fc](https://github.com/biosimulations/Biosimulations/commit/1f6c4fc0bda0780170530789e27e4fab4233d2e3))
- update default stoage URL ([f9b0d75](https://github.com/biosimulations/Biosimulations/commit/f9b0d75b3c4370653d1c0596157cc381fa6573f0))
- update logs ([818a0c3](https://github.com/biosimulations/Biosimulations/commit/818a0c347529c42d697ac972c15e17c09b5e0372))
- update sbatch memoy amount ([b9026f9](https://github.com/biosimulations/Biosimulations/commit/b9026f96ff2e5b4876559b1b116c1d5cdebbfb8d))
- update sbatch script to use custom module ([0ef1c52](https://github.com/biosimulations/Biosimulations/commit/0ef1c52de4d6703032decaff9b2c8941175c70fb))
- use job status to determine completion ([adb12a0](https://github.com/biosimulations/Biosimulations/commit/adb12a0efbe07e82346ddada18ad93342d1cede5))
- **apps/frontend:** relative import ([3854f27](https://github.com/biosimulations/Biosimulations/commit/3854f272fdd21847e522cb03f25353b06a3c3028))
- **auth:** check for logged in before intercepting ([7c22a19](https://github.com/biosimulations/Biosimulations/commit/7c22a19a2a33cff63067d30dd19ff8bfe091a189))
- **auth:** Check for username correctly ([05996b3](https://github.com/biosimulations/Biosimulations/commit/05996b376ed7b08a4de974cf39029cb9956c1070))
- **disatch:** Fix open api schema ([ff15503](https://github.com/biosimulations/Biosimulations/commit/ff15503862e62412418f3144353e76a8cd877f7b))
- **dispatch:** Fix observable piping ([34e7086](https://github.com/biosimulations/Biosimulations/commit/34e7086261b20ffdf42b6edcf3112f972432ea79))
- **dispatch:** parsing results accounts for quotes ([d055a7b](https://github.com/biosimulations/Biosimulations/commit/d055a7ba328e1e4d4d5f8094a661377a8e5294f9)), closes [#2459](https://github.com/biosimulations/Biosimulations/issues/2459)
- **dispatch:** patch error handling ([d2d98e5](https://github.com/biosimulations/Biosimulations/commit/d2d98e57bd1632d8f289e2d9fd017443a653c8db))
- **dispatch:** remove bad environment variables ([3c31b7d](https://github.com/biosimulations/Biosimulations/commit/3c31b7de39d05b5bfaf640a1553a204267247eab)), closes [#2476](https://github.com/biosimulations/Biosimulations/issues/2476)
- **dispatch:** Simulation results not saved for some simulations and overall status doesn't reflect such errors ([#2428](https://github.com/biosimulations/Biosimulations/issues/2428)) ([acd2dff](https://github.com/biosimulations/Biosimulations/commit/acd2dff837834e6732f4b5074c433f90a9523d06)), closes [#2416](https://github.com/biosimulations/Biosimulations/issues/2416)
- use https for auth0 image ([19a4dcc](https://github.com/biosimulations/Biosimulations/commit/19a4dcc53d6572be6b60a9bb8a4d9db4bd89afc6))
- **forms:** connect taxon form properly ([a4088f7](https://github.com/biosimulations/Biosimulations/commit/a4088f79bf3a6c06cfc0dfbb48936d820428c378))
- **forms:** fix reference form implementation ([5b3eba4](https://github.com/biosimulations/Biosimulations/commit/5b3eba498a464fe77f7bbad3ae3365db8bb3e6bc))
- **forms:** fix some taxon form details ([8802ced](https://github.com/biosimulations/Biosimulations/commit/8802cedb84fc7c1afdc2b5cea244bc11c5a67399))
- **forms:** fix tags form ([b60b99c](https://github.com/biosimulations/Biosimulations/commit/b60b99cc6c8526a7403c585f8f79315c757972a5))
- **forms:** fix validation error with taxon form ([6cb2d43](https://github.com/biosimulations/Biosimulations/commit/6cb2d43e7edda5edff8310cc5bcffc5a95cedec8))
- **forms:** Form does not scroll over topbar ([70f3275](https://github.com/biosimulations/Biosimulations/commit/70f327598c2cacd278625dd78c16e93761974d54))
- **forms:** set file form disable properly ([c523d0e](https://github.com/biosimulations/Biosimulations/commit/c523d0e8230c14c3c64a0266107b7777851ae114))
- **gaurds:** Gaurd loads underconstruction pages by default ([9f7a810](https://github.com/biosimulations/Biosimulations/commit/9f7a810bd6aa000039fb7dd3e3e5b421f63118e3))
- **grid:** grid work with async resources ([d621cd3](https://github.com/biosimulations/Biosimulations/commit/d621cd3d11402aca909a005e376d214160f117b2))
- **interceptor:** API token, error handling ([78be137](https://github.com/biosimulations/Biosimulations/commit/78be1377afbf3877885744074fe8dccd0ffe1ca6))
- **interceptor:** Fixed a bug in the error handling of the interceptor ([1397c96](https://github.com/biosimulations/Biosimulations/commit/1397c966e4a83fd1e0b660daeef092617cecc106))
- **models:** Edit component calls subscribe ([50f15ac](https://github.com/biosimulations/Biosimulations/commit/50f15accb120fcdb136262541e386bacee630cb3))
- **navigation:** get username via async ([7415eba](https://github.com/biosimulations/Biosimulations/commit/7415ebae27841b6147931820869b8ef06a55cc89))
- **navigation:** have navigation work with async ([0da33ea](https://github.com/biosimulations/Biosimulations/commit/0da33eaf426d907115ba07636674261611e73a7c))
- **polyfill:** add back polyfill ([30e9c1d](https://github.com/biosimulations/Biosimulations/commit/30e9c1de6204f3bba371be0ad53c89b8a8939f1f))
- **resource service:** add query params to read ([d1d7d38](https://github.com/biosimulations/Biosimulations/commit/d1d7d38610582ed45769b5f3d404f9222cbd08cc))
- **resources:** Move more functionality into abstract class ([5e94323](https://github.com/biosimulations/Biosimulations/commit/5e94323cdf7405de6d80b69bb18a7217d02e9922))
- **serializer:** fix private public being flipped ([035241f](https://github.com/biosimulations/Biosimulations/commit/035241f949d25c38bf9767a85ee805df958d0395))
- **serializers:** improve serializers ([0d3f004](https://github.com/biosimulations/Biosimulations/commit/0d3f004175ece11a48c668959d9b5b3e217994ae))
- **serializers:** user serializer returns none for '' ([221ce41](https://github.com/biosimulations/Biosimulations/commit/221ce413570b04671da1e77581d441a423eb4647))
- **services:** Dont cast http reponse to resource ([b20e69d](https://github.com/biosimulations/Biosimulations/commit/b20e69d45dcdcaf69dedc41cc157dc9cfee14005))
- **simulations:** fix async view ([d2cad0f](https://github.com/biosimulations/Biosimulations/commit/d2cad0fd3230714bae9be8858389456bcb6ac9ca))
- **tests:** fix common test issues ([61c7621](https://github.com/biosimulations/Biosimulations/commit/61c76219e91b7b43675014ea7293dd20e3dc1cf2))
- **tests:** fix common test issues ([0c4e5f3](https://github.com/biosimulations/Biosimulations/commit/0c4e5f3f9fa58cc600a45b401a5a4ab3ee23c315))
- **user:** profile edit component properly creates user ([0bed682](https://github.com/biosimulations/Biosimulations/commit/0bed68288d6fcb1c885138ec83e0c7309f3415d3))
- **visualizations:** fix licence view ([f5d9973](https://github.com/biosimulations/Biosimulations/commit/f5d997394786baf2fac0fe4a0b6ea11c402b9881))

### Features

- add client library ([820647b](https://github.com/biosimulations/Biosimulations/commit/820647b4c13ddae30174232c1da0cd5f88990dc6))
- add config for queue ([c7ec4a1](https://github.com/biosimulations/Biosimulations/commit/c7ec4a1ed6b840e11968597f5c530bf6d0a15566))
- add hsds client module ([1730521](https://github.com/biosimulations/Biosimulations/commit/17305212950d8f27e3d577660de00828b90a5f2d))
- use org for getting latest simulator ([2f7c503](https://github.com/biosimulations/Biosimulations/commit/2f7c503b30f921f8e21919934774c13dec4113d8))
- **api:** add config to api ([931dcf5](https://github.com/biosimulations/Biosimulations/commit/931dcf518c7d57adaeb767bdc18e7fcee151be1a))
- **api:** add crud skeleton for routes ([64fce18](https://github.com/biosimulations/Biosimulations/commit/64fce18062fa43ea5c3063fe29a569d8b97f1d09))
- **api:** add open api spec generation ([659f8b4](https://github.com/biosimulations/Biosimulations/commit/659f8b4a51cfb201aea00fc7d5b2bfac6c7a9c14))
- **author form:** build out author form ([afe666a](https://github.com/biosimulations/Biosimulations/commit/afe666ae014b6463d53349913488d894f64f5aa6))
- **datamodel:** add gaurds ([2ffdf04](https://github.com/biosimulations/Biosimulations/commit/2ffdf04605f2ecb9dd41d7c7c681e5843ece23c2))
- **datamodel:** add more of the core datamodel ([9b28f83](https://github.com/biosimulations/Biosimulations/commit/9b28f834cc0a671e1628617d97acc6bae9068412))
- **datamodel:** add properties to format ([67b024c](https://github.com/biosimulations/Biosimulations/commit/67b024ccb1620937a711da7486bc328f9f698328)), closes [#462](https://github.com/biosimulations/Biosimulations/issues/462)
- **datamodel:** add url to ontology ([3c8a169](https://github.com/biosimulations/Biosimulations/commit/3c8a1699b279acd687b1fcd80a420bb509cd09fe))
- **datamodel:** redefine core objects as set of attriutes ([95ea0a7](https://github.com/biosimulations/Biosimulations/commit/95ea0a78c2c23617b8ed103de55e41fdf2059122))
- **datamodel:** redfine core resources as primary and secondary ([dd2fec4](https://github.com/biosimulations/Biosimulations/commit/dd2fec4ac6d0f8fce9bfa3d1232e95b1dd528986))
- **dispatch:** add a dispatch service ([152b3b0](https://github.com/biosimulations/Biosimulations/commit/152b3b06536428850af601187eaf7f243f45b4d6))
- **errors:** add default errors component ([a10b927](https://github.com/biosimulations/Biosimulations/commit/a10b92773d263c289e59bab261381fb49bf3f953))
- **errors:** Create 404 component ([e1c7d33](https://github.com/biosimulations/Biosimulations/commit/e1c7d334ccde6684284ba1cab0ce38b2f109c3e9))
- **errors:** Create errors module ([7e3cac4](https://github.com/biosimulations/Biosimulations/commit/7e3cac4e27b4104595f94ef269e478916336b168))
- **errors:** Create under construction component ([5d2fbe1](https://github.com/biosimulations/Biosimulations/commit/5d2fbe1405117f8acc52b7ae5cbc9c5b7d4f5974))
- **errors:** slight changes to underConstruction ([bb06012](https://github.com/biosimulations/Biosimulations/commit/bb06012172c2a86c014ad1176832fe68a3439428))
- **forms:** add a component for file inputs ([e843f87](https://github.com/biosimulations/Biosimulations/commit/e843f873114fde51c917d01f48f6ce3f3fe306ff))
- **forms:** add abstract array subform ([1d70e47](https://github.com/biosimulations/Biosimulations/commit/1d70e479618af355416e287f973b5b8bbdc3db67))
- **forms:** add authors and identifiers components ([d2e35e8](https://github.com/biosimulations/Biosimulations/commit/d2e35e8bca295aa5a536eea3fbabc02c9119c13a))
- **forms:** Add identifier form control ([dd80d37](https://github.com/biosimulations/Biosimulations/commit/dd80d37d640c5eae612d216f26e3472ab5607cd8))
- **forms:** add name form control ([8557559](https://github.com/biosimulations/Biosimulations/commit/8557559e2e2d85e0409e31aa9cb2faaff39165a3))
- **forms:** add required validator to fields ([ceaacb5](https://github.com/biosimulations/Biosimulations/commit/ceaacb53174505e27ab2e98da1d80db4d346a6bf))
- **forms:** add resource form skeleton ([e7a56d5](https://github.com/biosimulations/Biosimulations/commit/e7a56d5892c80205fba48809e1f89dc347f3abff))
- **forms:** add taxon form ([48a2e86](https://github.com/biosimulations/Biosimulations/commit/48a2e8605a3de64f75368fd8a4bd0bcd8b6d6785))
- **forms:** add to resource form implementation ([dc0b9ed](https://github.com/biosimulations/Biosimulations/commit/dc0b9ed74e1ec8435e6422d8623c0b5aa75344b4))
- **forms:** add username form ([7ba4e81](https://github.com/biosimulations/Biosimulations/commit/7ba4e814ca1b5155bd5ae067c9385dbe3e84a30c))
- **forms:** create a model form ([353d2ab](https://github.com/biosimulations/Biosimulations/commit/353d2ab55ca5c4d6d7a3539a55e09604888bc5ef))
- **forms:** Create descriptions form control ([87b0fdd](https://github.com/biosimulations/Biosimulations/commit/87b0fdd95967957dbcc2033e858df9f975d838cb))
- **forms:** Create edit-preview component ([5177f05](https://github.com/biosimulations/Biosimulations/commit/5177f05ee5d86c6f19ee735b9c181f939971150d))
- **forms:** create model format form ([af0ad55](https://github.com/biosimulations/Biosimulations/commit/af0ad55b1972146aa6313e89dd8359a7d5d6d604))
- **forms:** enable access form component ([741afa3](https://github.com/biosimulations/Biosimulations/commit/741afa323769ffc6209e1b7cd6056311e3625a65))
- **forms:** Enable Drag/Drop ([799147b](https://github.com/biosimulations/Biosimulations/commit/799147b2277a7cc06191a50eb3cd6f66cc589f13))
- **forms:** Finalize author form ([3f4f86c](https://github.com/biosimulations/Biosimulations/commit/3f4f86cfb56c7d3785362f384a1a3378310a9cfd))
- **forms:** Generalize single field controls ([0da8122](https://github.com/biosimulations/Biosimulations/commit/0da8122c33d69a36a0a8db810e60a40a9340404d))
- **forms:** implement licence form ([2d2d9b1](https://github.com/biosimulations/Biosimulations/commit/2d2d9b1340e30867321ce8fbcef86c1e7e3be8e4))
- **forms:** implement refrences form ([122fa33](https://github.com/biosimulations/Biosimulations/commit/122fa33703cbafcaef32a4665ad130ee8599cd29))
- **forms:** implement resource form ([85e89ea](https://github.com/biosimulations/Biosimulations/commit/85e89ea97e8990e23b9b9477e9017b3f289854a1))
- **forms:** implement tags form ([0b1e480](https://github.com/biosimulations/Biosimulations/commit/0b1e48018e8cc1f22620e775cbd836fb63e315bb))
- **forms:** improve disable handling ([88cace8](https://github.com/biosimulations/Biosimulations/commit/88cace866e81e97def3dbbbedeacaf4daf24f435))
- **forms:** styling ([32044ef](https://github.com/biosimulations/Biosimulations/commit/32044ef922ae05010aebe1c9e83016007e7b069d))
- **home:** Add sponsors section ([8f84a67](https://github.com/biosimulations/Biosimulations/commit/8f84a677f550655b17d425dc6c961276a9fcaca5))
- **logging:** Added logging ([18476ca](https://github.com/biosimulations/Biosimulations/commit/18476ca216a6f0ddd5274d51073e7733c2be0c15))
- **login:** add styling ([642a71c](https://github.com/biosimulations/Biosimulations/commit/642a71cb269498b8272dd0a0b0e85c2f395fa170))
- **login:** redirect works ([eb05030](https://github.com/biosimulations/Biosimulations/commit/eb05030d658ff4570eac67c4fb08a91e38d70950))
- **mateiral:** add a material topbar ([4325dcc](https://github.com/biosimulations/Biosimulations/commit/4325dcc4fcb05cfd46a900b2df88bd33ce0ec32f))
- **models:** add query-options model definition ([d628289](https://github.com/biosimulations/Biosimulations/commit/d6282893f47393846af613e1cc4173c0f3b550ef))
- **projects:** add view project ([dab3c59](https://github.com/biosimulations/Biosimulations/commit/dab3c5917c4905c617e1fed78a50854aabc80d37))
- **pwa:** Add pwa capabilities ([27b9050](https://github.com/biosimulations/Biosimulations/commit/27b90508a31e840acc16fbccae809b2b288fde3b))
- **resources:** Resources now have owner embedded ([f03c30b](https://github.com/biosimulations/Biosimulations/commit/f03c30bf7ef7ad5096b27aaf431730c0e402c6ac))
- **serializers:** serializers read files properly ([c0eb5c1](https://github.com/biosimulations/Biosimulations/commit/c0eb5c15dae85aa9e164643e04c957359afca6fa))
- **service:** Breadcrumb service generates breadcrums ([68efc1a](https://github.com/biosimulations/Biosimulations/commit/68efc1a43e0ff52250b16edc73b4351c0b6f647c))
- **services:** add config service ([98ed473](https://github.com/biosimulations/Biosimulations/commit/98ed473bfa04ba40358ef53b376932a660abc286))
- **services:** add file service ([0538686](https://github.com/biosimulations/Biosimulations/commit/053868605725bc0e5fad0944c53502737e46b950))
- **services:** add test organism to metadataservice ([91f2503](https://github.com/biosimulations/Biosimulations/commit/91f25039a9b8d39781bd7b7a2137362de18c7358))
- **services:** Resource services return new model ([0c32ba5](https://github.com/biosimulations/Biosimulations/commit/0c32ba582802824e1dd4e9f64f332e145ead1bee))
- **shared:** add an authentication library ([904cd59](https://github.com/biosimulations/Biosimulations/commit/904cd59b320a33ec8447980e79c12bbcb3121a29))
- **shared:** add fields to remote file ([b85ff9d](https://github.com/biosimulations/Biosimulations/commit/b85ff9d7061a1e62d191b017078e680d5429c7b9))
- **shared:** add more model serializing ([b06129d](https://github.com/biosimulations/Biosimulations/commit/b06129d1b0b7e2b4499c94fb34490b38a15345a3))
- **visualization:** More flexible 2D visualization to better match needs of SED-ML L1V3 and BioModels ([31c96de](https://github.com/biosimulations/Biosimulations/commit/31c96de50f6c1323b574e00f400e5e13ade93060))
- add construction gaurd in prodction mode ([84708a2](https://github.com/biosimulations/Biosimulations/commit/84708a21f656318260e6162518fef84997051916))
- create a debugger component ([fd47c37](https://github.com/biosimulations/Biosimulations/commit/fd47c374f70d4dc28646cec31f995075c778d7a3))
- **shared:** add under constrcution gaurd ([d931f6d](https://github.com/biosimulations/Biosimulations/commit/d931f6de41fc1adfa558355664b651ce4a160c6d))
- **shared:** Remote file has a method to create from File ([f3360cf](https://github.com/biosimulations/Biosimulations/commit/f3360cfb6cfbb733d46501327986e7c9aec565d2))
- **simulations:** Simulations now have embedded models ([4dd512b](https://github.com/biosimulations/Biosimulations/commit/4dd512bc1944a6a2b2e8b00a8d5f48bd61939e9f))
- **users:** Add different snackbars ([056ffe2](https://github.com/biosimulations/Biosimulations/commit/056ffe2e4f26b4f43835a9cb7978e1baa548cf01))
- **visualizations:** add view async capapbility ([d2eb414](https://github.com/biosimulations/Biosimulations/commit/d2eb414a45e9d4eee2caf0edcf87e29c1b066add))

### Reverts

- "Formatted Files. [skip ci]" ([0414aca](https://github.com/biosimulations/Biosimulations/commit/0414aca53ff1c5ee5de9920fdb3e7e5810582a1b))
- Revert "debug redis host" ([7264f87](https://github.com/biosimulations/Biosimulations/commit/7264f87a60c994a655fd80536c33eb234efb5d2b))
- Revert "Feat(Combine-serive): Update API Specification" ([7ada4ce](https://github.com/biosimulations/Biosimulations/commit/7ada4ce33538e4bcd3bae9ee798ea46e417cee99))
- Revert "Updated Ontologies" ([aab6f70](https://github.com/biosimulations/Biosimulations/commit/aab6f708ab3f2d6e39f780bcb4bff1a188376748))
- Revert "Bump @sendgrid/mail from 7.4.1 to 7.4.2 in /biosimulations (#1975)" (#1979) ([a96e0ea](https://github.com/biosimulations/Biosimulations/commit/a96e0ea8f68b97fc2722d464614ee002bcd479c5)), closes [#1975](https://github.com/biosimulations/Biosimulations/issues/1975) [#1979](https://github.com/biosimulations/Biosimulations/issues/1979)
- Revert "Bump @nrwl/cli from 10.4.1 to 11.0.20 in /biosimulations (#1855)" (#1860) ([b7d637e](https://github.com/biosimulations/Biosimulations/commit/b7d637ec1decf056c1642608d821c7b53422b46d)), closes [#1855](https://github.com/biosimulations/Biosimulations/issues/1855) [#1860](https://github.com/biosimulations/Biosimulations/issues/1860)
- Revert "merging enumerations of simulation status; aligning names of properties 'resultsSize' and 'resultSize'" ([08e96f2](https://github.com/biosimulations/Biosimulations/commit/08e96f2fe8c7e88c7fbb2a6653416182fc438700))
- Revert "Revert "styling nested lists and lists after paragraphs"" ([16a2d5b](https://github.com/biosimulations/Biosimulations/commit/16a2d5ba5e39a79c64bca5af77c1382c76dfb2c5))
- Revert "Revert "adding management for app-specific configuration (e.g,, appName, logo, etc."" ([1c6190a](https://github.com/biosimulations/Biosimulations/commit/1c6190ab50c95359233e04befc2c778fa1dbd5c1))
- Revert "Revert "adding documentation"" ([f71cfcd](https://github.com/biosimulations/Biosimulations/commit/f71cfcddcf15006f3f84660517c7fdf52ada0dbe))
- Revert "Revert "editing help"" ([4aea612](https://github.com/biosimulations/Biosimulations/commit/4aea6128b0f4fbb2d881efbcc5eb2416527f05c9))
- Revert "Revert "adding documentation of supported SED-ML features"" ([32beb34](https://github.com/biosimulations/Biosimulations/commit/32beb34d5a823e3975d6115d8f225044fe6297a5))
- Revert "changing completed to updated" ([d9fe18e](https://github.com/biosimulations/Biosimulations/commit/d9fe18edbbf4a1d0307caecdeb7a6927b0338abf))
- Revert "update to angular 10" ([e1b9fcf](https://github.com/biosimulations/Biosimulations/commit/e1b9fcfae21f5bd8b19e4cee23a8df2b82c1df02))
- Revert "Bump husky from 4.0.1 to 4.0.5 in /CRBM-Viz (#290)" ([4dd2cc3](https://github.com/biosimulations/Biosimulations/commit/4dd2cc3eee2fcf33bb24ca8ef999162823e875a7)), closes [#290](https://github.com/biosimulations/Biosimulations/issues/290)

- feat (dispatch-api): remove download endpoint ([785ad27](https://github.com/biosimulations/Biosimulations/commit/785ad27f1477ac6122c2a735cb46201928a0f754))
- feat (dispatch) : Change datamodel of returned results ([ba42dcc](https://github.com/biosimulations/Biosimulations/commit/ba42dcc8b74068a280c6dc2f7d915c8c27a55f45))

### BREAKING CHANGES

- The /download endpoint has been removed. Should be replaced by /results/download
- The results are now returned as an array of objects (AOS) rather than an object of arrays (SOA)
