#!/bin/bash 

# poetry run python --version && poetry run python <-- verify python version for env and open the shell
# poetry add <PACKAGE> || pip install <PACKAGE>  <-- installs package

poetry env use python3.10
pip install --upgrade pip
poetry lock 

if poetry install; then 
   echo "Poetry successfully installed all packages."
else
   echo "Poetry failed to install all packages. Attempting to install Smoldyn manually..."
   ./install-smoldyn.sh
fi 
