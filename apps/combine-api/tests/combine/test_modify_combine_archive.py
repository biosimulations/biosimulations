from biosimulators_utils.combine.io import CombineArchiveReader
from biosimulators_utils.sedml.io import SedmlSimulationReader
from combine_api import app
from unittest import mock
from werkzeug.datastructures import MultiDict
import json
import os
import requests.exceptions
import shutil
import tempfile
import unittest


class CreateModifyArchiveTestCase(unittest.TestCase):
    FIXTURES_DIR = os.path.join(os.path.dirname(__file__), '..', 'fixtures')
    TEST_CASE = 'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations'

    def setUp(self):
        self.temp_dirname = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.temp_dirname)

    def test_modify_combine_archive_with_uploaded_model_file(self):
        endpoint = '/combine/modify'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'model.xml'))
        file_1_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        file_2_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex'))
        archive_specs['contents'][0]['location']['path'] = 'Caravagna2010.xml'
        archive_specs['contents'][0]['location']['value']['filename'] = file_0_path
        archive_specs['contents'][1]['location']['path'] = 'subdir/' + archive_specs['contents'][1]['location']['path']
        archive_specs['contents'][1]['location']['value']['filename'] = file_1_path

        fid_0 = open(file_0_path, 'rb')
        fid_1 = open(file_1_path, 'rb')
        fid_2 = open(file_2_path, 'rb')

        data = MultiDict([
            ('archive', json.dumps({'filename': file_2_path})),
            ('specs', json.dumps(archive_specs)),
            ('files', fid_0),
            ('files', fid_1),
            ('files', fid_2),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            def save_temporary_combine_archive_to_s3_bucket(filename, public=True, archive_filename=archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('combine_api.s3.save_temporary_combine_archive_to_s3_bucket', side_effect=save_temporary_combine_archive_to_s3_bucket):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        fid_0.close()
        fid_1.close()
        fid_2.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.json, archive_filename)

        contents_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(archive_filename, contents_dirname)

        self.assertEqual(len(archive.contents), 5)

        for expected_content in archive_specs['contents']:
            found = False
            for content in archive.contents:
                if os.path.relpath(content.location, '.') == os.path.relpath(expected_content['location']['path'], '.'):
                    found = True
                    self.assertEqual(content.format, expected_content['format'])
                    self.assertEqual(content.master, expected_content['master'])
                    break
            self.assertTrue(found)

        sed_doc = SedmlSimulationReader().run(os.path.join(contents_dirname, archive_specs['contents'][2]['location']['path']),
                                              validate_models_with_languages=False)
        sed_doc_specs = archive_specs['contents'][2]['location']['value']
        self.assertEqual(sed_doc.level, sed_doc_specs['level'])
        self.assertEqual(sed_doc.version, sed_doc_specs['version'])

        self.assertEqual(sed_doc.tasks[0].model, sed_doc.models[0])
        self.assertEqual(len(sed_doc.models[0].changes), 2)
        self.assertEqual(sed_doc.models[0].changes[0].target,
                         "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='k1']/@value")
        self.assertEqual(sed_doc.models[0].changes[0].new_value, '1.2')
        self.assertEqual(sed_doc.models[0].changes[0].target_namespaces, {
            None: 'http://sed-ml.org/sed-ml/level1/version4',
            'sbml': 'http://www.sbml.org/sbml/level3/version1/core',
            'qual': 'http://www.sbml.org/sbml/level3/version1/qual/version1',
        })

        self.assertEqual(sed_doc.tasks[0].simulation.algorithm.changes[0].kisao_id, 'KISAO_0000488')
        self.assertEqual(sed_doc.tasks[0].simulation.algorithm.changes[0].new_value, '10')
        self.assertEqual(sed_doc.outputs[1].curves[0].x_data_generator.variables[0].target,
                         "/sbml:sbml/sbml:model/qual:listOfQualitativeSpecies/qual:qualitativeSpecies[@qual:id='x']")
        self.assertEqual(
            sed_doc.outputs[1].curves[0].x_data_generator.variables[0].target_namespaces,
            {
                None: 'http://sed-ml.org/sed-ml/level1/version4',
                "sbml": "http://www.sbml.org/sbml/level3/version1/core",
                "qual": "http://www.sbml.org/sbml/level3/version1/qual/version1"
            },
        )

    def test_modify_combine_archive_with_uploaded_model_file_and_download(self):
        endpoint = '/combine/modify'

        archive_filename = os.path.abspath(os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex'))
        with open(archive_filename, 'rb') as file:
            archive_content = file.read()

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'model.xml'))
        file_1_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        archive_specs['contents'][0]['location']['path'] = './Caravagna2010.xml'
        archive_specs['contents'][0]['location']['value']['filename'] = file_0_path
        archive_specs['contents'][1]['location']['value']['filename'] = file_1_path

        fid_0 = open(file_0_path, 'rb')
        fid_1 = open(file_1_path, 'rb')

        data = MultiDict([
            ('archive', json.dumps({'url': 'archive.omex'})),
            ('specs', json.dumps(archive_specs)),
            ('files', fid_0),
            ('files', fid_1),
            ('download', True),
        ])
        with app.app.app.test_client() as client:
            with mock.patch('requests.get', return_value=mock.Mock(raise_for_status=lambda: None, content=archive_content)):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        fid_0.close()
        fid_1.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.content_type, 'application/zip')
        downloaded_archive_filename = os.path.join(self.temp_dirname, 'archive-downloaded.omex')
        with open(downloaded_archive_filename, 'wb') as file:
            file.write(response.data)

        contents_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(downloaded_archive_filename, contents_dirname)

        self.assertEqual(len(archive.contents), 5)

    def test_modify_combine_archive_with_model_at_url(self):
        endpoint = '/combine/modify'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'model.xml'))
        file_1_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        file_2_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex'))
        file_0_url = 'https://models.org/model.xml'
        file_1_url = 'https://models.org/file.txt'
        file_2_url = 'https://models.org/archive.omex'
        archive_specs['contents'][0]['location']['path'] = 'subdir/Caravagna2010.xml'
        archive_specs['contents'][0]['location']['value'].pop('filename')
        archive_specs['contents'][1]['location']['value'].pop('filename')
        archive_specs['contents'][0]['location']['value']['_type'] = 'CombineArchiveContentUrl'
        archive_specs['contents'][1]['location']['value']['_type'] = 'CombineArchiveContentUrl'
        archive_specs['contents'][0]['location']['value']['url'] = file_0_url
        archive_specs['contents'][1]['location']['value']['url'] = file_1_url

        fid_0 = open(file_0_path, 'rb')
        fid_1 = open(file_1_path, 'rb')
        fid_2 = open(file_2_path, 'rb')

        data = MultiDict([
            ('archive', json.dumps({'url': file_2_url})),
            ('specs', json.dumps(archive_specs)),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            def save_temporary_combine_archive_to_s3_bucket(filename, public=True, archive_filename=archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('combine_api.s3.save_temporary_combine_archive_to_s3_bucket', side_effect=save_temporary_combine_archive_to_s3_bucket):
                def requests_get(url):
                    assert url in [file_0_url, file_1_url, file_2_url]
                    if url == file_0_url:
                        return mock.Mock(raise_for_status=lambda: None, content=fid_0.read())
                    elif url == file_1_url:
                        return mock.Mock(raise_for_status=lambda: None, content=fid_1.read())
                    elif url == file_2_url:
                        return mock.Mock(raise_for_status=lambda: None, content=fid_2.read())
                with mock.patch('requests.get', side_effect=requests_get):
                    response = client.post(endpoint, data=data, content_type="multipart/form-data")

        fid_0.close()
        fid_1.close()
        fid_2.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.json, archive_filename)

        contents_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(archive_filename, contents_dirname)

        self.assertEqual(len(archive.contents), 6)

        for expected_content in archive_specs['contents']:
            found = False
            for content in archive.contents:
                if os.path.relpath(content.location, '.') == os.path.relpath(expected_content['location']['path'], '.'):
                    found = True
                    self.assertEqual(content.format, expected_content['format'])
                    self.assertEqual(content.master, expected_content['master'])
                    break
            self.assertTrue(found)

        sed_doc = SedmlSimulationReader().run(os.path.join(contents_dirname, archive_specs['contents'][2]['location']['path']),
                                              validate_models_with_languages=False)
        sed_doc_specs = archive_specs['contents'][2]['location']['value']
        self.assertEqual(sed_doc.level, sed_doc_specs['level'])
        self.assertEqual(sed_doc.version, sed_doc_specs['version'])

        self.assertEqual(sed_doc.tasks[0].simulation.algorithm.changes[0].kisao_id, 'KISAO_0000488')
        self.assertEqual(sed_doc.tasks[0].simulation.algorithm.changes[0].new_value, '10')
        self.assertEqual(sed_doc.outputs[1].curves[0].x_data_generator.variables[0].target,
                         "/sbml:sbml/sbml:model/qual:listOfQualitativeSpecies/qual:qualitativeSpecies[@qual:id='x']")
        self.assertEqual(
            sed_doc.outputs[1].curves[0].x_data_generator.variables[0].target_namespaces,
            {
                None: 'http://sed-ml.org/sed-ml/level1/version4',
                "sbml": "http://www.sbml.org/sbml/level3/version1/core",
                "qual": "http://www.sbml.org/sbml/level3/version1/qual/version1"
            },
        )

    def test_modify_combine_archive_error_handling_no_archive_filename_or_url(self):
        endpoint = '/combine/modify'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        data = MultiDict([
            ('archive', json.dumps({})),
            ('specs', json.dumps(archive_specs)),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        self.assertEqual(response.status_code, 400, response.json)
        self.assertEqual(response.json['title'], 'One of `filename` or `url` must be used.')

    def test_modify_combine_archive_error_handling_archive_filename_and_url(self):
        endpoint = '/combine/modify'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        data = MultiDict([
            ('archive', json.dumps({
                'filename': 'x',
                'url': 'y',
            })),
            ('specs', json.dumps(archive_specs)),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        self.assertEqual(response.status_code, 400, response.json)
        self.assertEqual(response.json['title'], 'Only one of `filename` or `url` can be used at a time.')

    def test_modify_combine_archive_error_handling_bad_achive_url(self):
        endpoint = '/combine/modify'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        data = MultiDict([
            ('archive', json.dumps({'url': 'x'})),
            ('specs', json.dumps(archive_specs)),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            def raise_for_status():
                raise requests.exceptions.RequestException('error')

            with mock.patch('requests.get', return_value=mock.Mock(raise_for_status=raise_for_status)):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('could not be loaded from', response.json['title'])

    def test_modify_combine_archive_error_handling_bad_achive(self):
        endpoint = '/combine/modify'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        data = MultiDict([
            ('archive', json.dumps({'url': 'x'})),
            ('specs', json.dumps(archive_specs)),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            with mock.patch('requests.get', return_value=mock.Mock(raise_for_status=lambda: None, content=b'')):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('is not a valid COMBINE/OMEX archive', response.json['title'])

    def test_modify_combine_archive_error_handling_bad_sedml_specs(self):
        endpoint = '/combine/modify'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)
        archive_specs['contents'][2]['location']['value']['simulations'][0]['initialTime'] = 30

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'model.xml'))
        file_1_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        file_2_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex'))
        archive_specs['contents'][0]['location']['path'] = 'Caravagna2010.xml'
        archive_specs['contents'][0]['location']['value']['filename'] = file_0_path
        archive_specs['contents'][1]['location']['path'] = 'subdir/' + archive_specs['contents'][1]['location']['path']
        archive_specs['contents'][1]['location']['value']['filename'] = file_1_path

        fid_0 = open(file_0_path, 'rb')
        fid_1 = open(file_1_path, 'rb')
        fid_2 = open(file_2_path, 'rb')

        data = MultiDict([
            ('archive', json.dumps({'filename': file_2_path})),
            ('specs', json.dumps(archive_specs)),
            ('files', fid_0),
            ('files', fid_1),
            ('files', fid_2),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            def save_temporary_combine_archive_to_s3_bucket(filename, public=True, archive_filename=archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('combine_api.s3.save_temporary_combine_archive_to_s3_bucket', side_effect=save_temporary_combine_archive_to_s3_bucket):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        fid_0.close()
        fid_1.close()
        fid_2.close()

        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('does not contain a configuration for a valid SED-ML document', response.json['title'])

    def test_modify_combine_archive_error_handling_invalid_upload(self):
        endpoint = '/combine/modify'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'model.xml'))
        file_1_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        file_2_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex'))
        archive_specs['contents'][0]['location']['path'] = 'Caravagna2010.xml'
        archive_specs['contents'][0]['location']['value']['filename'] = file_0_path
        archive_specs['contents'][1]['location']['path'] = 'subdir/' + archive_specs['contents'][1]['location']['path']
        archive_specs['contents'][1]['location']['value']['filename'] = 'x'

        fid_0 = open(file_0_path, 'rb')
        fid_1 = open(file_1_path, 'rb')
        fid_2 = open(file_2_path, 'rb')

        data = MultiDict([
            ('archive', json.dumps({'filename': file_2_path})),
            ('specs', json.dumps(archive_specs)),
            ('files', fid_0),
            ('files', fid_1),
            ('files', fid_2),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            def save_temporary_combine_archive_to_s3_bucket(filename, public=True, archive_filename=archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('combine_api.s3.save_temporary_combine_archive_to_s3_bucket', side_effect=save_temporary_combine_archive_to_s3_bucket):
                response = client.post(endpoint, data=data, content_type="multipart/form-data")

        fid_0.close()
        fid_1.close()
        fid_2.close()

        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('was not uploaded', response.json['title'])

    def test_modify_combine_archive_error_handling_invalid_file_url(self):
        endpoint = '/combine/modify'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'model.xml'))
        file_1_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        file_2_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, self.TEST_CASE + '.omex'))
        file_0_url = 'https://models.org/model.xml'
        file_1_url = 'https://models.org/file.txt'
        file_2_url = 'https://models.org/archive.omex'
        archive_specs['contents'][0]['location']['path'] = 'subdir/Caravagna2010.xml'
        archive_specs['contents'][0]['location']['value'].pop('filename')
        archive_specs['contents'][1]['location']['value'].pop('filename')
        archive_specs['contents'][0]['location']['value']['_type'] = 'CombineArchiveContentUrl'
        archive_specs['contents'][1]['location']['value']['_type'] = 'CombineArchiveContentUrl'
        archive_specs['contents'][0]['location']['value']['url'] = file_0_url
        archive_specs['contents'][1]['location']['value']['url'] = file_1_url

        fid_0 = open(file_0_path, 'rb')
        fid_1 = open(file_1_path, 'rb')
        fid_2 = open(file_2_path, 'rb')

        data = MultiDict([
            ('archive', json.dumps({'url': file_2_url})),
            ('specs', json.dumps(archive_specs)),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            def save_temporary_combine_archive_to_s3_bucket(filename, public=True, archive_filename=archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('combine_api.s3.save_temporary_combine_archive_to_s3_bucket', side_effect=save_temporary_combine_archive_to_s3_bucket):
                def requests_get(url):
                    assert url in [file_0_url, file_1_url, file_2_url]
                    if url == file_0_url:
                        raise requests.exceptions.RequestException('here')
                    elif url == file_1_url:
                        return mock.Mock(raise_for_status=lambda: None, content=fid_1.read())
                    elif url == file_2_url:
                        return mock.Mock(raise_for_status=lambda: None, content=fid_2.read())
                with mock.patch('requests.get', side_effect=requests_get):
                    response = client.post(endpoint, data=data, content_type="multipart/form-data")

        fid_0.close()
        fid_1.close()
        fid_2.close()

        self.assertEqual(response.status_code, 400, response.json)
        self.assertIn('content could not be loaded from', response.json['title'])
