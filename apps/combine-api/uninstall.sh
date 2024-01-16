#!/bin/zsh

if sudo poetry env remove combine2-api-dM9t1Ilw-py3.10; then
   echo "Python 3.10 env successfully removed."
else
   sudo poetry env remove combine2-api-dM9t1Ilw-py3.9
fi