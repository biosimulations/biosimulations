#!/bin/sh -l
echo running
echo building app $1 for env $2
cd biosimulations
cp libs/shared/environments/src/lib/environment.$2.ts libs/shared/environments/src/lib/environment.prod.ts
npm ci 
npm run nx build $1 --prod
ls 
cd dist
ls

