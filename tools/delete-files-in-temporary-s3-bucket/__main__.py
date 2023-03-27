#!/usr/bin/env python3

from combine_api.s3 import delete_temporary_files_in_s3_bucket, TEMP_STORAGE_MAX_AGE
import argparse


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Delete the files in the temporary S3 bucket')
    parser.add_argument('--min-age', type=int,
                        help='Minimum age in days required for deletion. Default: {} days'.format(TEMP_STORAGE_MAX_AGE),
                        default=TEMP_STORAGE_MAX_AGE)
    args = parser.parse_args()
    delete_temporary_files_in_s3_bucket(min_age=args.min_age)
