#!/bin/sh

# Alex here: I will remove the comments below very soon. I wrote this as helper content for myself.
# poetry run python --version && poetry run python <-- verify python version for env and open the shell
# poetry add <PACKAGE> || pip install <PACKAGE>  <-- installs package
# sudo poetry env remove python3.10 <-- removes the envs that have 3.10 completely
# poetry cache list <-- view all the caches by name
# poetry cache clear <CACHE NAME> --all <-- removes all the files from the relative cache.

set -e

# TODO: read this from pyproject.toml
echo "What python version would you like to use for this environment?: "
read -r python_version

poetry env use python"${python_version}"
poetry run pip install --upgrade pip
poetry lock --no-update

if poetry install -v; then
   if poetry run ./install-smoldyn.sh; then
      echo "Poetry installed Smoldyn"
   else
      echo "Smoldyn could not be installed"
      exit 1
   fi
   if poetry run pip install biosimulators-simularium==0.5.5; then
      echo "Poetry successfully installed all packages."
   else
      echo "Poetry could not install biosimulators-simularium."
      exit 1
   fi
else
   echo "Poetry failed to successfully install all packages"
   exit 1
fi
