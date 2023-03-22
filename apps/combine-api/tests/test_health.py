import os

from combine_api import app
import unittest


class HealthHandlerTestCase(unittest.TestCase):
    def test_get_sedml_specs_for_combine_archive_url(self):
        endpoint = '/health'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'status': 'ok'})
