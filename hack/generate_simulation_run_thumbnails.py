from PIL import Image
from src import s3
import json
import requests

deployment = 'prod'

bucket = s3.S3Bucket()

run_ids = set()
with open('apps/dispatch/src/app/components/simulations/browse/example-simulations.{}.json'.format(deployment), 'r') as file:
   for run in json.load(file):
      run_ids.add(run['id'])

response = requests.get('https://api.biosimulations.{}/projects'.format('org' if deployment == 'prod' else 'dev'))
response.raise_for_status()
for run in response.json():
   run_ids.add(run['simulationRun'])

run_ids = sorted(run_ids)

for i_run, run_id in enumerate(run_ids):
   print('{} of {}'.format(i_run + 1, len(run_ids)))

   response = requests.get('https://api.biosimulations.{}/files/{}'.format('org' if deployment == 'prod' else 'dev', run_id))
   response.raise_for_status()
   for file in response.json():
      if file['format'] in [
         'http://purl.org/NET/mediatypes/image/gif',
         'http://purl.org/NET/mediatypes/image/jpeg',
         'http://purl.org/NET/mediatypes/image/png',
         'http://purl.org/NET/mediatypes/image/webp',
      ]:
         response = requests.get(file['url'])
         response.raise_for_status()

         for thumbnail_type, width in {
            'view': 1280 - 2 * 2 * 16,
            'browse': 552,
         }.items():
            filename = 'image.{}'.format(file['location'].rpartition('.')[2])

            with open(filename, 'wb') as file_handle:
               file_handle.write(response.content)

            image = Image.open(filename)
            resize_imaged = image.resize((width, round(image.size[1] / image.size[0] * width)))
            resize_imaged.save(filename)

            key = 'simulations/{}/thumbnails/{}/{}'.format(run_id, thumbnail_type, file['location'])
            bucket.upload_file(filename, key, True)