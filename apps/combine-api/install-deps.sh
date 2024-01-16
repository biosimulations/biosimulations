#!/bin/zsh

# poetry run python --version && poetry run python <-- verify python version for env and open the shell
# poetry add <PACKAGE> || pip install <PACKAGE>  <-- installs package

set -e 

poetry env use python3.10
poetry run pip install --upgrade pip 
poetry lock

if poetry install -v; then
   if poetry run ./install-smoldyn.sh; then
      echo "Poetry installed Smoldyn"
   else 
      echo "Smoldyn could not be installed"
      exit 1
   fi
   if poetry run pip install biosimulators-simularium==0.5.3; then
      echo "Poetry successfully installed all packages."
   else
      echo "Poetry could not install biosimulators-simularium"
      exit 1
   fi
else
   echo "Poetry failed to successfully install all packages"
   exit 1
fi 

# if poetry install; then 
#    echo "Poetry successfully installed all packages."
# else
#    echo "Poetry failed to install all packages. Attempting to install Smoldyn manually..."
#    poetry run pip install --upgrade pip
#    if poetry run ./install-smoldyn.sh; then
#        echo "Smoldyn manually installed successfully."
#        poetry install
#        echo "Poetry successfully install all packages"
#    else
#        echo "Failed to manually install Smoldyn."
#        exit 1
#    fi
# fi 
