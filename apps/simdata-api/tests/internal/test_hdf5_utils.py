from pathlib import Path

from simdata_api.config import get_settings
from simdata_api.datamodels import HDF5File
from simdata_api.internal.hdf5_utils import extract_hdf5_metadata, extract_hdf5_dataset_array

RUN_ID = "61fd573874bc0ce059643515"
DATASET_NAME = "/simulation.sedml/Figure_1c"
ROOT_DIR = Path(__file__).parent.parent.parent


def test_extract_hdf5_dataset_array():
    test_file_path = ROOT_DIR / "local_data" / "repressilator_copasi.h5"
    ndarray = extract_hdf5_dataset_array(local_file_path=test_file_path, dataset_name=DATASET_NAME)
    assert ndarray.shape == (4, 601)


def test_extract_hdf5_metadata():
    test_file_path = ROOT_DIR / "local_data" / "repressilator_copasi.h5"
    hdf5_file = extract_hdf5_metadata(test_file_path)
    settings = get_settings()

    assert hdf5_file.filename == str(test_file_path)
    assert hdf5_file.uri == ""
    assert hdf5_file.id == ""

    hdf5_file.id = RUN_ID
    base_url = f"{settings.storage_endpoint_url}/{settings.storage_bucket}"
    hdf5_file.uri = f"{base_url}/simulations/{RUN_ID}/contents/reports.h5"

    # round trip test of serialization
    assert HDF5File.model_validate_json(hdf5_file.model_dump_json()) == hdf5_file

    assert hdf5_file.filename == str(test_file_path)
    assert hdf5_file.uri is not None
    assert hdf5_file.id == RUN_ID
