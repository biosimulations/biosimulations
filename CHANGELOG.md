# [4.6.0](https://github.com/biosimulations/biosimulations/compare/v4.5.0...v4.6.0) (2021-09-27)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.995.0 ([19b509a](https://github.com/biosimulations/biosimulations/commit/19b509a7100e59dbcdf3c2674262ec2bf4333f77))
* **dispatch:** improved handling of undefined simulations in simulations browse view; closes [#2999](https://github.com/biosimulations/biosimulations/issues/2999) ([bf47994](https://github.com/biosimulations/biosimulations/commit/bf4799404320d07437797804973e933d7f147c7e))
* **platform:** handle cases when metadata is missing ([f738a74](https://github.com/biosimulations/biosimulations/commit/f738a741caba0da783e522c8d74e86c04b9e4aa8))


### Features

* **simulators:** improved specification of simulator CLIs; closes [#3015](https://github.com/biosimulations/biosimulations/issues/3015) ([c396bfa](https://github.com/biosimulations/biosimulations/commit/c396bfa79a7f9abbc0a3e6b374f96d726fe5eaa7))
* create alternate vega view component ([453a109](https://github.com/biosimulations/biosimulations/commit/453a1094677a18ccc2019bd953d618e4e81c6e2f))
* **dispatch:** added license confirmation to publish run form ([1889e1e](https://github.com/biosimulations/biosimulations/commit/1889e1ec4f50579c51838494f7d693fdb5a87415))
* **dispatch,platform:** updated terms about granting BioSimulations to distribute projects ([6ee2bb1](https://github.com/biosimulations/biosimulations/commit/6ee2bb1779e3f02df9dee82bde75e11fa5dc5f9d))
* **platform:** add code to get metadata and specs of visualiazations ([0cdc472](https://github.com/biosimulations/biosimulations/commit/0cdc4727b201858adec4cb40565bb643c01c2905))
* **platform:** add support for showing vega figures ([f011480](https://github.com/biosimulations/biosimulations/commit/f011480096ee29f42e8aab833dbaec89a1bc1596))
* **ui:** allow for conditional loading of tabs ([1b4779f](https://github.com/biosimulations/biosimulations/commit/1b4779f177748922805e8aaad196d0ef412a5239))
* updated biosimulators-utils, biosimulators-bionetgen ([ce75ea6](https://github.com/biosimulations/biosimulations/commit/ce75ea6a46e880b1c021a336992d7acc311f200d))


### Performance Improvements

* **platform:** fix tests ([a8f6d0e](https://github.com/biosimulations/biosimulations/commit/a8f6d0ed968a9ccccd45249db4b71313ef7a5f5b))

# [4.5.0](https://github.com/biosimulations/biosimulations/compare/v4.4.2...v4.5.0) (2021-09-26)


### Features

* **simulators:** improved simulator usage examples; closes [#3016](https://github.com/biosimulations/biosimulations/issues/3016) ([a56dea2](https://github.com/biosimulations/biosimulations/commit/a56dea24e33e33b7db215a0cc1f62f4bc94dac7d))

## [4.4.2](https://github.com/biosimulations/biosimulations/compare/v4.4.1...v4.4.2) (2021-09-23)


### Bug Fixes

* **simulators-api:** fixed sorting of simulator versions with > 4 points ([020073a](https://github.com/biosimulations/biosimulations/commit/020073ab0a9e8eb0344d7ab4ffee287a323caaed)), closes [#3008](https://github.com/biosimulations/biosimulations/issues/3008)


### Reverts

* **simulators-api:** revert [#3009](https://github.com/biosimulations/biosimulations/issues/3009) to prevent container crashing ([c7ff2cc](https://github.com/biosimulations/biosimulations/commit/c7ff2cc018e28dad55f771c6e778193082e9c2ff)), closes [#3008](https://github.com/biosimulations/biosimulations/issues/3008)

## [4.4.1](https://github.com/biosimulations/biosimulations/compare/v4.4.0...v4.4.1) (2021-09-22)


### Bug Fixes

* fixed sorting of simulator versions with > 4 points ([e0b60ce](https://github.com/biosimulations/biosimulations/commit/e0b60ce7e857a949d73f4daed4cf51e9e2b0ca91))

# [4.4.0](https://github.com/biosimulations/biosimulations/compare/v4.3.0...v4.4.0) (2021-09-22)


### Features

* **ontology:** updated to KiSAO 2.29 ([31e7d7b](https://github.com/biosimulations/biosimulations/commit/31e7d7ba7115c9f381b636113221edca9010397b))
* **platform:** improve styling of platform browse ([28e8e1d](https://github.com/biosimulations/biosimulations/commit/28e8e1d6858363325ae29ae3d71e1dea2a1b19c9))


### Reverts

* remove ui commit scope [skip ci] ([5051250](https://github.com/biosimulations/biosimulations/commit/50512504bd98cf55f2111ad0bf074ae5837260ea))

# [4.3.0](https://github.com/biosimulations/biosimulations/compare/v4.2.0...v4.3.0) (2021-09-15)


### Bug Fixes

* **deps:** update dependency @stoplight/json-ref-resolver to v3.1.3 ([#2986](https://github.com/biosimulations/biosimulations/issues/2986)) ([fe9c5f3](https://github.com/biosimulations/biosimulations/commit/fe9c5f372c69c2f8a11d0d401a312ecdb7bf3338))
* **deps:** update dependency bull to v3.29.2 ([#2987](https://github.com/biosimulations/biosimulations/issues/2987)) ([98cbebf](https://github.com/biosimulations/biosimulations/commit/98cbebf7752e6fd6b034e0a459b6abc9de106247))
* **dispatch:** proceed if metadata is missing ([#2998](https://github.com/biosimulations/biosimulations/issues/2998)) ([f09c633](https://github.com/biosimulations/biosimulations/commit/f09c633a4b69b096c5bd07a1377c451ea3ae3aa1)), closes [#2994](https://github.com/biosimulations/biosimulations/issues/2994)


### Features

* **simulators:** expanded specs for simulators ([32b100b](https://github.com/biosimulations/biosimulations/commit/32b100be3f5856bc8131427155031dc5abe1013a))
* expanded simulator specs ([f281cd3](https://github.com/biosimulations/biosimulations/commit/f281cd31b7c3c7c08dfc47162944dcfdbb7c4761))

# [4.2.0](https://github.com/biosimulations/biosimulations/compare/v4.1.0...v4.2.0) (2021-09-11)


### Bug Fixes

* **deps:** update dependency axios to v0.21.4 ([#2952](https://github.com/biosimulations/biosimulations/issues/2952)) ([c24c0e2](https://github.com/biosimulations/biosimulations/commit/c24c0e2eb96d6ff5c1a77f9408dee9c80e02c0f1))
* **deps:** update dependency ssh2 to v1.4.0 ([#2953](https://github.com/biosimulations/biosimulations/issues/2953)) ([a3afb2b](https://github.com/biosimulations/biosimulations/commit/a3afb2b7c862b7cf4bb86a451dce7380a64afa39))
* specify global setTimeout instead of window ([432b90a](https://github.com/biosimulations/biosimulations/commit/432b90a00f34c604bc5f2fd7038a925c52ea4fec))
* **dispatch-service:** restore check for empty env variables ([3f714ba](https://github.com/biosimulations/biosimulations/commit/3f714baf82ab04673fb33a28cc9f7daa9899c39b))
* restore mkdocs file location ([41a269e](https://github.com/biosimulations/biosimulations/commit/41a269e37f9c3e704baa614b4ab8de30d8ed6546))


### Features

* **account-api:** replace typegoose with mongoose ([69911a3](https://github.com/biosimulations/biosimulations/commit/69911a35ab0ca6c324ba53a097c814d53730d491))
* **dispatch-api:** handle errors and timeouts on uploa> ([dad35ea](https://github.com/biosimulations/biosimulations/commit/dad35ea5718abac450c682970e332ee4292890f3)), closes [#2860](https://github.com/biosimulations/biosimulations/issues/2860)
* **dispatch-service:** added passing software licenses from deployment secrets to Singularity run ([cc19999](https://github.com/biosimulations/biosimulations/commit/cc199990c6255b6b70bc436a9d16051602c4d0c5))
* **storage:** add simulation storage service and timeout for s3 uploads ([0c24173](https://github.com/biosimulations/biosimulations/commit/0c241737989289f79b13ebc8efa265cc7c6fc91f))

# [4.1.0](https://github.com/biosimulations/biosimulations/compare/v4.0.1...v4.1.0) (2021-09-06)


### Features

* **simulators:** added attribute to track installation instructions for Python APIs ([cb2b415](https://github.com/biosimulations/biosimulations/commit/cb2b415b4513170bbb09140e6cd9bff4b970d3ed))

## [4.0.1](https://github.com/biosimulations/biosimulations/compare/v4.0.0...v4.0.1) (2021-09-06)


### Bug Fixes

* **dispatch:** simulation results URLs for data visualizations ([9b7b879](https://github.com/biosimulations/biosimulations/commit/9b7b8795ac2b524b9089fad5a2c7916e3d1214f4))


### Reverts

* 39a60b17d640b62639f6594024f4ba4c66baedc5 ([f804cce](https://github.com/biosimulations/biosimulations/commit/f804cce9e3b3787a11b2989743e86407a4c014dd)), closes [#2959](https://github.com/biosimulations/biosimulations/issues/2959)

# [4.0.0](https://github.com/biosimulations/biosimulations/compare/v3.20.0...v4.0.0) (2021-09-04)


### Bug Fixes

* **dispatch:** properly encode uri to allow for fetching results ([dcbf044](https://github.com/biosimulations/biosimulations/commit/dcbf04433f7e105a01f501f3aa7172c82807ea41))


### Features

* update example simulation runs ([395f513](https://github.com/biosimulations/biosimulations/commit/395f513657c662d2b26b3d3b0de95cdd860ea326)), closes [#2951](https://github.com/biosimulations/biosimulations/issues/2951)


### BREAKING CHANGES

* simulation runs sumbitted prior to the update will not display on the dispatch app

# [3.20.0](https://github.com/biosimulations/biosimulations/compare/v3.19.0...v3.20.0) (2021-09-04)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.983.0 ([#2947](https://github.com/biosimulations/biosimulations/issues/2947)) ([39a60b1](https://github.com/biosimulations/biosimulations/commit/39a60b17d640b62639f6594024f4ba4c66baedc5))
* **dispatch-service:** correct the determination of the environment ([ce46d3b](https://github.com/biosimulations/biosimulations/commit/ce46d3bddb05195dd29408d05c00de53186336ae))
* fix default environment to dev ([c970ccd](https://github.com/biosimulations/biosimulations/commit/c970ccde7a533bb0db3f0ec8334308d3a1ee237d))
* new endpoint implementation ([ed42b6b](https://github.com/biosimulations/biosimulations/commit/ed42b6b27fbba4a97b8a931d6d9771b1563eddb9)), closes [#2943](https://github.com/biosimulations/biosimulations/issues/2943) [#2861](https://github.com/biosimulations/biosimulations/issues/2861) [#2859](https://github.com/biosimulations/biosimulations/issues/2859)


### Features

* **dispatch,dispatch-api:** move thumbnail processing to backend ([4495d6d](https://github.com/biosimulations/biosimulations/commit/4495d6d70e8fcb168fd5b4a38f70850171908d7b))
* **platform:** add page to view projects on platform ([e568d0c](https://github.com/biosimulations/biosimulations/commit/e568d0c16a5e67198e921d8705e45f137c680df2))


### Reverts

* revert commit 5dad745d1df0ffc3fb2fba8fc3b99b21b69b0521 ([f8cdd5b](https://github.com/biosimulations/biosimulations/commit/f8cdd5b338ec3fd7f8b7faf607ce893a9d343075))

# [3.19.0](https://github.com/biosimulations/biosimulations/compare/v3.18.0...v3.19.0) (2021-09-02)


### Features

* **combine-service:** updated to biosimulators-utils 0.1.115, biosimulators-amici 0.1.18 ([9ad2945](https://github.com/biosimulations/biosimulations/commit/9ad29450a51b8ff181a00fe57c70b660dc917a60))

# [3.18.0](https://github.com/biosimulations/biosimulations/compare/v3.17.0...v3.18.0) (2021-09-01)


### Bug Fixes

* **deps:** update dependency form-data to v4 ([#2925](https://github.com/biosimulations/biosimulations/issues/2925)) ([36a79ba](https://github.com/biosimulations/biosimulations/commit/36a79baccabb13e181e9ca5ee0cd2d0bff629697))
* **deps:** update dependency jwks-rsa to v2 ([#2928](https://github.com/biosimulations/biosimulations/issues/2928)) ([f4a3f10](https://github.com/biosimulations/biosimulations/commit/f4a3f107f5e43831e4cf72ffc63fcaf67a0026e3))
* **deps:** update dependency ssh2 to v1 ([#2930](https://github.com/biosimulations/biosimulations/issues/2930)) ([11111c7](https://github.com/biosimulations/biosimulations/commit/11111c76a5c943741397d3110189ac0d5ee53a86))


### Features

* **combine-service:** fixed error handling for run sim, simplified run sim options ([5e63d49](https://github.com/biosimulations/biosimulations/commit/5e63d49eb5a1ad5c27ac09dc970093f04ff79980))
* **dispatch:** added support for new SBO modeling framework terms ([80ee759](https://github.com/biosimulations/biosimulations/commit/80ee759d6be92545b01f999c1a7c0630fa43f43d))

# [3.17.0](https://github.com/biosimulations/Biosimulations/compare/v3.16.0...v3.17.0) (2021-09-01)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.980.0 ([#2906](https://github.com/biosimulations/Biosimulations/issues/2906)) ([163191d](https://github.com/biosimulations/Biosimulations/commit/163191d5cc1e24dbeb0440681761e175b633a759))


### Features

* add shared config file support ([976e578](https://github.com/biosimulations/Biosimulations/commit/976e57846a8c43fa10f8be4e70a8a1989bde683c))
* **dispatch:** call the metadata endpoint to get simulation metadata ([ae1054f](https://github.com/biosimulations/Biosimulations/commit/ae1054f6f101b170cb1408d13ffdcbb39f0b25a1)), closes [#2866](https://github.com/biosimulations/Biosimulations/issues/2866)

# [3.16.0](https://github.com/biosimulations/Biosimulations/compare/v3.15.0...v3.16.0) (2021-08-31)


### Bug Fixes

* **deps:** update dependency class-validator to v0.13.1 ([#2894](https://github.com/biosimulations/Biosimulations/issues/2894)) ([3676e59](https://github.com/biosimulations/Biosimulations/commit/3676e59d26a91d81bd7b12cd0287d619fa8e89ab))
* **deps:** update dependency nats to v2.2.0 ([#2886](https://github.com/biosimulations/Biosimulations/issues/2886)) ([7097edc](https://github.com/biosimulations/Biosimulations/commit/7097edc10eef06edc70ede51b1c2c4dc9eec5810))
* **deps:** update dependency rxjs to v7.3.0 ([#2895](https://github.com/biosimulations/Biosimulations/issues/2895)) ([c01604b](https://github.com/biosimulations/Biosimulations/commit/c01604bfcf4df5516158b442435f63002ef9720c))
* **deps:** update dependency stackdriver-errors-js to v0.10.0 ([43451aa](https://github.com/biosimulations/Biosimulations/commit/43451aa19accdc7c670a17cd6fec1aa660934234))
* **deps:** update dependency tslib to v2.3.1 ([#2888](https://github.com/biosimulations/Biosimulations/issues/2888)) ([fc78756](https://github.com/biosimulations/Biosimulations/commit/fc787565990a70489c6ee0a6b9450af7e92eb118))


### Features

* **dispatch:** added dry run option to example simulation submission ([1487880](https://github.com/biosimulations/Biosimulations/commit/1487880a87f82f48e29dafcfe9741bf9ff862cb7))
* **dispatch:** added example simulation run for RBApy ([277772e](https://github.com/biosimulations/Biosimulations/commit/277772e9d062f4a82fab455efbc2c67d088770ad))
* **dispatch-api:** set uris for metadata elements ([96e94fe](https://github.com/biosimulations/Biosimulations/commit/96e94fef4ea1a25ad95cba100c9b635618d29e7e))
* **simulators:** added ability to capture Python APIs in simulator specs ([5ed44cb](https://github.com/biosimulations/Biosimulations/commit/5ed44cb904349e4f91eb6b8cf62f264eb6eeebdd))

# [3.15.0](https://github.com/biosimulations/Biosimulations/compare/v3.14.0...v3.15.0) (2021-08-29)


### Bug Fixes

* **deps:** update dependency aws-sdk to v2.978.0 ([#2883](https://github.com/biosimulations/Biosimulations/issues/2883)) ([ca487aa](https://github.com/biosimulations/Biosimulations/commit/ca487aab71671f9a4a71668e253800fdc7e98708))
* **deps:** update dependency bull to v3.29.1 ([#2884](https://github.com/biosimulations/Biosimulations/issues/2884)) ([e6589e7](https://github.com/biosimulations/Biosimulations/commit/e6589e7d70baa6c9d6797d4fde95687d4798c19b))
* **deps:** update nest ([#2835](https://github.com/biosimulations/Biosimulations/issues/2835)) ([0e65b60](https://github.com/biosimulations/Biosimulations/commit/0e65b6084e75aae31ff8d089e6321f581fd8742d))


### Features

* **combine-service:** updated to Biosimulators-utils with support for RBA models ([610225b](https://github.com/biosimulations/Biosimulations/commit/610225b46f8bd9ed26c1ca632f01c051d5765dc8))
* updated biosimulators documentation links to docs.biosimulatos.org ([bfa49bb](https://github.com/biosimulations/Biosimulations/commit/bfa49bb7530cb656689eb8632b365110fb6b5aca))
* updated SBO for term for RBA ([fc64418](https://github.com/biosimulations/Biosimulations/commit/fc64418993cb06a162884461646b586801b7f37e))

# [3.14.0](https://github.com/biosimulations/Biosimulations/compare/v3.13.0...v3.14.0) (2021-08-27)


### Bug Fixes

* **combine-service:** dont change field "abstract" to "_abstract" ([591b0db](https://github.com/biosimulations/Biosimulations/commit/591b0db5bef0c4a260fb6f0583ed82b0eaf77481))
* **combine-service:** fix api client implementation ([d313f1c](https://github.com/biosimulations/Biosimulations/commit/d313f1cae8f64d1e93a0741bab2545d9b14d1109))
* **dispatch-service:** dont log error if job is not yet present ([b80db71](https://github.com/biosimulations/Biosimulations/commit/b80db71ed633cbf9c6cb2103a513d7dd1fc397cd))
* **dispatch-service:** fix url for posting metadata ([a5926e7](https://github.com/biosimulations/Biosimulations/commit/a5926e70d24985d0d50adfc65acdd4d6bbb8ca7d))
* **platform:** correct url for metadata ([c2a7a63](https://github.com/biosimulations/Biosimulations/commit/c2a7a63f57072598f9890905697edcfb461742f4))
* **platform:** fix unterminated string literal ([fe0343d](https://github.com/biosimulations/Biosimulations/commit/fe0343dc6fe808023c822b3ffeb004c094be96a2))


### Features

* **combine-service:** isolating simulation execution into separate processes ([9d23a5d](https://github.com/biosimulations/Biosimulations/commit/9d23a5d12571708ecf7b44bc83675cb5b5802a98))
* **combine-service:** update combine api client ([c1bb566](https://github.com/biosimulations/Biosimulations/commit/c1bb56636207d966bbd41f2dcf697008c43a27cf))
* **dispatch-service:** create handler to extract metadata ([16b469a](https://github.com/biosimulations/Biosimulations/commit/16b469a479061d643ffa8541a5db55e95f687404))
* **dispatch-service:** process and create metadata for simulation runs ([99df19d](https://github.com/biosimulations/Biosimulations/commit/99df19d50c786992aad6d35da1443fa3b8126c98))
* **exceptions:** change database errors to return 500 errors instead of 400 ([7390b7f](https://github.com/biosimulations/Biosimulations/commit/7390b7f3e35c6c1f0d1dfb8f145cf4ad8e5545c9))

# [3.13.0](https://github.com/biosimulations/Biosimulations/compare/v3.12.0...v3.13.0) (2021-08-24)


### Features

* **ontology:** updated to KiSAO 2.27 ([09ede72](https://github.com/biosimulations/Biosimulations/commit/09ede7208ce04542e5243ec96b4480471e98f8eb))

# [3.12.0](https://github.com/biosimulations/Biosimulations/compare/v3.11.0...v3.12.0) (2021-08-23)


### Bug Fixes

* **dispatch-api:** fields paramter is optional ([c3863e3](https://github.com/biosimulations/Biosimulations/commit/c3863e3c92709fb094ea6a9712aacbe59cdd412b))


### Features

* **dispatch-api:** implement metadata endpoints ([9d067e9](https://github.com/biosimulations/Biosimulations/commit/9d067e983cd625a8d706bc1cb3cfa2033bdabf62))

# [3.11.0](https://github.com/biosimulations/Biosimulations/compare/v3.10.0...v3.11.0) (2021-08-22)


### Features

* **combine-service:** enabled NEURON, NetPyNe for simulation ([19661df](https://github.com/biosimulations/Biosimulations/commit/19661df2b96697934d2f9ca3b9949cac1570554e))

# [3.10.0](https://github.com/biosimulations/Biosimulations/compare/v3.9.0...v3.10.0) (2021-08-21)


### Features

* **combine-service:** added endpoint for low latency simulation ([b44f5e3](https://github.com/biosimulations/Biosimulations/commit/b44f5e30df6b0e23b40ed302fa6a7a61a6969c09))
* **combine-service:** added endpoint for low-latency simulations ([931f3c7](https://github.com/biosimulations/Biosimulations/commit/931f3c7d25b329f55578cb0e7ba5e59ce7c91858))
* **combine-service:** added options to export simulation results in HDF5, zip formats ([c0cd699](https://github.com/biosimulations/Biosimulations/commit/c0cd6998dc850c5afbcee00fa2afec7390ffd235))
* **combine-service:** added simulator name to get simulaton tools endpoint ([1f708dd](https://github.com/biosimulations/Biosimulations/commit/1f708dd70e138a2c7d662b8689ef73566180e3ba))
* **combine-service:** added test to verify simulator APIs ([0bcaff3](https://github.com/biosimulations/Biosimulations/commit/0bcaff3f11fbc9e85285ef709432219d80fb1ef1))
* **combine-service:** pre-compiled Python code for faster initial calls ([f368de9](https://github.com/biosimulations/Biosimulations/commit/f368de9d973274c0e218e24075665a255d698e7f))
* **combine-service:** updated AMICI, GillesPy2, libSBMLSim ([fe8df2a](https://github.com/biosimulations/Biosimulations/commit/fe8df2a7b1da8c955210be78432565f60080d5bd))
* **combine-service:** updated to KiSAO 2.26, BioSimalators-utils 0.1.105 ([05b9dc5](https://github.com/biosimulations/Biosimulations/commit/05b9dc5ebe393c1e4c4143a0125867a3a79a58ea))
* **combine-service:** updated to KiSAO 2.26, BioSimulators-utils 0.1.105 ([74d0b36](https://github.com/biosimulations/Biosimulations/commit/74d0b369a933ec4b3f7b46c4028addfb794ef90d))
* **dispatch:** added simulator names to simulation tools menu in run form ([5170810](https://github.com/biosimulations/Biosimulations/commit/51708108ce772851690a4a3edff556513feb9368))
* **ontology:** updated to KiSAO 2.26 ([f25f243](https://github.com/biosimulations/Biosimulations/commit/f25f243bf85af086902badfd22b25547d974b9fb))
* **simulators:** added documentation for Python API conventions ([60669be](https://github.com/biosimulations/Biosimulations/commit/60669be5f166ac30a1af137240fbc049c13db331))

# [3.9.0](https://github.com/biosimulations/Biosimulations/compare/v3.8.0...v3.9.0) (2021-08-19)


### Features

* **dispatch:** added example run for MASSpy ([a589891](https://github.com/biosimulations/Biosimulations/commit/a589891a9367b58be7317f6b8f8da8545c2c44a7))
* **dispatch,ontology:** started to add MASS, RBA formats ([43a6153](https://github.com/biosimulations/Biosimulations/commit/43a615325f9695700ac2c9b68b2e124b0b03e3f9))
* **ontology:** updated to KiSAO 2.25 ([3fb5c54](https://github.com/biosimulations/Biosimulations/commit/3fb5c54af97d5631228c0e6456390377a867de5b))

# [3.8.0](https://github.com/biosimulations/Biosimulations/compare/v3.7.0...v3.8.0) (2021-08-18)


### Features

* **ontology:** updated to kisao 2.26 ([0f1f31a](https://github.com/biosimulations/Biosimulations/commit/0f1f31ae0383af38f9e7cd06aa28f022b7d6df07))

# [3.7.0](https://github.com/biosimulations/Biosimulations/compare/v3.6.0...v3.7.0) (2021-08-18)


### Bug Fixes

* update angular/cdk ([c7a18c1](https://github.com/biosimulations/Biosimulations/commit/c7a18c16f0c71fb0057a8cd331bbdd28abddb74b))
* **deps:** update dependency @openapi-contrib/openapi-schema-to-json-schema to v3.1.1 ([#2799](https://github.com/biosimulations/Biosimulations/issues/2799)) ([5d6453f](https://github.com/biosimulations/Biosimulations/commit/5d6453f1fc211b61ba7a0b40c9e18e7877bb874d))
* **deps:** update dependency @sendgrid/mail to v7.4.6 ([#2800](https://github.com/biosimulations/Biosimulations/issues/2800)) ([1e83398](https://github.com/biosimulations/Biosimulations/commit/1e83398a2b75f5af5b44506603f906f3c6e00b9d))
* **deps:** update dependency @typegoose/typegoose to v7.6.3 ([#2803](https://github.com/biosimulations/Biosimulations/issues/2803)) ([1a02d14](https://github.com/biosimulations/Biosimulations/commit/1a02d14610ec792e967f71cd4eec35c83af31d74))
* **deps:** update dependency auth0 to v2.36.1 ([#2823](https://github.com/biosimulations/Biosimulations/issues/2823)) ([fa11231](https://github.com/biosimulations/Biosimulations/commit/fa11231f161bb778e67f52287d707756b5315f20))
* **deps:** update dependency cache-manager to v3.4.4 ([#2804](https://github.com/biosimulations/Biosimulations/issues/2804)) ([3c62abb](https://github.com/biosimulations/Biosimulations/commit/3c62abb0576ede01ba5d9eec1ca0daf56a8b5a4e))
* **deps:** update nest ([#2807](https://github.com/biosimulations/Biosimulations/issues/2807)) ([875673f](https://github.com/biosimulations/Biosimulations/commit/875673f37fe2e4d0cc3f33497043f27899d03fd9))
* **dispatch-service:** added handling for case when no environment variables need to be set ([b51418d](https://github.com/biosimulations/Biosimulations/commit/b51418db31f38c534e774603070943d2abd0901e))
* **platform:** fix import of simulationrun metadata ([fb85650](https://github.com/biosimulations/Biosimulations/commit/fb85650554373a20e48be805d1068f0885bee7c0))


### Features

* **datamodel:** add common api query parameters ([c8bace5](https://github.com/biosimulations/Biosimulations/commit/c8bace5a78d6e991f0590a403927ab28757895f9))
* **dispatch:** added support for passing environment variables to simulators ([107221a](https://github.com/biosimulations/Biosimulations/commit/107221acfef0d611dba986f1da1e1782c1472d91))
* **dispatch-api:** add ability to get sparse simulationRuns ([5570ebb](https://github.com/biosimulations/Biosimulations/commit/5570ebb053df9d19c1fcb8f838564b1107d4c33f))
* **dispatch-api:** add endpoint for metadata ([24ffa40](https://github.com/biosimulations/Biosimulations/commit/24ffa40e96f42054ae4cee1f3eb62c6544ff08fe))
* **dispatch-api:** add tags, add ontology endpoint ([d056b4a](https://github.com/biosimulations/Biosimulations/commit/d056b4a74f0d19454e0eff0c515aea2eba5a0cd5))
* **dispatch-api:** create api model for metadata ([#2815](https://github.com/biosimulations/Biosimulations/issues/2815)) ([d55f7a5](https://github.com/biosimulations/Biosimulations/commit/d55f7a5d29e1f3cbb23ab472f84a2d8b961af843))
* **exceptions:** add better handling of validation errors ([e4e1986](https://github.com/biosimulations/Biosimulations/commit/e4e198623ae0d3f86460da18040faf9f28c9ee9a))

# [3.6.0](https://github.com/biosimulations/Biosimulations/compare/v3.5.0...v3.6.0) (2021-08-11)


### Bug Fixes

* **dispatch:** add logging when catching error ([85fab6c](https://github.com/biosimulations/Biosimulations/commit/85fab6cd89789cbf7357569194404e824bb60865))


### Features

* **dispatch:** added example runs for represillator model with SBML ([3400fa1](https://github.com/biosimulations/Biosimulations/commit/3400fa13eed1178ba74f76111b8ec83c995580f9))
* **dispatch:** added example simulation run for represillator model with OpenCOR ([ebffbae](https://github.com/biosimulations/Biosimulations/commit/ebffbae270595afd8d479d0a5ab6e90623b2323a))
* **dispatch:** added example simulation runs with visuaulizations using SBGN PD maps ([3c371e0](https://github.com/biosimulations/Biosimulations/commit/3c371e00758ab7a56b54afb5997da485fa3d071c))

# [3.5.0](https://github.com/biosimulations/Biosimulations/compare/v3.4.1...v3.5.0) (2021-08-09)


### Bug Fixes

* **deps:** pin dependency zone.js to 0.11.4 ([51bd9c7](https://github.com/biosimulations/Biosimulations/commit/51bd9c77245528ba8903d1644ddf5985899aa803))
* **dispatch:** added timeout for loading similar algorithms ([8c7a725](https://github.com/biosimulations/Biosimulations/commit/8c7a7256e13c9d6fd6c88fd4b5c89553d14906ef))
* **dispatch:** corrected display metadata loading indicator ([346aaeb](https://github.com/biosimulations/Biosimulations/commit/346aaeb809007d25b27e9a970f22eb7a3a715069))
* **dispatch:** fixed display of visualization loading indicator ([59fcd98](https://github.com/biosimulations/Biosimulations/commit/59fcd98686da9f8c6d22af7048b178d1b3362611))


### Features

* **dispatch:** added buttons to publish projects ([33c199a](https://github.com/biosimulations/Biosimulations/commit/33c199ae9e9ccdcc3ef41778f83c7caa7290d65e))
* **dispatch:** added display of errors with metadata of COMBINE archives ([41a0146](https://github.com/biosimulations/Biosimulations/commit/41a0146c8ac7421f13f0a9fe8aa61d2018f38ff0))
* **dispatch:** added support for XPP ([3d108ad](https://github.com/biosimulations/Biosimulations/commit/3d108adb5e468d408b4fbad061eab48f84861ea0))
* **dispatch:** improving capabilities when COMBINE service is down ([dc9ca09](https://github.com/biosimulations/Biosimulations/commit/dc9ca095ff96405e46a13d5f7ce56b95645308e7))
* **dispatch:** simplified designing 2D line/scatter plots with multiple curves ([beab68e](https://github.com/biosimulations/Biosimulations/commit/beab68e194e637940c57637520f292d0262fa328))

## [3.4.1](https://github.com/biosimulations/Biosimulations/compare/v3.4.0...v3.4.1) (2021-07-30)


### Bug Fixes

* **deps:** pin dependency @ngbmodule/material-carousel to 0.7.1 ([0d1acde](https://github.com/biosimulations/Biosimulations/commit/0d1acde594b0bc455c50209603684b8da7f66a02))
* **dispatch-api:** send correct message when simulation status changes ([a3c9c62](https://github.com/biosimulations/Biosimulations/commit/a3c9c6235102a33dafbc8414d0d5535c1a641f2f)), closes [#2739](https://github.com/biosimulations/Biosimulations/issues/2739)

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
