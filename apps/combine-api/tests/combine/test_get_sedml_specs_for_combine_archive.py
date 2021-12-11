from biosimulators_utils.sedml.data_model import (
    Model, ModelAttributeChange, AddElementModelChange, ReplaceElementModelChange,
    RemoveElementModelChange, ComputeModelChange,
    OneStepSimulation, SteadyStateSimulation, UniformTimeCourseSimulation,
    Algorithm, AlgorithmParameterChange,
    Task, RepeatedTask, SubTask,
    FunctionalRange, UniformRange, VectorRange,
    SetValueComputeModelChange,
    Variable, Parameter, Report, DataSet, DataGenerator,
    Plot2D, Plot3D, Curve, Surface, AxisScale,
    UniformRangeType,
)
from openapi_core.validation.response.datatypes import OpenAPIResponse
from openapi_core.validation.request.datatypes import (
    OpenAPIRequest,
    RequestParameters,
)
from src import app
from src.handlers.combine import get_sedml_specs_for_combine_archive
from src.exceptions import BadRequestException
from unittest import mock
from werkzeug.datastructures import MultiDict
import io
import json
import os
import requests.exceptions
import shutil
import tempfile
import unittest


class GetSedmlSpecsForCombineArchiveTestCase(unittest.TestCase):
    FIXTURES_DIR = os.path.join(os.path.dirname(__file__), '..', 'fixtures')
    TEST_CASE = 'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations'

    def setUp(self):
        self.temp_dirname = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.temp_dirname)

    def test_get_namespace_specs(self):
        self.assertEqual(get_sedml_specs_for_combine_archive.get_namespace_specs('http://ns.org', 'ns'), {
            '_type': 'Namespace',
            'uri': 'http://ns.org',
            'prefix': 'ns',
        })

        self.assertEqual(get_sedml_specs_for_combine_archive.get_namespace_specs('http://ns.org'), {
            '_type': 'Namespace',
            'uri': 'http://ns.org',
        })

    def test_get_target_specs(self):
        self.assertEqual(get_sedml_specs_for_combine_archive.get_target_specs('/ns:root/ns:el', {'ns': 'http://ns.org'}), {
            '_type': 'SedTarget',
            'value': '/ns:root/ns:el',
            'namespaces': [
                {
                    '_type': 'Namespace',
                    'uri': 'http://ns.org',
                    'prefix': 'ns',
                }
            ]
        })

    def test_get_variable_specs(self):
        el = Variable(
            id='var1',
            name='variable2',
            model=Model(id='model3'),
            target='target4',
            target_namespaces={'ns5': 'uri6'},
            symbol='symbol7',
            task=Task(id='task8'),
        )
        specs = {
            '_type': 'SedVariable',
            'id': 'var1',
            'name': 'variable2',
            'model': 'model3',
            'target': {
                '_type': 'SedTarget',
                'value': 'target4',
                'namespaces': [
                    {
                        '_type': 'Namespace',
                        'uri': 'uri6',
                        'prefix': 'ns5',
                    }
                ]
            },
            'symbol': 'symbol7',
            'task': 'task8',
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_variable_specs(el), specs)

    def test_get_parameter_specs(self):
        el = Parameter(
            id='p1',
            name='p2',
            value=1.1
        )
        specs = {
            '_type': 'SedParameter',
            'id': 'p1',
            'name': 'p2',
            'value': 1.1,
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_parameter_specs(el), specs)

    def test_get_data_generator_specs(self):
        el = DataGenerator(
            id='g1',
            name='g2',
            parameters=[
                Parameter(
                    id='p3',
                    value=1.1,
                ),
            ],
            variables=[
                Variable(
                    id='v4',
                    model=Model(id='model5'),
                    target='target6',
                    task=Task(id='task7'),
                ),
            ],
            math='p3 * v4',
        )
        specs = {
            '_type': 'SedDataGenerator',
            'id': 'g1',
            'name': 'g2',
            'parameters': [
                {
                    '_type': 'SedParameter',
                    'id': 'p3',
                    'value': 1.1,
                }
            ],
            'variables': [
                {
                    '_type': 'SedVariable',
                    'id': 'v4',
                    'model': 'model5',
                    'target': {
                        '_type': 'SedTarget',
                        'value': 'target6',
                        'namespaces': []
                    },
                    'task': 'task7',
                }
            ],
            'math': 'p3 * v4',
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_data_generator_specs(el), specs)

    def test_get_report_specs(self):
        el = Report(
            id='r1',
            name='r2',
            data_sets=[
                DataSet(
                    id='d3',
                    label='d4',
                    name='d5',
                    data_generator=DataGenerator(
                        id='g6',
                    )
                )
            ]
        )
        specs = {
            '_type': 'SedReport',
            'id': 'r1',
            'name': 'r2',
            'dataSets': [
                {
                    '_type': 'SedDataSet',
                    'id': 'd3',
                    'label': 'd4',
                    'name': 'd5',
                    'dataGenerator': 'g6',
                }
            ],
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_output_specs(el), specs)

    def test_get_plot2d_specs(self):
        el = Plot2D(
            id='r1',
            name='r2',
            curves=[
                Curve(
                    id='d3',
                    name='d4',
                    x_scale=AxisScale.linear,
                    y_scale=AxisScale.log,
                    x_data_generator=DataGenerator(
                        id='g5',
                    ),
                    y_data_generator=DataGenerator(
                        id='g6',
                    )
                )
            ]
        )
        specs = {
            '_type': 'SedPlot2D',
            'id': 'r1',
            'name': 'r2',
            'curves': [
                {
                    '_type': 'SedCurve',
                    'id': 'd3',
                    'name': 'd4',
                    'xDataGenerator': 'g5',
                    'yDataGenerator': 'g6',
                },
            ],
            'xScale': 'linear',
            'yScale': 'log',
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_output_specs(el), specs)

    def test_get_plot3d_specs(self):
        el = Plot3D(
            id='r1',
            name='r2',
            surfaces=[
                Surface(
                    id='d3',
                    name='d4',
                    x_scale=AxisScale.linear,
                    y_scale=AxisScale.log,
                    z_scale=AxisScale.linear,
                    x_data_generator=DataGenerator(
                        id='g5',
                    ),
                    y_data_generator=DataGenerator(
                        id='g6',
                    ),
                    z_data_generator=DataGenerator(
                        id='g7',
                    )
                )
            ]
        )
        specs = {
            '_type': 'SedPlot3D',
            'id': 'r1',
            'name': 'r2',
            'surfaces': [
                {
                    '_type': 'SedSurface',
                    'id': 'd3',
                    'name': 'd4',
                    'xDataGenerator': 'g5',
                    'yDataGenerator': 'g6',
                    'zDataGenerator': 'g7',
                },
            ],
            'xScale': 'linear',
            'yScale': 'log',
            'zScale': 'linear',
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_output_specs(el), specs)

    def test_vector_range_specs(self):
        el = VectorRange(
            id='r1',
            name='r2',
            values=[3, 4, 5],
        )
        specs = {
            '_type': 'SedVectorRange',
            'id': 'r1',
            'name': 'r2',
            'values': [3, 4, 5],
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_range_specs(el), specs)

    def test_uniform_range_specs(self):
        el = UniformRange(
            id='r1',
            name='r2',
            start=0,
            end=100,
            number_of_steps=10,
            type=UniformRangeType.linear,
        )
        specs = {
            '_type': 'SedUniformRange',
            'id': 'r1',
            'name': 'r2',
            'start': 0,
            'end': 100,
            'numberOfSteps': 10,
            'type': 'linear',
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_range_specs(el), specs)

    def test_functional_range_specs(self):
        el = FunctionalRange(
            id='r1',
            name='r2',
            range=UniformRange(id='r3'),
            parameters=[
                Parameter(
                    id='p4',
                    value=1.1,
                ),
            ],
            variables=[
                Variable(
                    id='v5',
                    model=Model(id='model6'),
                    target='target7',
                    task=Task(id='task8'),
                ),
            ],
            math='p4 * v5',
        )
        specs = {
            '_type': 'SedFunctionalRange',
            'id': 'r1',
            'name': 'r2',
            'range': 'r3',
            'parameters': [
                {
                    '_type': 'SedParameter',
                    'id': 'p4',
                    'value': 1.1,
                }
            ],
            'variables': [
                {
                    '_type': 'SedVariable',
                    'id': 'v5',
                    'model': 'model6',
                    'target': {
                        '_type': 'SedTarget',
                        'value': 'target7',
                        'namespaces': []
                    },
                    'task': 'task8',
                }
            ],
            'math': 'p4 * v5',
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_range_specs(el), specs)

    def test_model_specs(self):
        el = Model(
            id='r1',
            name='r2',
            source='s3',
            language='l4',
            changes=[],
        )
        specs = {
            '_type': 'SedModel',
            'id': 'r1',
            'name': 'r2',
            'source': 's3',
            'language': 'l4',
            'changes': [],
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_model_specs(el), specs)

    def test_model_specs(self):
        el = Model(
            id='r1',
            name='r2',
            source='s3',
            language='l4',
            changes=[
                ModelAttributeChange(
                    id='c5',
                    name='c6',
                    target='t7',
                    target_namespaces={
                        'ns8': 'uri9',
                    },
                    new_value=10,
                )
            ],
        )
        specs = {
            '_type': 'SedModel',
            'id': 'r1',
            'name': 'r2',
            'source': 's3',
            'language': 'l4',
            'changes': [
                {
                    '_type': 'SedModelAttributeChange',
                    'id': 'c5',
                    'name': 'c6',
                    'target': {
                        '_type': 'SedTarget',
                        'value': 't7',
                        'namespaces': [
                            {
                                '_type': 'Namespace',
                                'prefix': 'ns8',
                                'uri': 'uri9',
                            },
                        ],
                    },
                    'newValue': 10,
                }
            ],
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_model_specs(el), specs)

    def test_model_attribute_change_specs(self):
        el = ModelAttributeChange(
            id='c5',
            name='c6',
            target='t7',
            target_namespaces={
                'ns8': 'uri9',
            },
            new_value=10,
        )
        specs = {
            '_type': 'SedModelAttributeChange',
            'id': 'c5',
            'name': 'c6',
                    'target': {
                        '_type': 'SedTarget',
                        'value': 't7',
                        'namespaces': [
                            {
                                '_type': 'Namespace',
                                'prefix': 'ns8',
                                'uri': 'uri9',
                            },
                        ],
                    },
            'newValue': 10,
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_model_change_specs(el), specs)

    def test_add_element_model_change_specs(self):
        el = AddElementModelChange(
            id='c5',
            name='c6',
            target='t7',
            new_elements=['e8', 'e9'],
        )
        specs = {
            '_type': 'SedAddElementModelChange',
            'id': 'c5',
            'name': 'c6',
            'target': {
                '_type': 'SedTarget',
                'value': 't7',
                'namespaces': [],
            },
            'newElements': ['e8', 'e9'],
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_model_change_specs(el), specs)

    def test_replace_element_model_change_specs(self):
        el = ReplaceElementModelChange(
            id='c5',
            name='c6',
            target='t7',
            new_elements=['e8', 'e9'],
        )
        specs = {
            '_type': 'SedReplaceElementModelChange',
            'id': 'c5',
            'name': 'c6',
            'target': {
                '_type': 'SedTarget',
                'value': 't7',
                'namespaces': [],
            },
            'newElements': ['e8', 'e9'],
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_model_change_specs(el), specs)

    def test_remove_element_model_change_specs(self):
        el = RemoveElementModelChange(
            id='c5',
            name='c6',
            target='t7',
        )
        specs = {
            '_type': 'SedRemoveElementModelChange',
            'id': 'c5',
            'name': 'c6',
            'target': {
                '_type': 'SedTarget',
                'value': 't7',
                'namespaces': [],
            },
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_model_change_specs(el), specs)

    def test_compute_model_change_specs(self):
        el = ComputeModelChange(
            id='c5',
            name='c6',
            target='t7',
            parameters=[
                Parameter(
                    id='p3',
                    value=1.1,
                ),
            ],
            variables=[
                Variable(
                    id='v4',
                    model=Model(id='model5'),
                    target='target6',
                    task=Task(id='task7'),
                ),
            ],
            math='r7 + p3 * v4',
        )
        specs = {
            '_type': 'SedComputeModelChange',
            'id': 'c5',
            'name': 'c6',
            'target': {
                '_type': 'SedTarget',
                'value': 't7',
                'namespaces': [],
            },
            'parameters': [
                {
                    '_type': 'SedParameter',
                    'id': 'p3',
                    'value': 1.1,
                }
            ],
            'variables': [
                {
                    '_type': 'SedVariable',
                    'id': 'v4',
                    'model': 'model5',
                    'target': {
                        '_type': 'SedTarget',
                        'value': 'target6',
                        'namespaces': []
                    },
                    'task': 'task7',
                }
            ],
            'math': 'r7 + p3 * v4',
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_model_change_specs(el), specs)

    def test_one_step_simulation_specs(self):
        el = OneStepSimulation(
            id='c5',
            name='c6',
            step=1.,
            algorithm=Algorithm(
                kisao_id='KISAO_00000019',
                changes=[],
            )
        )
        specs = {
            '_type': 'SedOneStepSimulation',
            'id': 'c5',
            'name': 'c6',
            'step': 1.,
            'algorithm': {
                '_type': 'SedAlgorithm',
                'kisaoId': 'KISAO_00000019',
                'changes': []
            },
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_simulation_specs(el), specs)

    def test_steady_state_simulation_specs(self):
        el = SteadyStateSimulation(
            id='c5',
            name='c6',
            algorithm=Algorithm(
                kisao_id='KISAO_00000019',
                changes=[],
            )
        )
        specs = {
            '_type': 'SedSteadyStateSimulation',
            'id': 'c5',
            'name': 'c6',
            'algorithm': {
                '_type': 'SedAlgorithm',
                'kisaoId': 'KISAO_00000019',
                'changes': []
            },
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_simulation_specs(el), specs)

    def test_uniform_time_course_simulation_specs(self):
        el = UniformTimeCourseSimulation(
            id='c5',
            name='c6',
            initial_time=0.,
            output_start_time=1.,
            output_end_time=2.,
            number_of_steps=10,
            algorithm=Algorithm(
                kisao_id='KISAO_00000019',
                changes=[
                    AlgorithmParameterChange(
                        kisao_id='KISAO_00000019',
                        new_value='v7',
                    ),
                ],
            )
        )
        specs = {
            '_type': 'SedUniformTimeCourseSimulation',
            'id': 'c5',
            'name': 'c6',
            'initialTime': 0.,
            'outputStartTime': 1.,
            'outputEndTime': 2.,
            'numberOfSteps': 10,
            'algorithm': {
                '_type': 'SedAlgorithm',
                'kisaoId': 'KISAO_00000019',
                'changes': [
                    {
                        '_type': 'SedAlgorithmParameterChange',
                        'kisaoId': 'KISAO_00000019',
                        'newValue': 'v7',
                    },
                ]
            },
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_simulation_specs(el), specs)

    def test_task_specs(self):
        el = Task(
            id='c5',
            name='c6',
            model=Model(id='m7'),
            simulation=UniformTimeCourseSimulation(id='s8'),
        )
        specs = {
            '_type': 'SedTask',
            'id': 'c5',
            'name': 'c6',
            'model': 'm7',
            'simulation': 's8',
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_task_specs(el), specs)

    def test_repeated_task_specs(self):
        range = VectorRange(id='r7', values=[8, 9, 10])
        el = RepeatedTask(
            id='c5',
            name='c6',
            ranges=[range],
            range=range,
            reset_model_for_each_iteration=True,
            changes=[
                SetValueComputeModelChange(
                    id='c10',
                    name='c11',
                    model=Model(id='model3'),
                    target='target4',
                    target_namespaces={'ns5': 'uri6'},
                    symbol='symbol7',
                    parameters=[
                        Parameter(
                            id='p3',
                            value=1.1,
                        ),
                    ],
                    variables=[
                        Variable(
                            id='v4',
                            model=Model(id='model5'),
                            target='target6',
                            task=Task(id='task7'),
                        ),
                    ],
                    math='r7 + p3 * v4',
                    range=range,
                ),
            ],
            sub_tasks=[
                SubTask(task=Task(id='t8'), order=9),
            ],
        )
        specs = {
            '_type': 'SedRepeatedTask',
            'id': 'c5',
            'name': 'c6',
            'ranges': [
                {
                    '_type': 'SedVectorRange',
                    'id': 'r7',
                    'values': [8, 9, 10],
                }
            ],
            'range': 'r7',
            'resetModelForEachIteration': True,
            'changes': [
                {
                    '_type': 'SedSetValueComputeModelChange',
                    'id': 'c10',
                    'name': 'c11',
                    'model': 'model3',
                    'target': {
                        '_type': 'SedTarget',
                        'value': 'target4',
                        'namespaces': [
                            {
                                '_type': 'Namespace',
                                'uri': 'uri6',
                                'prefix': 'ns5',
                            }
                        ]
                    },
                    'symbol': 'symbol7',
                    'range': 'r7',
                    'parameters': [
                        {
                            '_type': 'SedParameter',
                            'id': 'p3',
                            'value': 1.1,
                        }
                    ],
                    'variables': [
                        {
                            '_type': 'SedVariable',
                            'id': 'v4',
                            'model': 'model5',
                            'target': {
                                '_type': 'SedTarget',
                                'value': 'target6',
                                'namespaces': []
                            },
                            'task': 'task7',
                        }
                    ],
                    'math': 'r7 + p3 * v4',
                }
            ],
            'subTasks': [
                {
                    '_type': 'SedSubTask',
                    'task': 't8',
                    'order': 9,
                },
            ]
        }
        self.assertEqual(get_sedml_specs_for_combine_archive.get_task_specs(el)['changes'], specs['changes'])
        self.assertEqual(get_sedml_specs_for_combine_archive.get_task_specs(el)['subTasks'], specs['subTasks'])
        self.assertEqual(get_sedml_specs_for_combine_archive.get_task_specs(el), specs)

    def test_url(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        with open(archive_filename, 'rb') as file:
            archive_url_content = file.read()

        archive_url = 'https://archive.combine.org'
        data = MultiDict([
            ('url', archive_url),
        ])
        response = mock.Mock(
            raise_for_status=lambda: None,
            content=archive_url_content,
        )
        with mock.patch('requests.get', return_value=response):
            endpoint = '/combine/sedml-specs'
            with app.app.app.test_client() as client:
                response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        combine_specs = response.json

        sed_output_specs_filename = os.path.join(
            self.FIXTURES_DIR, self.TEST_CASE + '.sed-specs.json')
        with open(sed_output_specs_filename, 'r') as file:
            expected_combine_specs = json.load(file)
        self.assertEqual(combine_specs, expected_combine_specs, combine_specs)

        # validate request and response
        if hasattr(self, "request_validator"):
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/sedml-specs',
                method='post',
                body={
                    'url': archive_url,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )
            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(expected_combine_specs),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_file(self):
        archive_filename = os.path.join(
            self.FIXTURES_DIR, self.TEST_CASE + '.omex')
        fid = open(archive_filename, 'rb')

        data = MultiDict([
            ('file', fid),
        ])
        endpoint = '/combine/sedml-specs'
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 200, response.json)
        combine_specs = response.json

        sed_output_specs_filename = os.path.join(
            self.FIXTURES_DIR, self.TEST_CASE + '.sed-specs.json')
        with open(sed_output_specs_filename, 'r') as file:
            expected_combine_specs = json.load(file)
        self.assertEqual(combine_specs, expected_combine_specs, combine_specs)

        fid.close()

        # validate request and response
        if hasattr(self, "request_validator"):
            with open(archive_filename, 'rb') as file:
                file_content = file.read()

            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/sedml-specs',
                method='post',
                body={
                    'file': file_content,
                },
                mimetype='multipart/form-data',
                parameters=RequestParameters(),
            )

            result = self.request_validator.validate(request)
            result.raise_for_errors()

            response = OpenAPIResponse(data=json.dumps(expected_combine_specs),
                                       status_code=200,
                                       mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()

    def test_error_handling(self):
        endpoint = '/combine/sedml-specs'
        data = MultiDict([
            ('url', 'x'),
        ])
        with app.app.app.test_client() as client:
            response = client.post(endpoint, data=data, content_type="multipart/form-data")
        self.assertEqual(response.status_code, 400, response.json)
        self.assertTrue(response.json['title'].startswith(
            'COMBINE/OMEX archive could not be loaded'))

        if hasattr(self, "response_validator"):
            request = OpenAPIRequest(
                full_url_pattern='https://127.0.0.1/combine/sedml-specs',
                method='post',
                body={
                    'url': 'x',
                },
                mimetype=None,
                parameters=RequestParameters(),
            )
            response = OpenAPIResponse(
                data=json.dumps(response.json),
                status_code=400,
                mimetype='application/json')
            result = self.response_validator.validate(request, response)
            result.raise_for_errors()
