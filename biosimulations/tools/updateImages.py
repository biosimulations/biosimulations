#!/usr/bin/env python3

import argparse
import json
import os
import requests
import shutil
import subprocess
import tempfile


GET_SIMULATORS_ENDPOINT = 'https://api.biosimulators.org/simulators/'

EXAMPLE_COMBINE_ARCHIVES_BASE_URL = 'https://github.com/biosimulators/Biosimulators_test_suite/raw/{}/examples/'

EXAMPLE_SIMULATIONS_FILENAME = __file__ + '.json'

SUBMIT_SIMULATION_RUN_ENDPOINT = 'https://run.api.biosimulations.{}/run'


def main(runbiosimulations_api='dev',   token=None, image_names=None):

    # get latest version of each simulator
    response = requests.get(GET_SIMULATORS_ENDPOINT)
    response.raise_for_status()
    simulators = [(simulator['id'], simulator['version']) for simulator in response.json(
    ) if (simulator['image'] and simulator['image']['url'])]

    for simulator in simulators:
        sim = simulator[0]
        version = simulator[1]

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
        '--images', type=str, nargs='*',
        help='Names of the example images to update. Default: update all images.',
        default=None, dest='image_names',
    )
    parser.add_argument(
        '--token', type=str, help=('The authorization token to call the api'), dest='token')
    args = parser.parse_args()

    main(runbiosimulations_api=args.runbiosimulations_api,
         image_names=args.image_names,
         token=args.token)
