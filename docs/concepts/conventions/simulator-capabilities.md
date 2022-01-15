# Format for the specification of BioSimulation tools

## Overview
The BioSimulators format for the specifications of a simulation tool is a JSON schema for describing the modeling frameworks (e.g., logical, constraint-based), simulation algorithms (e.g., CVODE, SSA), and modeling formats (e.g., CellML, COMBINE/OMEX, SBML, SED-ML) that a simulation tool supports, as well as the parameters of each algorithm (e.g., random number generator seed), their data types, and their allowed and default values.

The format can also capture a metadata about each simulation tool including its

- Name;
- Version;
- Description;
- URL for a standardized Docker image for the tool;
- URL for documentation about the tool;
- Citations for the tool;
- Citations for each algorithm supported by the tool;
- Other identifiers for the tool such as for bio.tools, CRAN, or PyPI;
- License for the tool;
- The authors of the tool; and
- Dates when the tool was submitted to the BioSimulators registry and when it was last updated.

## Schema

The schema for the format is available in [JSON Schema](https://api.biosimulators.org/schema/Simulator.json) and [Open API](https://api.biosimulators.org/openapi.json) formats. Documentation for the schema is available at [https://api.biosimulators.org/](https://api.biosimulators.org/).

The schema utilizes several ontologies:

- Funding agencies: [Funder Registry](https://www.crossref.org/services/funder-registry/) terms such as the National Science Foundation ([10.13039/100000001](http://doi.org/10.13039/100000001)) and the National Institutes of Health ([10.13039/100000002](http://doi.org/10.13039/100000002)).
 
- Licenses: [SPDX](https://spdx.org/) terms such as GNU General Public License v3.0 or later ([GPL-3.0-or-later](https://spdx.org/licenses/GPL-3.0-or-later)).

- Modeling formats: [EDAM](https://edamontology.org/) terms such as BNGL ([format_3972](https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3972)), CellML ([format_3240](https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3240)), SBML ([format_2585](https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_2585)), and SED-ML ([format_3685](https://www.ebi.ac.uk/ols/ontologies/edam/terms?iri=http%3A%2F%2Fedamontology.org%2Fformat_3685)).

- Modeling frameworks: [SBO](https://www.ebi.ac.uk/sbo/) terms such as flux balance analysis framework ([SBO:0000624](https://www.ebi.ac.uk/ols/ontologies/sbo/terms?iri=http%3A%2F%2Fbiomodels.net%2FSBO%2FSBO_0000624)) and non-spatial continuous kinetic framework ([SBO:0000293](https://www.ebi.ac.uk/ols/ontologies/sbo/terms?iri=http%3A%2F%2Fbiomodels.net%2FSBO%2FSBO_0000293)).

- Programming languages: [Linguist](https://github.com/github/linguist) terms such as C++, Java, JavaScript, Python, R.

- Simulation algorithms: [KiSAO](http://co.mbine.org/standards/kisao) terms such as CVODE ([KISAO:0000019](https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_0000019)), FBA ([KISAO:0000437](https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_0000437)), and SSA ([KISAO:0000029](https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23KISAO_0000029)).

## Example

As an example, below is the specification for [tellurium](https://biosimulators.org/simulators/tellurium/):

```json
{
  "id": "tellurium",
  "name": "tellurium",
  "version": "2.2.1",
  "description": "tellurium is a Python-based environment for model building, simulation, and analysis that facilitates reproducibility of models in systems and synthetic biology.",
  "urls": [
    {
      "type": "Home page",
      "url": "http://tellurium.analogmachine.org/"
    },
    {
      "type": "Discussion forum",
      "url": "https://groups.google.com/d/forum/tellurium-discuss"
    },
    {
      "type": "Tutorial",
      "url": "https://tellurium.readthedocs.io/en/latest/quickstart.html"
    },
    {
      "type": "Installation instructions",
      "url": "https://github.com/sys-bio/tellurium#installation-instructions"
    },
    {
      "type": "Documentation",
      "url": "https://tellurium.readthedocs.io/"
    },
    {
      "type": "Source repository",
      "url": "https://github.com/sys-bio/tellurium"
    },
    {
      "type": "Guide to contributing",
      "url": "https://github.com/sys-bio/tellurium/blob/develop/CONTRIBUTING.rst"
    },
    {
      "type": "Issue tracker",
      "url": "https://github.com/sys-bio/tellurium/issues"
    },
    {
      "type": "License",
      "url": "https://github.com/sys-bio/tellurium/blob/develop/LICENSE.txt"
    },
    {
      "type": "Release notes",
      "url": "http://tellurium.analogmachine.org/news/"
    }
  ],
  "image": {
    "url": "ghcr.io/biosimulators/biosimulators_tellurium/tellurium:2.2.1",
    "digest": "sha256:5d1595553608436a2a343f8ab7e650798ef5ba5dab007b9fe31cd342bf18ec81",
    "format": {
      "namespace": "EDAM",
      "id": "format_3973",
      "version": "1.2.0",
      "supportedFeatures": []
    },
    "operatingSystemType": "Linux"
  },
  "cli": {
    "packageRepository": "PyPI",
    "package": "biosimulators-tellurium",
    "command": "biosimulators-tellurium",
    "installationInstructions": "https://docs.biosimulators.org/biosimulators_tellurium/installation.html"
  },
  "pythonApi": {
    "package": "biosimulators-tellurium",
    "module": "biosimulators_tellurium",
    "installationInstructions": "https://docs.biosimulators.org/biosimulators_tellurium/installation.html"
  },
  "authors": [
    {
      "firstName": "Jayit",
      "lastName": "Biswas",
      "identifiers": []
    },
    {
      "firstName": "Kiri",
      "lastName": "Choi",
      "identifiers": [
        {
          "namespace": "orcid",
          "id": "0000-0002-0156-8410",
          "url": "https://orcid.org/0000-0002-0156-8410"
        }
      ]
    },
    {
      "firstName": "Wilbert",
      "lastName": "Copeland",
      "identifiers": []
    },
    {
      "firstName": "Caroline",
      "lastName": "Cannistra",
      "identifiers": []
    },
    {
      "firstName": "Alex",
      "lastName": "Darling",
      "identifiers": []
    },
    {
      "firstName": "Nasir",
      "lastName": "Elmi",
      "identifiers": []
    },
    {
      "firstName": "Michal",
      "lastName": "Galdzicki",
      "identifiers": [
        {
          "namespace": "orcid",
          "id": "0000-0002-8392-8183",
          "url": "https://orcid.org/0000-0002-8392-8183"
        }
      ]
    },
    {
      "firstName": "Stanley",
      "lastName": "Gu",
      "identifiers": []
    },
    {
      "firstName": "Totte",
      "lastName": "Karlsson",
      "identifiers": []
    },
    {
      "firstName": "Matthias",
      "lastName": "König",
      "identifiers": [
        {
          "namespace": "orcid",
          "id": "0000-0003-1725-179X",
          "url": "https://orcid.org/0000-0003-1725-179X"
        }
      ]
    },
    {
      "firstName": "J",
      "middleName": "Kyle",
      "lastName": "Medley",
      "identifiers": [
        {
          "namespace": "orcid",
          "id": "0000-0002-9135-0844",
          "url": "https://orcid.org/0000-0002-9135-0844"
        }
      ]
    },
    {
      "firstName": "Herbert",
      "middleName": "M.",
      "lastName": "Sauro",
      "identifiers": [
        {
          "namespace": "orcid",
          "id": "0000-0002-3659-6817",
          "url": "https://orcid.org/0000-0002-3659-6817"
        }
      ]
    },
    {
      "firstName": "Andy",
      "lastName": "Somogyi",
      "identifiers": []
    },
    {
      "firstName": "Lucian",
      "lastName": "Smith",
      "identifiers": [
        {
          "namespace": "orcid",
          "id": "0000-0001-7002-6386",
          "url": "https://orcid.org/0000-0001-7002-6386"
        }
      ]
    },
    {
      "firstName": "Kaylene",
      "lastName": "Stocking",
      "identifiers": []
    }
  ],
  "references": {
    "identifiers": [
      {
        "namespace": "pypi",
        "id": "tellurium",
        "url": "https://pypi.org/project/tellurium/"
      },
      {
        "namespace": "pypi",
        "id": "biosimulators-tellurium",
        "url": "https://pypi.org/project/biosimulators-tellurium/"
      },
      {
        "namespace": "nanohub.resource",
        "id": "tellurium",
        "url": "https://nanohub.org/resources/tellurium"
      }
    ],
    "citations": [
      {
        "title": "tellurium: an extensible Python-based modeling environment for systems and synthetic biology",
        "authors": "Kiri Choi, J. Kyle Medley, Matthias König, Kaylene Stocking, Lucian Smith, Stanley Gua & Herbert M. Sauro",
        "journal": "BioSystems",
        "volume": "171",
        "pages": "74-79",
        "year": 2018,
        "identifiers": [
          {
            "namespace": "doi",
            "id": "10.1016/j.biosystems.2018.07.006",
            "url": "https://doi.org/10.1016/j.biosystems.2018.07.006"
          }
        ]
      }
    ]
  },
  "license": {
    "namespace": "SPDX",
    "id": "Apache-2.0"
  },
  "algorithms": [
    {
      "id": "cvode",
      "name": "C-language Variable-coefficient Ordinary Differential Equation solver",
      "kisaoId": {
        "namespace": "KISAO",
        "id": "KISAO_0000019"
      },
      "modelingFrameworks": [
        {
          "namespace": "SBO",
          "id": "SBO_0000293"
        }
      ],
      "modelFormats": [
        {
          "namespace": "EDAM",
          "id": "format_2585",
          "version": null,
          "supportedFeatures": []
        }
      ],
      "modelChangePatterns": [
        {
          "name": "Change component attributes",
          "types": [
            "SedAttributeModelChange",
            "SedComputeAttributeChangeModelChange",
            "SedSetValueAttributeModelChange"
          ],
          "target": {
            "value": "//*/@*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Add components",
          "types": [
            "SedAddXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Remove components",
          "types": [
            "SedRemoveXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Change components",
          "types": [
            "SedChangeXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        }
      ],
      "simulationFormats": [
        {
          "namespace": "EDAM",
          "id": "format_3685",
          "version": null,
          "supportedFeatures": []
        }
      ],
      "simulationTypes": [
        "SedUniformTimeCourseSimulation"
      ],
      "archiveFormats": [
        {
          "namespace": "EDAM",
          "id": "format_3686",
          "version": "1",
          "supportedFeatures": []
        }
      ],
      "citations": [
        {
          "title": "CVODE, a stiff/nonstiff ODE solver in C",
          "authors": "Scott D. Cohen, Alan C. Hindmarsh & Paul F. Dubois",
          "journal": "Computers in Physics",
          "volume": "10",
          "issue": "2",
          "pages": "138-143",
          "year": 1996,
          "identifiers": [
            {
              "namespace": "doi",
              "id": "10.1063/1.4822377",
              "url": "https://doi.org/10.1063/1.4822377"
            }
          ]
        }
      ],
      "parameters": [
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000209"
          },
          "id": "relative_tolerance",
          "name": "Relative tolerance",
          "type": "float",
          "value": "0.000001",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000211"
          },
          "id": "absolute_tolerance",
          "name": "Absolute tolerance",
          "type": "float",
          "value": "1e-12",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000220"
          },
          "id": "maximum_bdf_order",
          "name": "Maximum Backward Differentiation Formula (BDF) order",
          "type": "integer",
          "value": "5",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000219"
          },
          "id": "maximum_adams_order",
          "name": "Maximum Adams order",
          "type": "integer",
          "value": "12",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000415"
          },
          "id": "maximum_num_steps",
          "name": "Maximum number of steps",
          "type": "integer",
          "value": "20000",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000467"
          },
          "id": "maximum_time_step",
          "name": "Maximum time step",
          "type": "float",
          "value": null,
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000485"
          },
          "id": "minimum_time_step",
          "name": "Minimum time step",
          "type": "float",
          "value": null,
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000559"
          },
          "id": "initial_time_step",
          "name": "Initial time step",
          "type": "float",
          "value": null,
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000671"
          },
          "id": "stiff",
          "name": "Stiff",
          "type": "boolean",
          "value": "true",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000670"
          },
          "id": "multiple_steps",
          "name": "Multiple steps",
          "type": "boolean",
          "value": "false",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        }
      ],
      "outputDimensions": [
        {
          "namespace": "SIO",
          "id": "SIO_000418"
        }
      ],
      "outputVariablePatterns": [
        {
          "name": "time",
          "symbol": {
            "value": "time",
            "namespace": "urn:sedml:symbol"
          }
        },
        {
          "name": "species concentrations",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species",
            "grammar": "XPath"
          }
        },
        {
          "name": "parameter values",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter",
            "grammar": "XPath"
          }
        },
        {
          "name": "reaction fluxes",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction",
            "grammar": "XPath"
          }
        },
        {
          "name": "compartment sizes",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfCompartments/sbml:compartment",
            "grammar": "XPath"
          }
        }
      ],
      "availableSoftwareInterfaceTypes": [
        "library",
        "command-line application",
        "desktop application",
        "BioSimulators Docker image"
      ],
      "dependencies": [
        {
          "name": "libRoadRunner",
          "version": null,
          "required": true,
          "freeNonCommercialLicense": true,
          "url": "http://libroadrunner.org/"
        },
        {
          "name": "SUNDIALS",
          "version": null,
          "required": true,
          "freeNonCommercialLicense": true,
          "url": "https://computing.llnl.gov/projects/sundials"
        }
      ]
    },
    {
      "id": "euler",
      "name": "Forward Euler method",
      "kisaoId": {
        "namespace": "KISAO",
        "id": "KISAO_0000030"
      },
      "modelingFrameworks": [
        {
          "namespace": "SBO",
          "id": "SBO_0000293"
        }
      ],
      "modelFormats": [
        {
          "namespace": "EDAM",
          "id": "format_2585",
          "version": null,
          "supportedFeatures": []
        }
      ],
      "modelChangePatterns": [
        {
          "name": "Change component attributes",
          "types": [
            "SedAttributeModelChange",
            "SedComputeAttributeChangeModelChange",
            "SedSetValueAttributeModelChange"
          ],
          "target": {
            "value": "//*/@*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Add components",
          "types": [
            "SedAddXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Remove components",
          "types": [
            "SedRemoveXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Change components",
          "types": [
            "SedChangeXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        }
      ],
      "simulationFormats": [
        {
          "namespace": "EDAM",
          "id": "format_3685",
          "version": null,
          "supportedFeatures": []
        }
      ],
      "simulationTypes": [
        "SedUniformTimeCourseSimulation"
      ],
      "archiveFormats": [
        {
          "namespace": "EDAM",
          "id": "format_3686",
          "version": "1",
          "supportedFeatures": []
        }
      ],
      "parameters": [],
      "outputDimensions": [
        {
          "namespace": "SIO",
          "id": "SIO_000418"
        }
      ],
      "outputVariablePatterns": [
        {
          "name": "time",
          "symbol": {
            "value": "time",
            "namespace": "urn:sedml:symbol"
          }
        },
        {
          "name": "species concentrations",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species",
            "grammar": "XPath"
          }
        },
        {
          "name": "parameter values",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter",
            "grammar": "XPath"
          }
        },
        {
          "name": "reaction fluxes",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction",
            "grammar": "XPath"
          }
        },
        {
          "name": "compartment sizes",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfCompartments/sbml:compartment",
            "grammar": "XPath"
          }
        }
      ],
      "availableSoftwareInterfaceTypes": [
        "library",
        "command-line application",
        "desktop application",
        "BioSimulators Docker image"
      ],
      "dependencies": [
        {
          "name": "libRoadRunner",
          "version": null,
          "required": true,
          "freeNonCommercialLicense": true,
          "url": "http://libroadrunner.org/"
        }
      ],
      "citations": []
    },
    {
      "id": "runge_kutta_4",
      "name": "Runge-Kutta fourth order method",
      "kisaoId": {
        "namespace": "KISAO",
        "id": "KISAO_0000032"
      },
      "modelingFrameworks": [
        {
          "namespace": "SBO",
          "id": "SBO_0000293"
        }
      ],
      "modelFormats": [
        {
          "namespace": "EDAM",
          "id": "format_2585",
          "version": null,
          "supportedFeatures": []
        }
      ],
      "modelChangePatterns": [
        {
          "name": "Change component attributes",
          "types": [
            "SedAttributeModelChange",
            "SedComputeAttributeChangeModelChange",
            "SedSetValueAttributeModelChange"
          ],
          "target": {
            "value": "//*/@*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Add components",
          "types": [
            "SedAddXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Remove components",
          "types": [
            "SedRemoveXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Change components",
          "types": [
            "SedChangeXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        }
      ],
      "simulationFormats": [
        {
          "namespace": "EDAM",
          "id": "format_3685",
          "version": null,
          "supportedFeatures": []
        }
      ],
      "simulationTypes": [
        "SedUniformTimeCourseSimulation"
      ],
      "archiveFormats": [
        {
          "namespace": "EDAM",
          "id": "format_3686",
          "version": "1",
          "supportedFeatures": []
        }
      ],
      "parameters": [],
      "outputDimensions": [
        {
          "namespace": "SIO",
          "id": "SIO_000418"
        }
      ],
      "outputVariablePatterns": [
        {
          "name": "time",
          "symbol": {
            "value": "time",
            "namespace": "urn:sedml:symbol"
          }
        },
        {
          "name": "species concentrations",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species",
            "grammar": "XPath"
          }
        },
        {
          "name": "parameter values",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter",
            "grammar": "XPath"
          }
        },
        {
          "name": "reaction fluxes",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction",
            "grammar": "XPath"
          }
        },
        {
          "name": "compartment sizes",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfCompartments/sbml:compartment",
            "grammar": "XPath"
          }
        }
      ],
      "availableSoftwareInterfaceTypes": [
        "library",
        "command-line application",
        "desktop application",
        "BioSimulators Docker image"
      ],
      "dependencies": [
        {
          "name": "libRoadRunner",
          "version": null,
          "required": true,
          "freeNonCommercialLicense": true,
          "url": "http://libroadrunner.org/"
        }
      ],
      "citations": []
    },
    {
      "id": "runge_kutta_45",
      "name": "Fehlberg method",
      "kisaoId": {
        "namespace": "KISAO",
        "id": "KISAO_0000086"
      },
      "modelingFrameworks": [
        {
          "namespace": "SBO",
          "id": "SBO_0000293"
        }
      ],
      "modelFormats": [
        {
          "namespace": "EDAM",
          "id": "format_2585",
          "version": null,
          "supportedFeatures": []
        }
      ],
      "modelChangePatterns": [
        {
          "name": "Change component attributes",
          "types": [
            "SedAttributeModelChange",
            "SedComputeAttributeChangeModelChange",
            "SedSetValueAttributeModelChange"
          ],
          "target": {
            "value": "//*/@*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Add components",
          "types": [
            "SedAddXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Remove components",
          "types": [
            "SedRemoveXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Change components",
          "types": [
            "SedChangeXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        }
      ],
      "simulationFormats": [
        {
          "namespace": "EDAM",
          "id": "format_3685",
          "version": null,
          "supportedFeatures": []
        }
      ],
      "simulationTypes": [
        "SedUniformTimeCourseSimulation"
      ],
      "archiveFormats": [
        {
          "namespace": "EDAM",
          "id": "format_3686",
          "version": "1",
          "supportedFeatures": []
        }
      ],
      "parameters": [
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000485"
          },
          "id": "minimum_time_step",
          "name": "Minimum time step",
          "type": "float",
          "value": "1e-12",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000467"
          },
          "id": "maximum_time_step",
          "name": "Maximum time step",
          "type": "float",
          "value": "1.0",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000597"
          },
          "id": "epsilon",
          "name": "Epsilon",
          "type": "float",
          "value": "0.000000000001",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        }
      ],
      "outputDimensions": [
        {
          "namespace": "SIO",
          "id": "SIO_000418"
        }
      ],
      "outputVariablePatterns": [
        {
          "name": "time",
          "symbol": {
            "value": "time",
            "namespace": "urn:sedml:symbol"
          }
        },
        {
          "name": "species concentrations",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species",
            "grammar": "XPath"
          }
        },
        {
          "name": "parameter values",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter",
            "grammar": "XPath"
          }
        },
        {
          "name": "reaction fluxes",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction",
            "grammar": "XPath"
          }
        },
        {
          "name": "compartment sizes",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfCompartments/sbml:compartment",
            "grammar": "XPath"
          }
        }
      ],
      "availableSoftwareInterfaceTypes": [
        "library",
        "command-line application",
        "desktop application",
        "BioSimulators Docker image"
      ],
      "dependencies": [
        {
          "name": "libRoadRunner",
          "version": null,
          "required": true,
          "freeNonCommercialLicense": true,
          "url": "http://libroadrunner.org/"
        }
      ],
      "citations": []
    },
    {
      "id": "gillespie",
      "name": "Gillespie direct method of the Stochastic Simulation Algorithm (SSA)",
      "kisaoId": {
        "namespace": "KISAO",
        "id": "KISAO_0000029"
      },
      "modelingFrameworks": [
        {
          "namespace": "SBO",
          "id": "SBO_0000295"
        }
      ],
      "modelFormats": [
        {
          "namespace": "EDAM",
          "id": "format_2585",
          "version": null,
          "supportedFeatures": []
        }
      ],
      "modelChangePatterns": [
        {
          "name": "Change component attributes",
          "types": [
            "SedAttributeModelChange",
            "SedComputeAttributeChangeModelChange",
            "SedSetValueAttributeModelChange"
          ],
          "target": {
            "value": "//*/@*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Add components",
          "types": [
            "SedAddXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Remove components",
          "types": [
            "SedRemoveXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Change components",
          "types": [
            "SedChangeXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        }
      ],
      "simulationFormats": [
        {
          "namespace": "EDAM",
          "id": "format_3685",
          "version": null,
          "supportedFeatures": []
        }
      ],
      "simulationTypes": [
        "SedUniformTimeCourseSimulation"
      ],
      "archiveFormats": [
        {
          "namespace": "EDAM",
          "id": "format_3686",
          "version": "1",
          "supportedFeatures": []
        }
      ],
      "citations": [
        {
          "title": "Exact stochastic simulation of coupled chemical reactions",
          "authors": "Daniel T. Gillespie",
          "journal": "Journal of Physical Chemistry",
          "volume": "81",
          "issue": "25",
          "pages": "2340-2361",
          "year": 1977,
          "identifiers": [
            {
              "namespace": "doi",
              "id": "10.1021/j100540a008",
              "url": "https://doi.org/10.1021/j100540a008"
            }
          ]
        }
      ],
      "parameters": [
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000488"
          },
          "id": "seed",
          "name": "Random number generator seed",
          "type": "integer",
          "value": null,
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000673"
          },
          "id": "nonnegative",
          "name": "Skip reactions which would result in negative species amounts",
          "type": "boolean",
          "value": "false",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        }
      ],
      "outputDimensions": [
        {
          "namespace": "SIO",
          "id": "SIO_000418"
        }
      ],
      "outputVariablePatterns": [
        {
          "name": "time",
          "symbol": {
            "value": "time",
            "namespace": "urn:sedml:symbol"
          }
        },
        {
          "name": "species counts",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species",
            "grammar": "XPath"
          }
        },
        {
          "name": "parameter values",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter",
            "grammar": "XPath"
          }
        },
        {
          "name": "reaction fluxes",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction",
            "grammar": "XPath"
          }
        },
        {
          "name": "compartment sizes",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfCompartments/sbml:compartment",
            "grammar": "XPath"
          }
        }
      ],
      "availableSoftwareInterfaceTypes": [
        "library",
        "command-line application",
        "desktop application",
        "BioSimulators Docker image"
      ],
      "dependencies": [
        {
          "name": "libRoadRunner",
          "version": null,
          "required": true,
          "freeNonCommercialLicense": true,
          "url": "http://libroadrunner.org/"
        }
      ]
    },
    {
      "id": "nleq2",
      "name": "Newton-type method for solving non-linear (NL) equations (EQ)",
      "kisaoId": {
        "namespace": "KISAO",
        "id": "KISAO_0000569"
      },
      "modelingFrameworks": [
        {
          "namespace": "SBO",
          "id": "SBO_0000293"
        }
      ],
      "modelFormats": [
        {
          "namespace": "EDAM",
          "id": "format_2585",
          "version": null,
          "supportedFeatures": []
        }
      ],
      "modelChangePatterns": [
        {
          "name": "Change component attributes",
          "types": [
            "SedAttributeModelChange",
            "SedComputeAttributeChangeModelChange",
            "SedSetValueAttributeModelChange"
          ],
          "target": {
            "value": "//*/@*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Add components",
          "types": [
            "SedAddXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Remove components",
          "types": [
            "SedRemoveXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        },
        {
          "name": "Change components",
          "types": [
            "SedChangeXmlModelChange"
          ],
          "target": {
            "value": "//*",
            "grammar": "XPath"
          }
        }
      ],
      "simulationFormats": [
        {
          "namespace": "EDAM",
          "id": "format_3685",
          "version": null,
          "supportedFeatures": []
        }
      ],
      "simulationTypes": [
        "SedSteadyStateSimulation"
      ],
      "archiveFormats": [
        {
          "namespace": "EDAM",
          "id": "format_3686",
          "version": "1",
          "supportedFeatures": []
        }
      ],
      "citations": [
        {
          "title": "A family of Newton codes for systems of highly nonlinear equations - algorithm, implementation, application",
          "authors": "Ulrich Nowak & Lutz Weimann",
          "journal": "Konrad-Zuse-Zentrum für Informationstechnik Berlin",
          "volume": "91-10",
          "year": 1991,
          "identifiers": [
            {
              "namespace": "citeseerx",
              "id": "10.1.1.43.3751",
              "url": "http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.43.3751"
            }
          ]
        },
        {
          "title": "Newton methods for nonlinear problems",
          "authors": "Peter Deuflhard",
          "journal": "Affine Invariance and Adaptive Algorithms",
          "year": 2004,
          "identifiers": [
            {
              "namespace": "doi",
              "id": "10.1007/978-3-642-23899-4",
              "url": "https://doi.org/10.1007/978-3-642-23899-4"
            }
          ]
        }
      ],
      "parameters": [
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000209"
          },
          "id": "relative_tolerance",
          "name": "Relative tolerance",
          "type": "float",
          "value": "1e-12",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000486"
          },
          "id": "maximum_iterations",
          "name": "Maximum number of iterations",
          "type": "integer",
          "value": "100",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000487"
          },
          "id": "minimum_damping",
          "name": "Minimum damping factor",
          "type": "float",
          "value": "1e-20",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000674"
          },
          "id": "allow_presimulation",
          "name": "Presimulate",
          "type": "boolean",
          "value": "false",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000677"
          },
          "id": "presimulation_maximum_steps",
          "name": "Maximum number of steps for presimulation",
          "type": "integer",
          "value": "100",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000680"
          },
          "id": "presimulation_time",
          "name": "Amount of time to pre-simulate",
          "type": "float",
          "value": "100",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000682"
          },
          "id": "allow_approx",
          "name": "Whether to find an approximate solution if an exact solution could not be found",
          "type": "boolean",
          "value": "false",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000683"
          },
          "id": "approx_tolerance",
          "name": "Tolerance for finding an approximate solution",
          "type": "float",
          "value": "0.000001",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000678"
          },
          "id": "approx_maximum_steps",
          "name": "Maximum number of steps for finding an approximate solution",
          "type": "integer",
          "value": "10000",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000679"
          },
          "id": "approx_time",
          "name": "Maximum amount of time to spend finding finding an approximate solution",
          "type": "float",
          "value": "10000",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000675"
          },
          "id": "broyden_method",
          "name": "Broyden method",
          "type": "integer",
          "value": "0",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        },
        {
          "kisaoId": {
            "namespace": "KISAO",
            "id": "KISAO_0000676"
          },
          "id": "linearity",
          "name": "Degree of linearity of the system",
          "type": "integer",
          "value": "3",
          "recommendedRange": null,
          "availableSoftwareInterfaceTypes": [
            "library",
            "command-line application",
            "desktop application",
            "BioSimulators Docker image"
          ]
        }
      ],
      "outputDimensions": [],
      "outputVariablePatterns": [
        {
          "name": "species concentrations",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species",
            "grammar": "XPath"
          }
        },
        {
          "name": "parameter values",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter",
            "grammar": "XPath"
          }
        },
        {
          "name": "reaction fluxes",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction",
            "grammar": "XPath"
          }
        },
        {
          "name": "compartment sizes",
          "target": {
            "value": "/sbml:sbml/sbml:model/sbml:listOfCompartments/sbml:compartment",
            "grammar": "XPath"
          }
        }
      ],
      "availableSoftwareInterfaceTypes": [
        "library",
        "command-line application",
        "desktop application",
        "BioSimulators Docker image"
      ],
      "dependencies": [
        {
          "name": "libRoadRunner",
          "version": null,
          "required": true,
          "freeNonCommercialLicense": true,
          "url": "http://libroadrunner.org/"
        }
      ]
    }
  ],
  "interfaceTypes": [
    "library",
    "command-line application",
    "desktop application",
    "BioSimulators Docker image"
  ],
  "supportedOperatingSystemTypes": [
    "platform-independent"
  ],
  "supportedProgrammingLanguages": [
    {
      "namespace": "Linguist",
      "id": "Python"
    },
    {
      "namespace": "Linguist",
      "id": "C"
    },
    {
      "namespace": "Linguist",
      "id": "C++"
    },
    {
      "namespace": "Linguist",
      "id": "C#"
    }
  ],
  "funding": [
    {
      "funder": {
        "namespace": "FunderRegistry",
        "id": "100000057"
      },
      "grant": "R01-GM123032",
      "url": "https://grantome.com/grant/NIH/R01-GM123032"
    },
    {
      "funder": {
        "namespace": "FunderRegistry",
        "id": "100000057"
      },
      "grant": "R01-GM081070",
      "url": "https://grantome.com/grant/NIH/R01-GM081070"
    }
  ],
  "biosimulators": {
    "specificationVersion": "1.0.0",
    "imageVersion": "1.0.0",
    "validated": false,
    "validationTests": null
  }
}
```
--8<-- "glossary.md"