#!/usr/bin/env python3

import argparse
import json
import os
import requests
import shutil
import subprocess
import tempfile


GET_SIMULATORS_ENDPOINT = 'https://api.biosimulators.{}/simulators/'

EXAMPLE_COMBINE_ARCHIVES_BASE_URL = 'https://github.com/biosimulators/Biosimulators_test_suite/raw/{}/examples/'

EXAMPLE_SIMULATIONS_FILENAME = __file__ + '.json'

SUBMIT_SIMULATION_RUN_ENDPOINT = 'https://run.api.biosimulations.{}/run'
EXAMPLE_SIMULATIONS_RUNS_FILENAME = os.path.join(os.path.dirname(__file__),
                                                 '..', 'apps', 'dispatch', 'src', 'app', 'components',
                                                 'simulations', 'browse', 'example-simulations.{}.json')


def main(runbiosimulations_api='dev', biosimulators_api='dev', biosimulators_test_suite_branch='deploy', token=None, image_names=None):
    """ Submit example simulations from the BioSimulators test suite to the runBioSimulations API and
    record their runs to ``example-simulations.json`` within the browse simulations module of the
    dispatch app so that users can load runs of these simulations as examples.

    Args:
        runbiosimulations_api (:obj:`str`): which deployment of the runBioSimulations API to use (``dev`` or ``org``)
        biosimulators_api (:obj:`str`): which deployment of the BioSimulators API to use (``dev`` or ``org``)
        biosimulators_test_suite_branch (:obj:`str`): branch of the BioSimulators test suite to use (e.g., ``deploy`` or ``dev``).
        simulation_names (:obj:`list` of :obj:`str`): filenames of example simulations to execute. Default: execute all examples.
    """

    # get latest version of each simulator
    response = requests.get(GET_SIMULATORS_ENDPOINT.format(biosimulators_api))
    response.raise_for_status()
    simulators = [(simulator['id'], simulator['version']) for simulator in response.json(
    ) if (simulator['image'] and simulator['image']['url'])]

    for simulator in simulators:
        sim = simulator[0]
        version = simulator[1]
    # curl -X POST "https://run.api.biosimulations.org/images/refresh" -H  "accept: */*" -H  "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJqRkNPVGd4UXpNNU5UaEROa1U1TkVGRlJEUXlSalF5UlVJek5UbERSakEzUlRnNFJUWXhSZyJ9.eyJodHRwczovL2Jpb3NpbXVsYXRpb25zLm9yZy9hcHBfbWV0YWRhdGEiOnsiYWRtaW4iOnRydWUsInJlZ2lzdGVyZWQiOnRydWUsInJvbGVzIjpbImFkbWluIl0sInRlcm1zQWNjZXB0ZWRPbiI6MTU5MzQ1NzEwNDkwMX0sImh0dHBzOi8vYmlvc2ltdWxhdGlvbnMub3JnL3Blcm1pc3Npb25zIjpbIndyaXRlOlNpbXVsYXRvcnMiLCJ3cml0ZTpTaW11bGF0aW9uUnVuIiwidGVzdDpwZXJtaXNzaW9ucyJdLCJodHRwczovL2Jpb3NpbXVsYXRpb25zLm9yZy9yb2xlcyI6WyJhZG1pbiJdLCJodHRwczovL2Jpb3NpbXVsYXRpb25zLm9yZy91c2VyX21ldGFkYXRhIjp7InVzZXJuYW1lIjoiYmlsYWxzaGFpa2gifSwiaXNzIjoiaHR0cHM6Ly9hdXRoLmJpb3NpbXVsYXRpb25zLm9yZy8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNDEzNzI1NTExODA3NzQ2MzY2NSIsImF1ZCI6ImRpc3BhdGNoLmJpb3NpbXVsYXRpb25zLm9yZyIsImlhdCI6MTYxNDE4NzQwOSwiZXhwIjoxNjE0MTk0NjA5LCJhenAiOiJwTWF0SWUwVHFMUGJuWEJuNmdjRGpkam5wSXJsS0czYSIsInNjb3BlIjoiIiwicGVybWlzc2lvbnMiOlsiZGVsZXRlOlJlc3VsdHMiLCJkZWxldGU6U2ltdWxhdGlvblJ1bnMiLCJyZWFkOkVtYWlsIiwicmVhZDpSZXN1bHRzIiwicmVhZDpTaW11bGF0aW9uUnVucyIsInJlZnJlc2g6SW1hZ2VzIiwid3JpdGU6UmVzdWx0cyIsIndyaXRlOlNpbXVsYXRpb25SdW5zIl19.jVIOfvNckiRMxTYKHKPectTd_Jx0-Pynsh-XUddMq0MuxZHC_MemPrWCOdbaCvgAbh7hObOJOON6EFikSymJISDIsNpcIzQhkp1AkfD3ifknCxp-wlHIJJbzogXYwhXViuzMSiAJrlsbvTwxildPUo7-tr-AGTQpG7aZ3Bdv3K5qtmXqna4MzmhnZSKSpphfHUSSskB_0a7HUjEPh0LP6-jWb3fkMStNAC25jsXrTgC-Mzo5iczeNNatJSFz5BiiV2VukPBMmVQlMFi_ACEvIKA4gtzcj3cb7odqeBFgpLRX7bncNWPzzVR0YcQlDKAVhas-Y2qEvjb-QC7TE7j23A" -H  "Content-Type: application/json" -d "{\"simulator\":\"tellurium\",\"version\":\"2.2.0\"}"
        headers = {'Authorization': "Bearer "+token}
        r = requests.post('http://localhost:3333/images/refresh',
                          data={"simulator": sim, "version": version}, headers=headers)
        print(r.content)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Submit the example simulations to the runBioSimulations API and save their runs to the dispatch app.')
    parser.add_argument(
        '--runbiosimulations-api', type=str, default='dev',
        help='runBioSimulations API which simulations should be submitted to (`dev`, `org`). Default: `dev`.')
    parser.add_argument(
        '--biosimulators-api', type=str, default='dev',
        help=('BioSimulators API which should be used to select the version of each simulation tool used '
              'to execute simulations (`dev`, `org`). Default: `dev`.'))
    parser.add_argument(
        '--biosimulators-test-suite-branch', type=str, default='deploy',
        help=('Branch of the BioSimulators test suite from which the example COMBINE/OMEX archives should be obtained. '
              'Default: `deploy`.'))
    parser.add_argument(
        '--images', type=str, nargs='*',
        help='Names of the example images to update. Default: update all images.',
        default=None, dest='image_names',
    )
    parser.add_argument(
        '--token', type=str, help=('The authorization token to call the api'), dest='token')
    args = parser.parse_args()

    main(runbiosimulations_api=args.runbiosimulations_api,
         biosimulators_api=args.biosimulators_api,
         biosimulators_test_suite_branch=args.biosimulators_test_suite_branch,
         image_names=args.image_names,
         token=args.token)
