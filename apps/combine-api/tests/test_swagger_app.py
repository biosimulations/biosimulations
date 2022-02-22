from src import app
import unittest


class SwaggerUiAppTestCase(unittest.TestCase):
    def test_swagger_ui(self):
        with app.app.app.test_client() as client:
            response = client.get('/')
            self.assertEqual(response.status_code, 200)
            self.assertTrue(next(response.response).decode().startswith('<!-- HTML'))

    def test_open_api_spec(self):
        with app.app.app.test_client() as client:
            response = client.get('/openapi.json')
            self.assertEqual(response.status_code, 200, response.json)
            self.assertEqual(response.json['info']['contact']['url'], 'https://biosimulations.org')
