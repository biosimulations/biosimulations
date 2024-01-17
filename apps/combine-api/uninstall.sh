#!/bin/zsh

echo "Enter the Python version of the poetry environment you wish to remove: "
read -r version

if sudo poetry env remove python${version}; then
   echo "Python ${version} env successfully removed."
   ./clear-cache.sh
   echo "Poetry env and caches removed successfully removed. Done."
else
   echo "Something went wrong. Exiting."
   exit 1
fi