import os
from pathlib import Path

from simdata_api.internal.s3_utils import S3


def test_download_s3_file():
    RUN_ID = "61fd573874bc0ce059643515"
    S3_PATH = f"simulations/{RUN_ID}/contents/reports.h5"
    LOCAL_STORAGE_PATH = "../local_data"
    LOCAL_PATH = Path(f"{LOCAL_STORAGE_PATH}/{RUN_ID}.h5")

    s3 = S3()
    s3.download_s3_file(s3_path=S3_PATH, file_path=LOCAL_PATH)
    if LOCAL_PATH.exists():
        os.remove(LOCAL_PATH)
