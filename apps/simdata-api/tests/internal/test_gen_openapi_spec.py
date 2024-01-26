from pathlib import Path

from simdata_api.internal.gen_openapi_spec import main

ROOT_DIR = Path(__file__).parent.parent.parent


def test_gen_openapi_spec():
    # get modified date on openapi spec file
    spec_file = Path(ROOT_DIR) / "simdata_api" / "spec" / "openapi_3_1_0_generated.yaml"
    spec_file_mtime = spec_file.stat().st_mtime

    # generate new openapi spec file
    main()

    # get new modified date on openapi spec file
    spec_file_mtime_new = spec_file.stat().st_mtime

    assert spec_file_mtime != spec_file_mtime_new
