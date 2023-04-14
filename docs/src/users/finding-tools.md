# Finding simulation tools

<script type="application/ld+json">{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to build and execute simulation projects",
  "abstract": "Guide to building simulation projects with the Simulation Experiment Description Markup Language (SED-ML) and COMBINE/OMEX archive format, finding simulation tools capable of executing specific projects, and using those tools to execute simulations.",
  "keywords": [
    "computational biology",
    "systems biology",
    "mathematical model",
    "numerical simulation",
    "COMBINE",
    "OMEX",
    "Simulation Experiment Description Markup Language",
    "SED-ML",
    "CellML",
    "Systems Biology Markup Language",
    "SBML",
    "Kinetic Simulation Algorithm Ontology",
    "KiSAO",
    "Hierarchical Data Format",
    "HDF5"
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "BioSimulations",
      "description": "Open registry of biological simulation projects and web application for executing biological simulations.",
      "url": "https://biosimulations.org"
    },
    {
      "@type": "HowToTool",
      "name": "BioSimulators",
      "description": "Open registry of biological simulation software tools.",
      "url": "https://biosimulators.org"
    },
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Find or build a simulation project.",
      "text": "Obtain a project from a repository such as BioSimulations or use a tool such as runBioSimulations to encode a simulation experiment into the Simulation Experiment Markup Language (SED-ML) and COMBINE/OMEX archive format."
    },
    {
      "@type": "HowToStep",
      "name": "Find a simulation tool that has the capabilities to execute the simulation project.",
      "text": "Use the BioSimulators registry or the runBioSimulations simulator recommendation tool to find a simulation tool that supports the model formats, modeling frameworks, and simulation algorithms required for the project."
    },
    {
      "@type": "HowToStep",
      "name": "Obtain the simulation tool.",
      "text": "Navigate your browser to runBioSimulations, or use Docker or pip to install the simulation tool onto your own machine."
    },
    {
      "@type": "HowToStep",
      "name": "Use the simulation tool to execute the simulation and export its outputs.",
      "text": "Follow the online instructions for runBioSimulations or use the Docker image or Python package to execute the project."
    },
    {
      "@type": "HowToStep",
      "name": "Visualize and analyze the simulation results.",
      "text": "View the generated visualizations in the runBioSimulations web application or the generated PDF files."
    }
  ],
  "educationalLevel": "advanced",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "value": 0,
    "currency": "USD"
  }
}</script><script type="application/ld+json">{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to build and execute simulation projects",
  "abstract": "Guide to building simulation projects with the Simulation Experiment Description Markup Language (SED-ML) and COMBINE/OMEX archive format, finding simulation tools capable of executing specific projects, and using those tools to execute simulations.",
  "keywords": [
    "computational biology",
    "systems biology",
    "mathematical model",
    "numerical simulation",
    "COMBINE",
    "OMEX",
    "Simulation Experiment Description Markup Language",
    "SED-ML",
    "CellML",
    "Systems Biology Markup Language",
    "SBML",
    "Kinetic Simulation Algorithm Ontology",
    "KiSAO",
    "Hierarchical Data Format",
    "HDF5"
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "BioSimulations",
      "description": "Open registry of biological simulation projects and web application for executing biological simulations.",
      "url": "https://biosimulations.org"
    },
    {
      "@type": "HowToTool",
      "name": "BioSimulators",
      "description": "Open registry of biological simulation software tools.",
      "url": "https://biosimulators.org"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Find or build a simulation project.",
      "text": "Obtain a project from a repository such as BioSimulations or use a tool such as runBioSimulations to encode a simulation experiment into the Simulation Experiment Markup Language (SED-ML) and COMBINE/OMEX archive format."
    },
    {
      "@type": "HowToStep",
      "name": "Find a simulation tool that has the capabilities to execute the simulation project.",
      "text": "Use the BioSimulators registry or the runBioSimulations simulator recommendation tool to find a simulation tool that supports the model formats, modeling frameworks, and simulation algorithms required for the project."
    },
    {
      "@type": "HowToStep",
      "name": "Obtain the simulation tool.",
      "text": "Navigate your browser to runBioSimulations, or use Docker or pip to install the simulation tool onto your own machine."
    },
    {
      "@type": "HowToStep",
      "name": "Use the simulation tool to execute the simulation and export its outputs.",
      "text": "Follow the online instructions for runBioSimulations or use the Docker image or Python package to execute the project."
    },
    {
      "@type": "HowToStep",
      "name": "Visualize and analyze the simulation results.",
      "text": "View the generated visualizations in the runBioSimulations web application or the generated PDF files."
    }
  ],
  "educationalLevel": "advanced",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "value": 0,
    "currency": "USD"
  }
}</script>

## Finding a simulation tool that is capable of executing a modeling project
The simulation tools in the BioSimulators collection support different model formats, modeling frameworks, simulation types, simulation algorithms, and observables. To find a simulation tool, use the following steps:

1. Determine the format and framework of your model, and identify the simulation type and algorithm that you would like to execute. 
1. Browse the [simulators](https://biosimulators.org/simulators) to identify a tool which can execute your project. 

BioSimulations provides a [utility](https://biosimulations.org/utils/suggest-simulator) to recommend a simulation tool for specific combinations of model formats, modeling frameworks, simulation types, and simulation algorithms.

## Programmatically retrieving information about simulation tools via the REST API

An API is available for retrieving information about the simulation tools in the BioSimulators collection. Please see the [documentation](https://api.biosimulators.org/) for the REST API for more information.

An interactive tutorial for using the API is available from [Binder](https://tutorial.biosimulators.org/).

--8<-- "glossary.md"
