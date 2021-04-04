import connexion
import importlib
import os
import types  # noqa: F401

handlers_spec = importlib.util.spec_from_file_location(
    "handlers",
    os.path.abspath(os.path.join(os.path.dirname(__file__), 'handlers.py')))
handlers = importlib.util.module_from_spec(handlers_spec)
handlers_spec.loader.exec_module(handlers)


def get_specs_dir():
    """ Get the directory which contains the API specifications

    Returns:
        :obj:`str`: directory with API specifications
    """
    return os.getenv('API_SPECS_DIR', 'spec')


def handler_resolver(handler):
    """ Get a handler function

    Args:
        handler (:obj:`str`): name of the handler

    Returns:
        :obj:`types.FunctionType`: handler function
    """
    module, _, function = handler.partition('.')
    assert module == 'handlers'
    return getattr(handlers, function)


# Instantiate app from specs
app = connexion.App(__name__, specification_dir=get_specs_dir())

# Setup handlers for APIs
resolver = connexion.resolver.Resolver(function_resolver=handler_resolver)
app.add_api('combine-service.yml', validate_responses=False,
            resolver=resolver)
# Validate_response = True will give error when API returns something that
# does not match the schema. If you want to send a response even if invalid,
# set to false. Set to false in production if optimistic that client can
# handle the response better than getting error.

# :obj:`validate_responses` is set to obj:`False` because responses are
# validated by the unit tests using openapi-core.

if __name__ == '__main__':
    # DEV Server only
    app.run(host="127.0.0.1", port=3333, threaded=True, debug=True)
