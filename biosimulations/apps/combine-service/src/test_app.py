from unittest import mock
import handlers
import os
import unittest


class HandlersTestCase(unittest.TestCase):
    def test_get_sedml_output_specs_for_combine_archive(self):
        archive_url = 'https://archive.combine.org'
        with open(os.path.join(os.path.dirname(__file__),
                               'test-fixtures',
                               'Caravagna-J-Theor-Biol-2010-tumor-suppressive-oscillations.omex'
                               ),
                  'rb') as file:
            archive_url_content = file.read()

        with mock.patch('requests.get', return_value=mock.Mock(raise_for_status=lambda: None, content=archive_url_content)):
            combine_specs = handlers.get_sedml_output_specs_for_combine_archive(archive_url)

        self.assertEqual(combine_specs, {
            'contents': [
                {
                    'location': {
                        'path': './BIOMD0000000912_sim.sedml',
                        'value': {
                            'level': 1,
                            'version': 3,
                            'models': [],
                            'simulations': [],
                            'tasks': [],
                            'dataGenerators': [],
                            'outputs': [
                                {
                                    '_type': 'SedReport',
                                    'id': 'BIOMD0000000912_sim',
                                    'name': 'Caravagna2010',
                                    'dataSets': [
                                        {
                                            'id': 'data_set_time',
                                            'name': None,
                                            'label': 'time',
                                            'dataGenerator': {
                                                '_resultsDataSetId': 'BIOMD0000000912_sim.sedml/BIOMD0000000912_sim/time',
                                                'id': 'time',
                                                'name': 'time',
                                                'variables': [],
                                                'math': 'time'
                                            }
                                        },
                                        {
                                            'id': 'data_set_T',
                                            'name': None,
                                            'label': 'T',
                                            'dataGenerator': {
                                                '_resultsDataSetId': 'BIOMD0000000912_sim.sedml/BIOMD0000000912_sim/T',
                                                'id': 'T',
                                                'name': 'T',
                                                'variables': [],
                                                'math': 'T'
                                            }
                                        },
                                        {
                                            'id': 'data_set_E',
                                            'name': None,
                                            'label': 'E',
                                            'dataGenerator': {
                                                '_resultsDataSetId': 'BIOMD0000000912_sim.sedml/BIOMD0000000912_sim/E',
                                                'id': 'E',
                                                'name': 'E',
                                                'variables': [],
                                                'math': 'E'
                                            }
                                        },
                                        {
                                            'id': 'data_set_I',
                                            'name': None,
                                            'label': 'I',
                                            'dataGenerator': {
                                                '_resultsDataSetId': 'BIOMD0000000912_sim.sedml/BIOMD0000000912_sim/I',
                                                'id': 'I',
                                                'name': 'I',
                                                'variables': [],
                                                'math': 'I'
                                            }
                                        }
                                    ]
                                },
                                {
                                    '_type': 'SedPlot2D',
                                    'id': 'plot_1',
                                    'name': ' ',
                                    'curves': [
                                        {
                                            'id': 'plot_1_T_time',
                                            'name': 'T',
                                            'xDataGenerator': {
                                                '_resultsDataSetId': 'BIOMD0000000912_sim.sedml/plot_1/time',
                                                'id': 'time',
                                                'name': 'time',
                                                'variables': [],
                                                'math': 'time'
                                            },
                                            'yDataGenerator': {
                                                '_resultsDataSetId': 'BIOMD0000000912_sim.sedml/plot_1/T',
                                                'id': 'T',
                                                'name': 'T',
                                                'variables': [],
                                                'math':
                                                'T'
                                            }
                                        },
                                        {
                                            'id': 'plot_1_E_time',
                                            'name': 'E',
                                            'xDataGenerator': {
                                                '_resultsDataSetId': 'BIOMD0000000912_sim.sedml/plot_1/time',
                                                'id': 'time',
                                                'name': 'time',
                                                'variables': [],
                                                'math': 'time'
                                            },
                                            'yDataGenerator': {
                                                '_resultsDataSetId': 'BIOMD0000000912_sim.sedml/plot_1/E',
                                                'id': 'E',
                                                'name': 'E',
                                                'variables': [],
                                                'math': 'E'
                                            }
                                        },
                                        {
                                            'id': 'plot_1_I_time',
                                            'name': 'I',
                                            'xDataGenerator': {
                                                '_resultsDataSetId': 'BIOMD0000000912_sim.sedml/plot_1/time',
                                                'id': 'time',
                                                'name': 'time',
                                                'variables': [],
                                                'math': 'time'
                                            }, 'yDataGenerator': {
                                                '_resultsDataSetId': 'BIOMD0000000912_sim.sedml/plot_1/I',
                                                'id': 'I',
                                                'name': 'I',
                                                'variables': [],
                                                'math': 'I'
                                            }
                                        }
                                    ],
                                    'xScale': 'linear',
                                    'yScale': 'linear'
                                }
                            ]
                        }
                    },
                    'format': 'http://identifiers.org/combine.specifications/sed-ml',
                    'master': True
                }
            ]
        })


if __name__ == '__main__':
    unittest.main()
