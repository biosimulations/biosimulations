import os 
from dotenv import load_dotenv

class GoogleStorageAuth(object):
    def __init__(self):

        load_dotenv("config/config.env")

        # Google storage key info
        key_type = os.getenv("GOOGLE_STORAGE_KEY_TYPE")
        project_id = os.getenv("GOOGLE_STORAGE_PROJECT_ID")
        private_key_id= os.getenv("GOOGLE_STORAGE_PRIVATE_KEY_ID")
        private_key = os.getenv("GOOGLE_STORAGE_PRIVATE_KEY")
        client_email = os.getenv("GOOGLE_STORAGE_CLIENT_EMAIL")
        client_id = os.getenv("GOOGLE_STORAGE_CLIENT_ID")
        auth_uri = os.getenv("GOOGLE_STORAGE_AUTH_URI")
        token_uri = os.getenv("GOOGLE_STORAGE_TOKEN_URI")
        auth_provider_x509_cert_url = os.getenv("GOOGLE_STORAGE_AUTH_PROVIDER_X509_CERT_URL")
        client_x509_cert_url = os.getenv("GOOGLE_STORAGE_CLIENT_X509_CERT_URL")
        
        
        self.key_json = {
            "type": key_type,
            "project_id": project_id,
            "private_key_id": private_key_id,
            "private_key": private_key,
            "client_email": client_email,
            "client_id": client_id,
            "auth_uri": auth_uri,
            "token_uri": token_uri,
            "auth_provider_x509_cert_url": auth_provider_x509_cert_url,
            "client_x509_cert_url": client_x509_cert_url
        }

    def __enter__(self):
            # write key to json file. Cannot use json.dump because it will double encode the private key 
    
        key_json_items = [(k, v) for k, v in self.key_json.items()]
        all_but_last = key_json_items[:-1]
        last_item = key_json_items[-1]

        with open('config/storage-buckets/key.json', 'w') as outfile:
            outfile.write('{')
            for k, v in all_but_last:
                outfile.write('"{}": "{}",\n'.format(k, v))
            k, v = last_item
            outfile.write('"{}": "{}"\n'.format(k, v))
            outfile.write('}')            
        
        # Set env variable for google storage key 
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "config/storage-buckets/key.json"
    
    def __exit__(self, type, value, traceback):
        # remove key file to prevent leakage
        os.remove('config/storage-buckets/key.json')
      


