import { Injectable } from '@angular/core';
import { FeaturedProject } from './featured.model';

@Injectable()
export class FeaturedService {
  private simulations = {
    title: 'Browse Simulations',
    image: 'assets/images/default-resource-images/browse.jpg',
    id: 'simulations',
    descriptionTeaser: 'BioSimulation Projects: a database of published simulation runs',
    descriptionVerbose: `BioSimulation Projects is a searchable database of rigorously curated simulation projects \
      from published works. Each project has been meticulously resimulated to accurately reproduce and validate the \
      originally published outcomes, contributing to the advancement of reproducible research in the field.`,
    routingLink: ['/projects'],
    logo: 'simulators',
    headerColor: 'rgb(33, 150, 243)',
    color: 'rgba(33, 150, 243, 0.85)',
    textColor: 'white',
    useInternalRouting: true,
  };
  private runSimulations = {
    title: 'RunBioSimulations',
    image: 'assets/images/default-resource-images/run.jpg',
    id: 'runSimulations',
    descriptionTeaser: 'Execute custom simulations online',
    descriptionVerbose:
      'RunBioSimulations is a web application for running biosimulations on our shared computational resources.',
    routingLink: ['/runs/new'],
    logo: 'experiment',
    headerColor: 'rgb(255, 152, 0)',
    color: 'rgba(255, 152, 0, 0.85)',
    textColor: 'white',
    useInternalRouting: true,
  };
  private publishSimulations = {
    title: 'Submit Your Simulation for publication',
    image: 'assets/images/default-resource-images/publish.jpg',
    id: 'publishSimulations',
    descriptionTeaser: 'Submit a simulation for publication on BioSimulation Projects',
    descriptionVerbose: `Simulations that have been published in papers are invited to be submitted to the \
      BioSimulation Project Database. This makes the full simulation run available to the public, verifying \
      its reproducibility and allowing anyone to download and rerun the simulation.`,
    routingLink: ['/utils/create-project'],
    logo: 'publish',
    headerColor: '#388E3C',
    color: 'rgba(0, 128, 0, 0.85)',
    textColor: 'white',
    useInternalRouting: true,
    mobileTitle: 'Submit for Publication',
  };
  private learnSimulations = {
    title: 'Learn',
    image: 'assets/images/default-resource-images/learn.png',
    id: 'learnSimulations',
    descriptionTeaser: 'Step Into the Docs.',
    descriptionVerbose: `A guide for using BioSimulations and BioSimulators to create, publish, and \
      find simulation projects and simulation tools.`,
    routingLink: 'https://docs.biosimulations.org/developers/setup/getting-started/',
    logo: 'idea',
    color: 'rgba(149, 30, 217, 0.85)',
    headerColor: 'rgb(0, 150, 136)',
    textColor: 'white',
  };
  private convertFile = {
    title: 'Convert a file',
    image: 'assets/images/default-resource-images/convert.jpg',
    id: 'convertFile',
    descriptionTeaser: 'Utilities for converting diagrams into visualizations of simulation results',
    descriptionVerbose: `BioSimulators-utils provides a command-line program and Python API for \
      converting diagrams in multiple formats into Vega data visualizations.`,
    routingLink: ['/utils/convert-file'],
    logo: 'link',
    headerColor: '#ef2c22',
    color: 'rgba(244, 67, 54, 0.85)',
    textColor: 'white',
    useInternalRouting: true,
  };
  private restAPI = {
    title: 'REST API',
    image: 'assets/images/default-resource-images/api.png',
    id: 'community',
    descriptionTeaser: 'Documentation of our API endpoints',
    descriptionVerbose: `Swagger page provides developers with a detailed and interactive documentation of \
      our API endpoints, simplifying the integration process and offering an intuitive interface for \
      executing services, which facilitates efficient interaction with our platform's functionalities and resources.`,
    routingLink: 'https://api.biosimulations.org',
    logo: 'idea',
    headerColor: '#951ed9',
    color: 'rgba(0, 150, 136, 0.85)',
    textColor: 'white',
  };
  /*private runCustomizedSimulation = {
    title: 'Run a customized simulation',
    image: `https://images.rawpixel.com/image_1300 \
       /czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvcGQ0My0wNjA0LTA2Ni1uYW1fMC5qcGc.jpg`,
    id: 'runCustomizedSimulation',
    descriptionTeaser: 'Tailor-Made Discoveries with Run a Customized Simulation',
    descriptionVerbose: `Venture into \
      uncharted territories with our Run a Customized Simulation feature. This tool gives you the ability to \
      tweak existing simulations, run them anew, and garner unique results based on your parameters. Let curiosity \
      be your guide as you navigate through the rich tapestry of biological data and explore your custom scenarios \
      with 'Run a Customized Simulation'. We will start you off with the project \
      "Mouse Iron distribution(Parmar et al., BMC Syst Biol, 2017)".`,
    routingLink: `
       https://run.biosimulations.org/runs/new \
       ?projectUrl=https:%2F%2Fapi.biosimulations.org%2Fruns%2F61fea49049420059835774e3%2Fdownload \
       &simulator=pysces&simulatorVersion=1.0.0\
       &runName=Iron%20distribution%20(Parmar%20et%20al.,%20BMC%20Syst%20Biol,%202017;%20SBML;%20CVODE;%20PySCeS)%20(rerun)
      `,
    logo: 'experiment',
    headerColor: 'green',
    color: 'green',
    textColor: 'white',
  };*/

  public projects = [
    this.simulations,
    this.runSimulations,
    this.publishSimulations,
    this.learnSimulations,
    this.convertFile,
    this.restAPI,
    /* this.runCustomizedSimulation */
  ];

  private getSingleProject(i: number): FeaturedProject {
    return this.projects[i];
  }

  public getProjects(): FeaturedProject[] {
    return this.projects;
  }
}
