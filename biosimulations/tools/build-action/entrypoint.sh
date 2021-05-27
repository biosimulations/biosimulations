#!/bin/sh -l
echo running
echo building app $1 for env $2
cd /github/workspace/biosimulations
cp libs/shared/environments/src/lib/environment.$2.ts libs/shared/environments/src/lib/environment.prod.ts
npm ci 
npm run nx build $1 --prod

