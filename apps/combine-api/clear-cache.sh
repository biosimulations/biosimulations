#!/bin/zsh 

if yes | poetry cache clear PyPI --all && yes | poetry cache clear _default_cache --all; then 
   echo "All caches cleared."
else 
   echo "Could not clear caches."
   exit 1
fi
