import os
from datetime import datetime
from pathlib import Path

from simdata_api.internal.s3_utils import S3

ROOT_DIR = Path(__file__).parent.parent


def test_download_s3_file():
    RUN_ID = "61fd573874bc0ce059643515"
    S3_PATH = f"simulations/{RUN_ID}/contents/reports.h5"
    LOCAL_PATH = Path(ROOT_DIR) / "local_data" / f"{RUN_ID}.h5"

    s3 = S3()
    s3.download_s3_file(s3_path=S3_PATH, file_path=LOCAL_PATH)
    assert LOCAL_PATH.exists()
    os.remove(LOCAL_PATH)


def test_get_s3_modified_date():
    RUN_ID = "61fd573874bc0ce059643515"
    S3_PATH = f"simulations/{RUN_ID}/contents/reports.h5"

    s3 = S3()
    td: datetime = s3.get_s3_modified_date(s3_path=S3_PATH)
    assert td is not None
