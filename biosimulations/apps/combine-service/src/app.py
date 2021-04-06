from . import exceptions
import connexion
import os
import types  # noqa: F401


def get_specs_dir():
    """ Get the directory which contains the API specifications

    Returns:
        :obj:`str`: directory with API specifications
    """
    return os.getenv('API_SPECS_DIR', 'spec')


# Instantiate app from specs
app = connexion.App(__name__, specification_dir=get_specs_dir())

# Setup handlers for APIs
app.add_api('combine-service.yml',
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
