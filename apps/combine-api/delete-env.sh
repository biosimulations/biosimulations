#!/bin/bash

echo "Please enter the python version of the environment you wish to remove: "
read -r version
sudo poetry env remove combine2-api-dM9t1Ilw-py${version}
