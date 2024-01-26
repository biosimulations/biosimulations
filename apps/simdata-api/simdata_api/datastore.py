import logging
from datetime import datetime
from pathlib import Path
from uuid import uuid4

import aiofiles.os
import aiofiles.ospath
import numpy as np

from simdata_api.config import get_settings
from simdata_api.datamodels import HDF5File, ListingItem
from simdata_api.internal.hdf5_utils import extract_hdf5_dataset_array, extract_hdf5_metadata
from simdata_api.internal.s3_aiobotocore import (download_s3_file, get_listing_of_s3_path,
                                                 get_s3_file_contents, get_s3_modified_date, upload_bytes_to_s3)
from simdata_api.internal.tensorstore_utils import write_ts_metadata_root, write_ts_dataset, read_ts_dataset

logger = logging.getLogger(__name__)


async def get_dataset_data(run_id: str, dataset_name: str) -> tuple[np.ndarray, dict[str, str | list[str]]]:
    settings = get_settings()
    S3_STORE_NAME = f"reports.h5.{settings.storage_tensorstore_driver}"
    S3_DIR_PATH = Path("simulations") / run_id / "contents"
    DRIVER = settings.storage_tensorstore_driver
    KVSTORE_DRIVER = settings.storage_tensorstore_kvstore_driver

    try:
        data, attrs = await read_ts_dataset(driver=DRIVER, kvstore_driver=KVSTORE_DRIVER,
                                            kvstore_path=S3_DIR_PATH / S3_STORE_NAME / dataset_name)
        return data, attrs
    except FileNotFoundError:
        logger.info(f"dataset not found {str(S3_DIR_PATH / S3_STORE_NAME / dataset_name)}, attempt upload")
        try:
            await _upload_to_store_if_needed(run_id=run_id)
            data, attrs = await read_ts_dataset(driver=DRIVER, kvstore_driver=KVSTORE_DRIVER,
                                                kvstore_path=S3_DIR_PATH / S3_STORE_NAME / dataset_name)
            return data, attrs
        except FileNotFoundError as e2:
            logger.info(f"failed to retrieve dataset: {str(e2)}")
            raise FileNotFoundError(f"File {S3_DIR_PATH / S3_STORE_NAME / dataset_name} not found in S3")


async def get_results_timestamp(run_id: str) -> datetime:
    S3_HDF5_FILENAME = 'reports.h5'
    S3_DIR_PATH = Path("simulations") / run_id / "contents"
    return await get_s3_modified_date(s3_path=str(S3_DIR_PATH / S3_HDF5_FILENAME))


async def get_hdf5_metadata(run_id: str) -> HDF5File:
    S3_METADATA_FILENAME = "reports.h5.json"
    S3_DIR_PATH = Path("simulations") / run_id / "contents"

    try:
        metadata_json = (await get_s3_file_contents(s3_path=str(S3_DIR_PATH / S3_METADATA_FILENAME))).decode('utf-8')
        return HDF5File.model_validate_json(metadata_json)
    except FileNotFoundError:
        logger.info(f"metadata file not found {str(S3_DIR_PATH / S3_METADATA_FILENAME)}, attempt upload")
        try:
            await _upload_to_store_if_needed(run_id=run_id)
            metadata_json = (await get_s3_file_contents(s3_path=str(S3_DIR_PATH / S3_METADATA_FILENAME))).decode(
                'utf-8')
            return HDF5File.model_validate_json(metadata_json)
        except FileNotFoundError as e2:
            logger.info(f"failed to retrieve metadata: {str(e2)}")
            raise FileNotFoundError(f"File {S3_DIR_PATH / S3_METADATA_FILENAME} not found in S3")


async def _upload_to_store_if_needed(run_id: str) -> None:
    settings = get_settings()

    S3_HDF5_FILENAME = 'reports.h5'
    S3_METADATA_FILENAME = "reports.h5.json"
    S3_STORE_NAME = f"reports.h5.{settings.storage_tensorstore_driver}"
    S3_DIR_PATH = Path("simulations") / run_id / "contents"
    LOCAL_HDF5_PATH = Path(settings.storage_local_cache_dir) / f"{run_id}_{uuid4().hex[:6]}.h5"
    DRIVER = settings.storage_tensorstore_driver
    KVSTORE_DRIVER = settings.storage_tensorstore_kvstore_driver

    s3_items: list[ListingItem] = await get_listing_of_s3_path(s3_path=str(S3_DIR_PATH))

    # if reports.h5 not found in S3, then abort
    if not any([s3_item.Key == str(S3_DIR_PATH / S3_HDF5_FILENAME) for s3_item in s3_items]):
        # NB: not considering the case where reports.h5 is not found but reports.h5.[n5|zarr|zarr3] is found
        raise FileNotFoundError(f"File {S3_DIR_PATH / S3_HDF5_FILENAME} not found in S3")

    # if reports.h5.[n5|zarr|zarr3] S3 store not found
    #    then create a new S3 store from the reports.h5 downloaded to local file cache
    if not any([item.Key.startswith(str(S3_DIR_PATH / S3_STORE_NAME)) for item in s3_items]):
        # download reports.h5 from S3 if needed
        if not await aiofiles.ospath.exists(str(LOCAL_HDF5_PATH)):
            await download_s3_file(s3_path=str(S3_DIR_PATH / S3_HDF5_FILENAME), file_path=LOCAL_HDF5_PATH)

        # read metadata from reports.h5
        hdf5_file: HDF5File = extract_hdf5_metadata(local_file_path=LOCAL_HDF5_PATH)
        hdf5_file.filename = S3_HDF5_FILENAME
        hdf5_file.id = run_id
        hdf5_file.uri = (f"{settings.storage_endpoint_url}/{settings.storage_bucket}/simulations/"
                         f"{run_id}/contents/reports.h5")

        # upload reports.h5 to store in S3 using tensorstore
        await write_ts_metadata_root(driver=DRIVER, kvstore_driver=KVSTORE_DRIVER,
                                     kvstore_root_path=S3_DIR_PATH / S3_STORE_NAME, hdf5_file=hdf5_file)
        for group in hdf5_file.groups:
            for dataset in group.datasets:
                array = extract_hdf5_dataset_array(local_file_path=LOCAL_HDF5_PATH, dataset_name=dataset.name)
                await write_ts_dataset(driver=DRIVER, kvstore_driver=KVSTORE_DRIVER,
                                       kvstore_path=S3_DIR_PATH / S3_STORE_NAME / Path(dataset.name),
                                       data=array, attributes={attr.key: attr.value for attr in dataset.attributes})

        # serialize hdf5_file to JSON and upload to S3
        metadata_json = hdf5_file.model_dump_json()
        await upload_bytes_to_s3(s3_path=str(S3_DIR_PATH / S3_METADATA_FILENAME),
                                 file_contents=metadata_json.encode('utf-8'))

        # use aiofiles to remove local hdf5 file
        await aiofiles.os.remove(str(LOCAL_HDF5_PATH))
