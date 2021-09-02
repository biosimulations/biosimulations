#! /bin/bash 
(curl -X 'POST' \
  'http://localhost:3333/runs' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Kockout of gene A",
  "simulator": "tellurium",
  "simulatorVersion": "2.2.0",
  "cpus": 1,
  "memory": 8,
  "maxTime": 20,
  "envVars": [],
  "email": "info@biosimulations.org",
  "public": false,
  "url": "https://github.com/biosimulators/Biosimulators_test_suite/raw/dev/examples/sbml-core/Ciliberto-J-Cell-Biol-2003-morphogenesis-checkpoint-continuous.omex"
}')