export const expectedValue = `#!/bin/bash
#SBATCH --job-name=Simulation-run-239298383
#SBATCH --chdir=workDirname_1
#SBATCH --output=workDirname_1/rawLog.txt
#SBATCH --error=workDirname_1/rawLog.txt
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=1
#SBATCH --mem=1000M
#SBATCH --time=1:00
#SBATCH --constraint=
#SBATCH --partition=undefined
#SBATCH --qos=undefined

# the return code of any failing command will be stored in err, so that the script will exit with that code if it fails
err=0
failed_step=""

# print thank you message
echo -e '\\033[0;36mThank you for using runBioSimulations!\\033[0m'

echo -e ''
echo -e '\\033[0;36m================================================ Loading Singularity ================================================\\033[0m'
export MODULEPATH=undefined
source undefined
export undefined
module load undefined
export SINGULARITY_CACHEDIR=undefined
export SINGULARITY_PULLFOLDER=undefined

echo -e ''
echo -e '\\033[0;36m=================================================== Set up storage ==================================================\\033[0m'
export PYTHONWARNINGS="ignore"
export AWS_ACCESS_KEY_ID=undefined
export AWS_SECRET_ACCESS_KEY=undefined

cleanup() {
  echo -e ''
  echo -e '\\033[0;36m================================================== Saving final log =================================================\\033[0m'
  srun --job-name="Save-raw-log-to-S3-3"     aws       --endpoint-url undefined       s3 sync         .         's3://undefined/mockpath'         --exclude '*'         --include 'rawLog.txt'         --acl public-read
  retcode=$?
  if [[ $retcode -ne 0 ]]; then
    err=$?
    failed_step="Save-raw-log-to-S3-3"
  fi
}

# execute cleanup function on jobs which are cancelled
trap cleanup SIGTERM

if [[ $err -eq 0 ]]; then
  echo -e ''
  echo -e '\\033[0;36m========================================== Downloading COMBINE/OMEX archive =========================================\\033[0m'
  (ulimit -f 1048576; srun --job-name="Download-project" curl -L -o 'archive.omex' https://api.biosimulations.dev/runs/239298383/download)
  retcode=$?
  if [[ $retcode -ne 0 ]]; then
    err=$?
    failed_step="Download-project"
  fi
else
  echo -e ''
  echo -e '\\033[0;31m========================================== [SKIP] Downloading COMBINE/OMEX archive =========================================\\033[0m'
fi


if [[ $err -eq 0 ]]; then
  echo -e ''
  echo -e '\\033[0;36m=========================================== Executing COMBINE/OMEX archive ==========================================\\033[0m'
  TEMP_DIRNAME=$(mktemp --directory --tmpdir=/local)
  srun --job-name="Execute-project"     singularity run       --bind workDirname_1:/root       --bind \${TEMP_DIRNAME}:/tmp       --env "HPC=1,CPUS=1"       docker://ghcr.io/biosimulators/simulator_1:1.0.0         -i '/root/archive.omex'         -o '/root/mockpath'
  retcode=$?
  if [[ $retcode -ne 0 ]]; then
    err=$?
    failed_step="Execute-project"
  fi
  rm -rf \${TEMP_DIRNAME}
else
  echo -e ''
  echo -e '\\033[0;31m========================================== [SKIP] Executing COMBINE/OMEX archive =========================================\\033[0m'
fi



if [[ $err -eq 0 ]]; then
  echo -e ''
  echo -e '\\033[0;36m===================================================== Saving log ====================================================\\033[0m'
  srun --job-name="Save-raw-log-to-S3-1"     aws       --endpoint-url undefined       s3 sync         .         's3://undefined/mockpath'         --exclude '*'         --include 'rawLog.txt'         --acl public-read
  retcode=$?
  if [[ $retcode -ne 0 ]]; then
    err=$?
    failed_step="Save-raw-log-to-S3-1"
  fi
else
  echo -e ''
  echo -e '\\033[0;31m========================================== [SKIP] Saving log =========================================\\033[0m'
fi

if [[ $err -eq 0 ]]; then
  echo -e ''
  echo -e '\\033[0;36m===================================================== Saving Structured log ==========================================\\033[0m'
  srun --job-name="Save-structured-log-to-S3"     aws       --endpoint-url undefined       s3 sync         .         's3://undefined/mockpath'         --exclude '*'         --include '*.yml'         --include '*.yaml'         --content-type 'application/yaml'        --acl public-read
  retcode=$?
  if [[ $retcode -ne 0 ]]; then
    err=$?
    failed_step="Save-structured-log-to-S3"
  fi
else
  echo -e ''
  echo -e '\\033[0;31m========================================== [SKIP] Saving Structured log =========================================\\033[0m'
fi

if [[ $err -eq 0 ]]; then
  echo -e ''
  echo -e '\\033[0;36m================================================== Zipping outputs ==================================================\\033[0m'
  srun --job-name="Zip-outputs"     zip       -x 'mockpath'       -r       'output.zip'       mockpath       mockpath
  retcode=$?
  if [[ $retcode -ne 0 ]]; then
    err=$?
    failed_step="Zip-outputs"
  fi
else
  echo -e ''
  echo -e '\\033[0;31m========================================== [SKIP] Zipping outputs =========================================\\033[0m'
fi

# We run the upload in steps to 1) get the content types right, and 2) make sure the final log has the upload operation included
if [[ $err -eq 0 ]]; then
  echo -e ''
  echo -e '\\033[0;36m=================================================== Saving HDF5 outputs ==================================================\\033[0m'
  srun --job-name="Save-numerical-outputs-to-S3"     aws       --endpoint-url undefined       s3 sync         .         's3://undefined/mockpath'         --exclude '*'         --include '*.h5'         --include '*.hdf'         --include '*.hdf5'         --content-type 'application/hdf5'        --acl public-read
  retcode=$?
  if [[ $retcode -ne 0 ]]; then
    err=$?
    failed_step="Save-numerical-outputs-to-S3"
  fi
else
  echo -e ''
  echo -e '\\033[0;31m========================================== [SKIP] Saving HDF5 outputs =========================================\\033[0m'
fi

if [[ $err -eq 0 ]]; then
  echo -e ''
  echo -e '\\033[0;36m=================================================== Saving non-HDF5 outputs ==================================================\\033[0m'
  srun --job-name="Save-other-outputs-to-S3"     aws       --endpoint-url undefined       s3 sync         .         's3://undefined/mockpath'         --exclude "job.sbatch"         --exclude "*.h5"         --exclude "*.hdf"         --exclude "*.hdf5"         --exclude "*.yml"         --exclude "*.yaml"         --exclude "archive.omex"         --acl public-read
  retcode=$?
  if [[ $retcode -ne 0 ]]; then
    err=$?
    failed_step="Save-other-outputs-to-S3"
  fi
else
  echo -e ''
  echo -e '\\033[0;31m========================================== [SKIP] Saving non-HDF5 outputs =========================================\\033[0m'
fi


if [[ $err -eq 0 ]]; then
  echo -e ''
  echo -e '\\033[0;36m====================================== Unzip contents of COMBINE/OMEX archive ======================================\\033[0m'
  srun --job-name="Unzip-COMBINE-archive"     unzip archive.omex -d mockpath
  retcode=$?
  if [[ $retcode -ne 0 ]]; then
    err=$?
    failed_step="Unzip-COMBINE-archive"
  fi
else
  echo -e ''
  echo -e '\\033[0;31m========================================== [SKIP] Unzip contents of COMBINE/OMEX archive =========================================\\033[0m'
fi

if [[ $err -eq 0 ]]; then
  echo -e ''
  echo -e '\\033[0;36m====================================== Save contents of COMBINE/OMEX archive ======================================\\033[0m'
  srun --job-name="Save-COMBINE-archive-contents-to-S3"     aws       --endpoint-url undefined       s3 sync         mockpath         's3://undefined/mockpath/mockpath'         --include "*"         --acl public-read
  retcode=$?
  if [[ $retcode -ne 0 ]]; then
    err=$?
    failed_step="Save-COMBINE-archive-contents-to-S3"
  fi
  rm -r mockpath
else
  echo -e ''
  echo -e '\\033[0;31m========================================== [SKIP] Save contents of COMBINE/OMEX archive =========================================\\033[0m'
fi



if [[ $err -eq 0 ]]; then
  echo -e ''
  echo -e '\\033[0;36m==================================================== Updating log (2) ===============================================\\033[0m'
  srun --job-name="Save-raw-log-to-S3-2"     aws       --endpoint-url undefined       s3 sync         .         's3://undefined/mockpath'         --exclude '*'         --include 'rawLog.txt'         --acl public-read
  retcode=$?
  if [[ $retcode -ne 0 ]]; then
    err=$?
    failed_step="Save-raw-log-to-S3-2"
  fi
else
  echo -e ''
  echo -e '\\033[0;31m========================================== [SKIP] Updating log (2) =========================================\\033[0m'
fi

if [[ $err -eq 0 ]]; then
  echo -e ''
  echo -e '\\033[0;36m=================================================== Saving results to HSDS ========================\\033[0m'

  hsds_counter=0
  max_num_tries=40
  min_sleep_time=5
  max_sleep_time=15

  srun --job-name="Save-results-to-HSDS"     hsload       --endpoint undefined       --user undefined       --password undefined       --verbose       mockpath       '/results/239298383'
  hsds_retcode=$?

  while [ $hsds_retcode -ne 0 ]; do
    echo "Failed to save results to HSDS"
    hsds_counter=$((hsds_counter+1))
    if [ $hsds_counter -eq $max_num_tries ]; then
      echo "Failed to save results to HSDS after $max_num_tries attempts, exiting"
      exit 1
    fi

    sleep_time=$(($min_sleep_time + (RANDOM % ($max_sleep_time - $min_sleep_time + 1))))
    echo "Waiting $sleep_time seconds"
    sleep $sleep_time

    srun --job-name="Save-results-to-HSDS"       hsload         --endpoint undefined         --user undefined         --password undefined         --verbose         mockpath         '/results/239298383'
      hsds_retcode=$?
  done

  if [[ $hsds_retcode -ne 0 ]]; then
    err=$hsds_retcode
    failed_step="Save-results-to-HSDS"
  fi

else
  echo -e ''
  echo -e '\\033[0;31m========================================== [SKIP] Saving results to HSDS =========================================\\033[0m'
fi

cleanup

# If there was an error, exit the script with that error code and echo the step which failed
if [[ $err -ne 0 ]]; then
  echo "Error: $failed_step failed with exit code $err"
  exit $err
fi
`;
