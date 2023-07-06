from biosimulators_utils.combine.io import CombineArchiveReader
from biosimulators_utils.sedml.io import SedmlSimulationReader
from combine_api import app
from combine_api.app_config import ENVVAR_STORAGE_SECRET
from unittest import mock
from werkzeug.datastructures import MultiDict
import json
import os
import pytest
import shutil
import tempfile
import unittest


class CreateCombineArchiveTestCase(unittest.TestCase):
    FIXTURES_DIR = os.path.join(os.path.dirname(__file__), '..', 'fixtures')

    def setUp(self):
        self.temp_dirname = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.temp_dirname)

    def test_create_combine_archive_with_uploaded_model_file(self):
        endpoint = '/combine/create'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'model.xml'))
        file_1_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        archive_specs['contents'][0]['location']['value']['filename'] = file_0_path
        archive_specs['contents'][1]['location']['value']['filename'] = file_1_path

        fid_0 = open(file_0_path, 'rb')
        fid_1 = open(file_1_path, 'rb')

        data = MultiDict([
            ('specs', json.dumps(archive_specs)),
            ('files', fid_0),
            ('files', fid_1),
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

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.json, archive_filename)

        contents_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(archive_filename, contents_dirname)

        self.assertEqual(len(archive.contents), 3)

        for content, expected_content in zip(archive.contents, archive_specs['contents']):
            self.assertEqual(content.location, expected_content['location']['path'])
            self.assertEqual(content.format, expected_content['format'])
            self.assertEqual(content.master, expected_content['master'])

        with self.assertRaisesRegex(ValueError, 'Missing a required XML attribute'):
            sed_doc = SedmlSimulationReader().run(os.path.join(contents_dirname, archive_specs['contents'][2]['location']['path']),
                                                  validate_models_with_languages=True)
        sed_doc = SedmlSimulationReader().run(os.path.join(contents_dirname, archive_specs['contents'][2]['location']['path']),
                                              validate_models_with_languages=False)
        sed_doc_specs = archive_specs['contents'][2]['location']['value']
        self.assertEqual(sed_doc.level, sed_doc_specs['level'])
        self.assertEqual(sed_doc.version, sed_doc_specs['version'])

        self.assertEqual(sed_doc.styles[0].id, sed_doc_specs['styles'][0]['id'])
        self.assertEqual(sed_doc.styles[0].name, sed_doc_specs['styles'][0].get('name', None))
        self.assertEqual(sed_doc.styles[0].base, sed_doc_specs['styles'][0].get('base', None))
        self.assertEqual(sed_doc.styles[0].line.type.value, sed_doc_specs['styles'][0].get('line', None).get('type', None))
        self.assertEqual(sed_doc.styles[0].line.color, sed_doc_specs['styles'][0].get('line', None).get('color', None))
        self.assertEqual(sed_doc.styles[0].line.thickness, sed_doc_specs['styles'][0].get('line', None).get('thickness', None))
        self.assertEqual(sed_doc.styles[0].marker.type.value, sed_doc_specs['styles'][0].get('marker', None).get('type', None))
        self.assertEqual(sed_doc.styles[0].marker.size, sed_doc_specs['styles'][0].get('marker', None).get('size', None))
        self.assertEqual(sed_doc.styles[0].marker.line_color, sed_doc_specs['styles'][0].get('marker', None).get('lineColor', None))
        self.assertEqual(sed_doc.styles[0].marker.line_thickness, sed_doc_specs['styles'][0].get('marker', None).get('lineThickness', None))
        self.assertEqual(sed_doc.styles[0].marker.fill_color, sed_doc_specs['styles'][0].get('marker', None).get('fillColor', None))
        self.assertEqual(sed_doc.styles[0].fill.color, sed_doc_specs['styles'][0].get('fill', None).get('color', None))

        self.assertEqual(sed_doc.styles[1].id, sed_doc_specs['styles'][1]['id'])
        self.assertEqual(sed_doc.styles[1].name, sed_doc_specs['styles'][1].get('name', None))
        self.assertEqual(sed_doc.styles[1].base.id, sed_doc_specs['styles'][1].get('base', None))
        self.assertEqual(sed_doc.styles[1].line, sed_doc_specs['styles'][1].get('line', None))
        self.assertEqual(sed_doc.styles[1].marker.type.value, sed_doc_specs['styles'][1].get('marker', None).get('type', None))
        self.assertEqual(sed_doc.styles[1].marker.size, sed_doc_specs['styles'][1].get('marker', None).get('size', None))
        self.assertEqual(sed_doc.styles[1].marker.line_color, sed_doc_specs['styles'][1].get('marker', None).get('lineColor', None))
        self.assertEqual(sed_doc.styles[1].marker.line_thickness, sed_doc_specs['styles'][1].get('marker', None).get('lineThickness', None))
        self.assertEqual(sed_doc.styles[1].marker.fill_color, sed_doc_specs['styles'][1].get('marker', None).get('fillColor', None))
        self.assertEqual(sed_doc.styles[1].fill.color, sed_doc_specs['styles'][1].get('fill', None).get('color', None))

        self.assertEqual(sed_doc.outputs[1].curves[0].style.id, sed_doc_specs['outputs'][1]['curves'][0]['style'])
        self.assertEqual(sed_doc.outputs[2].surfaces[0].style.id, sed_doc_specs['outputs'][2]['surfaces'][0]['style'])

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

    def test_create_combine_archive_with_uploaded_model_file_and_download(self):
        endpoint = '/combine/create'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'model.xml'))
        file_1_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        archive_specs['contents'][0]['location']['value']['filename'] = file_0_path
        archive_specs['contents'][1]['location']['value']['filename'] = file_1_path

        fid_0 = open(file_0_path, 'rb')
        fid_1 = open(file_1_path, 'rb')

        data = MultiDict([
            ('specs', json.dumps(archive_specs)),
            ('files', fid_0),
            ('files', fid_1),
            ('download', True),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

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

        self.assertEqual(len(archive.contents), 3)


    def test_create_combine_archive_with_uploaded_model_file_and_download_biomd0000000010(self):
        # Repressilator-Elowitz-Nature-2000
        endpoint = '/combine/create'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'BIOMD0000000010-archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'BIOMD0000000010.xml'))
        # file_1_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        archive_specs['contents'][0]['location']['value']['filename'] = file_0_path
        # archive_specs['contents'][1]['location']['value']['filename'] = file_1_path

        fid_0 = open(file_0_path, 'rb')
        # fid_1 = open(file_1_path, 'rb')

        data = MultiDict([
            ('specs', json.dumps(archive_specs)),
            ('files', fid_0),
            # ('files', fid_1),
            ('download', True),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        fid_0.close()
        # fid_1.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.content_type, 'application/zip')
        downloaded_archive_filename = os.path.join(self.temp_dirname, 'archive-downloaded.omex')
        with open(downloaded_archive_filename, 'wb') as file:
            file.write(response.data)

        contents_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(downloaded_archive_filename, contents_dirname)

        self.assertEqual(len(archive.contents), 2)

    @pytest.mark.skipif(ENVVAR_STORAGE_SECRET not in os.environ,
                        reason=f"S3 test skipped, S3 config {ENVVAR_STORAGE_SECRET} not supplied")
    def test_create_combine_archive_with_uploaded_model_file_and_save_to_s3_biomd0000000010(self):
        # Repressilator-Elowitz-Nature-2000
        endpoint = '/combine/create'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'BIOMD0000000010-archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'BIOMD0000000010.xml'))
        archive_specs['contents'][0]['location']['value']['filename'] = file_0_path

        fid_0 = open(file_0_path, 'rb')

        data = MultiDict([
            ('specs', json.dumps(archive_specs)),
            ('files', fid_0),
            ('download', False),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            response = client.post(endpoint, data=data, content_type="multipart/form-data")

        fid_0.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.content_type, 'application/zip')
        downloaded_archive_filename = os.path.join(self.temp_dirname, 'archive-downloaded.omex')
        with open(downloaded_archive_filename, 'wb') as file:
            file.write(response.data)

        contents_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(downloaded_archive_filename, contents_dirname)

        self.assertEqual(len(archive.contents), 2)


    def test_create_combine_archive_with_model_at_url(self):
        endpoint = '/combine/create'

        archive_specs_filename = os.path.join(
            self.FIXTURES_DIR, 'archive-specs.json')
        with open(archive_specs_filename, 'rb') as file:
            archive_specs = json.load(file)

        file_0_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'model.xml'))
        file_1_path = os.path.abspath(os.path.join(self.FIXTURES_DIR, 'file.txt'))
        file_0_url = 'https://models.org/model.xml'
        file_1_url = 'https://models.org/file.txt'
        archive_specs['contents'][0]['location']['value'].pop('filename')
        archive_specs['contents'][1]['location']['value'].pop('filename')
        archive_specs['contents'][0]['location']['value']['_type'] = 'CombineArchiveContentUrl'
        archive_specs['contents'][1]['location']['value']['_type'] = 'CombineArchiveContentUrl'
        archive_specs['contents'][0]['location']['value']['url'] = file_0_url
        archive_specs['contents'][1]['location']['value']['url'] = file_1_url

        fid_0 = open(file_0_path, 'rb')
        fid_1 = open(file_1_path, 'rb')

        data = MultiDict([
            ('specs', json.dumps(archive_specs)),
        ])
        with app.app.app.test_client() as client:
            archive_filename = os.path.join(self.temp_dirname, 'archive.omex')

            def save_temporary_combine_archive_to_s3_bucket(filename, public=True, archive_filename=archive_filename):
                shutil.copy(filename, archive_filename)
                return archive_filename
            with mock.patch('combine_api.s3.save_temporary_combine_archive_to_s3_bucket', side_effect=save_temporary_combine_archive_to_s3_bucket):
                def requests_get(url):
                    assert url in [file_0_url, file_1_url]
                    if url == file_0_url:
                        return mock.Mock(raise_for_status=lambda: None, content=fid_0.read())
                    else:
                        return mock.Mock(raise_for_status=lambda: None, content=fid_1.read())
                with mock.patch('requests.get', side_effect=requests_get):
                    response = client.post(endpoint, data=data, content_type="multipart/form-data")

        fid_0.close()
        fid_1.close()

        self.assertEqual(response.status_code, 200, response.json)
        self.assertEqual(response.json, archive_filename)

        contents_dirname = os.path.join(self.temp_dirname, 'archive')
        archive = CombineArchiveReader().run(archive_filename, contents_dirname)

        self.assertEqual(len(archive.contents), 3)

        for content, expected_content in zip(archive.contents, archive_specs['contents']):
            self.assertEqual(content.location, expected_content['location']['path'])
            self.assertEqual(content.format, expected_content['format'])
            self.assertEqual(content.master, expected_content['master'])

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
