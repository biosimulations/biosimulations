#!/bin/bash

version="$1"

if [ "${version}" == "" ]; then
   echo "No python version specified. Using python ${version}"
   version="3.9"
else
  echo "Using: ""${version}"
fi

if sudo poetry env remove python${version}; then
   echo "Python ${version} env successfully removed."
   ./clear-cache.sh
   echo "Poetry env and caches removed successfully removed. Done."
else
   echo "Something went wrong. Exiting."
   exit 1
fi
