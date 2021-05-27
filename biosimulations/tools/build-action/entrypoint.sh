#!/bin/sh -l
echo running
echo building app ${APP} for env ${ENVNAME}
mv libs/shared/environments/src/lib/environment.${ENVNAME}.ts libs/shared/environments/src/lib/environment.prod.ts nx build ${APP} --prod

