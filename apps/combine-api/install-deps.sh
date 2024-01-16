#!/bin/bash 

poetry env use python3.10
poetry lock 

if poetry install; then 
   echo "Poetry successfully installed all packages."
else
   echo "Poetry failed to install all packages. Attempting to install Smoldyn manually..."
   ./install-smoldyn.sh
fi 
