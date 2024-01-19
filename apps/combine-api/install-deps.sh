#!/bin/bash

# Alex here: I will remove the comments below very soon. I wrote this as helper content for myself.
# poetry run python --version && poetry run python <-- verify python version for env and open the shell
# poetry add <PACKAGE> || pip install <PACKAGE>  <-- installs package
# sudo poetry env remove python3.10 <-- removes the envs that have 3.10 completely
# poetry cache list <-- view all the caches by name
# poetry cache clear <CACHE NAME> --all <-- removes all the files from the relative cache.

# TODO: read this from pyproject.toml

python_version="$1"

poetry env use python"${python_version}"
poetry run pip install --upgrade pip
poetry lock --no-update

if poetry install -v; then
   if poetry run ./install-smoldyn.sh; then
      echo "Poetry installed Smoldyn and Biosimulators_simularium. Done."
   else
      echo "Smoldyn could not be installed. Exiting."
      exit 1
   fi
else
  echo "Could not install the deps. Exiting."
  exit 1
fi
