from . import exceptions
from flask_cors import CORS
import connexion

# Instantiate app from specs
app = connexion.App(__name__, specification_dir='spec')

# Setup handlers for APIs
app.add_api('spec.yml',
            strict_validation=True,
            validate_responses=False)
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
