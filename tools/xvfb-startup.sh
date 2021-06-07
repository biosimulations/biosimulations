#!/bin/bash
Xvfb $DISPLAY -ac -screen 0 "$XVFB_RES" -nolisten tcp $XVFB_ARGS &
XVFB_PROC=$!
sleep 1
"$@"
kill $XVFB_PROC
