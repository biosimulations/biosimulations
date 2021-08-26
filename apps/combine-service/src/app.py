from . import exceptions
from flask_cors import CORS
import connexion
import os
import tempfile
import yaml

spec_dirname = 'spec'
spec_filename = 'spec.yml'

# disable ``/run`` endpoints from production
if os.environ.get('ENV', 'dev').lower() == 'prod':
    with open(os.path.join(os.path.dirname(__file__), spec_dirname, spec_filename), 'r') as file:
        specs = yaml.load(file, Loader=yaml.Loader)

    for key in list(specs['paths'].keys()):
        if key.startswith('/run/'):
            specs['paths'].pop(key)

    fid, temp_spec_filename = tempfile.mkstemp(dir=os.path.join(os.path.dirname(__file__), spec_dirname), suffix='.yml')
    os.close(fid)
    with open(temp_spec_filename, 'w') as file:
        file.write(yaml.dump(specs))

    spec_filename = os.path.basename(temp_spec_filename)

# Instantiate app from specs
app = connexion.App(__name__, specification_dir=spec_dirname)

# Setup handlers for APIs
app.add_api(spec_filename,
            strict_validation=True,
            validate_responses=False)

# clean up temporary spec file for production
if os.environ.get('ENV', 'dev').lower() == 'prod':
    os.remove(temp_spec_filename)

# Validate_response = True will give error when API returns something that
# does not match the schema. If you want to send a response even if invalid,
# set to false. Set to false in production if optimistic that client can
# handle the response better than getting error.

# :obj:`validate_responses` is set to obj:`False` because responses are
# validated by the unit tests using openapi-core.

app.add_error_handler(500, exceptions._render_exception)
app.add_error_handler(exceptions.BadRequestException, exceptions._render_exception)

# cross-origin resource sharing
CORS(app.app,
     origins=[
         'http://127.0.0.1:4200',
         'http://127.0.0.1:4201',
         'http://127.0.0.1:4202',
         'http://localhost:4200',
         'http://localhost:4201',
         'http://localhost:4202',
         'https://biosimulators.org',
         'https://www.biosimulators.org',
         'https://biosimulators.dev',
         'https://www.biosimulators.dev',
         'https://run.biosimulations.dev',
         'https://run.biosimulations.org',
     ])
