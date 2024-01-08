import json
import yaml
import os
from fastapi.openapi.utils import get_openapi
from main import app


def main():
  openapi_spec = get_openapi(
      title=app.title,
      version=app.version,
      openapi_version=app.openapi_version,
      description=app.description,
      routes=app.routes,
  )

  # Convert the JSON OpenAPI spec to YAML
  openapi_spec_yaml = yaml.dump(json.loads(json.dumps(openapi_spec)), sort_keys=False)

  current_directory = os.path.dirname(os.path.realpath(__file__))

  # Write the YAML OpenAPI spec to a file in subdirectory spec
  with open(f"{current_directory}/spec/openapi.yaml", 'w') as f:
      f.write(openapi_spec_yaml)

if __name__ == '__main__':
  main()

