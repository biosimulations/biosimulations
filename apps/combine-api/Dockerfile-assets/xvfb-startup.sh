#!/bin/bash
displayLogFilename=$(mktemp /tmp/display.XXXXXX.log)
exec 6>${displayLogFilename}
set -e
Xvfb -displayfd 6 -ac -screen 0 "$XVFB_RES" -nolisten tcp $XVFB_ARGS &
XVFB_PROC=$!
sleep 1
export DISPLAY=":`cat ${displayLogFilename}`"
set +e
"$@"
result=$?
kill $XVFB_PROC || true
exec 6>&-
rm ${displayLogFilename}
exit $result
