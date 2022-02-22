from src import app
import unittest


class KisaoTestCase(unittest.TestCase):
    def test_get_similar_algorithms(self):
        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO_0000088'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 200, response.json)
        alt_algs = response.json
        self.assertEqual(alt_algs[0]['algorithms'][1]['id'], 'KISAO_0000088')
        self.assertNotEqual(alt_algs[1]['algorithms'][1]['id'], 'KISAO_0000088')

        alt_alg_ids = [alt_alg['algorithms'][1]['id'] for alt_alg in alt_algs]
        self.assertIn('KISAO_0000019', alt_alg_ids)
        self.assertNotIn('KISAO_0000209', alt_alg_ids)

        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO_0000088&algorithms=KISAO_0000437'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 200, response.json)
        alt_algs = response.json
        alg_subs = sorted((alt_alg['algorithms'][0]['id'], alt_alg['algorithms'][1]['id'])
                          for alt_alg in alt_algs if alt_alg['minPolicy']['level'] == 1)
        self.assertEqual(alg_subs, [('KISAO_0000088', 'KISAO_0000088'), ('KISAO_0000437', 'KISAO_0000437')])

        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO:9999999'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 400, response.json)

        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO_9999999'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 400, response.json)

        endpoint = '/kisao/get-similar-algorithms?algorithms=KISAO_0000209'
        with app.app.app.test_client() as client:
            response = client.get(endpoint)
        self.assertEqual(response.status_code, 400, response.json)
