# COMBINE-API 

Provides a web API for working with COMBINE/OMEX archives and other COMBINE formats such as the OMEX manifest, OMEX metadata, and SED-ML formats and several model formats such as BNGL, CellML, LEMS, NeuroML, RBA XML, SBML, Smoldyn, and XPP.

## Install dependencies
From the root of the COMBINE API folder (```apps/combine-api```) run:

```
pip install pipenv
cd Dockerfile-assets
pipenv install
```

## Run a local development server
From the root of the COMBINE API folder (```apps/combine-api```) run:

```
cd Dockerfile-assets
pipenv shell
python -m ../src/
```

This command will print out the URL for the API.
