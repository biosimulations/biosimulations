import { Injectable } from '@angular/core';
import { FeaturedProject } from './featured.model';

@Injectable()
export class FeaturedService {
  private simulations = {
    title: 'Browse Simulations',
    image: 'https://t4.ftcdn.net/jpg/05/06/41/89/360_F_506418953_5R5MQsN4UJ4hLgqnKlltS44wbQ33LhIU.jpg',
    id: 'simulations',
    description:
      'Browse a free platform for sharing and re-using biomodels, simulations, simulation results, and visualizations of simulation results.',
  };
  private runSimulations = {
    title: 'Run Simulations',
    image:
      'https://media.istockphoto.com/id/1044292966/vector/defocused-abstract-blue-and-green-background.jpg?s=612x612&w=0&k=20&c=uGYwjo_xxESBI1bsjpSi1RbT_1PYkaD74aodUJeYmVc=',
    id: 'runSimulations',
    description:
      'Interact with a free tool for running a wide range of biological simulations. Through the BioSimulators registry of biosimulation tools, runBioSimulations supports a broad range of modeling frameworks (e.g., logical, kinetic), simulation algorithms (e.g., FBA, SSA), modeling formats (e.g., SBML, SED-ML), and simulation tools (e.g., COBRApy, COPASI).',
  };
  private publishSimulations = {
    title: 'Submit Your Simulation for publication',
    image:
      'https://media.istockphoto.com/id/1139402489/vector/abstract-modern-background.jpg?s=612x612&w=0&k=20&c=GAkYFnGct6FJJdPFF-EfP3KGkQ5p0g7tAA8gAUYuYwI=',
    id: 'publishSimulations',
    description: 'Validate and publish your very own simulation project.',
  };
  private learnSimulations = {
    title: 'Learn',
    image:
      'https://images.unsplash.com/photo-1557682250-33bd709cbe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80',
    id: 'learnSimulations',
    description: 'Browse our tutorials and learn how to run your own simulation.',
  };
  private convertFile = {
    title: 'Convert a file',
    image: 'https://img.freepik.com/free-photo/golden-yellow-seamless-venetian-plaster-background_24972-294.jpg?w=2000',
    id: 'convertFile',
    description: 'Connect the outputs of SED-ML reports to the inputs of Vega data sets.',
  };
  private community = {
    title: 'Community',
    image:
      'https://media.istockphoto.com/id/1185382671/vector/abstract-blurred-colorful-background.jpg?s=612x612&w=0&k=20&c=3YwJa7lCw-cQ-hviINULUokL9lYU4RuGjMP_E_0N8E4=',
    id: 'community',
    description: 'Learn more about the Biosimulations community and our partners.',
  };
  /*  private ecoli = {
    title: 'Escherichia coli K-12 resource allocation',
    citation: '(Bulović et al., Metab Eng, 2019)',
    id: 'Escherichia-coli-resource-allocation-Bulovic-Metab-Eng-2019',
    image: 'https://api.biosimulations.dev/files/61fea45e323a8efc42010503/FigureS13.jpg/download/?thumbnail=browse',
    description: 'A Resource Balance Analysis (RBA) model of wildtype Escherichia coli K-12.',
  };
  private yeast = {
    title: 'Budding yeast cell cycle',
    citation: '(Irons, J Theor Biol, 2009)',
    description:
      'Boolean model of the budding yeast cell cycle. The model is consistent with a wide range of wild type and mutant phenotypes and shows remarkable robustness against perturbations, both to reaction times and the states of component genes/proteins.',
    image: 'https://api.biosimulations.dev/files/61fea45614ff5e356d426b71/Figure2.jpg/download/?thumbnail=browse',
    id: 'Yeast-cell-cycle-Irons-J-Theor-Biol-2009',
  };
  private mouse = {
    title: 'Mouse iron distribution',
    citation: '(Parmar et al., BMC Syst Biol, 2017)',
    id: 'Iron-distribution-Parmar-BMC-Syst-Biol-2017',
    image: 'https://api.biosimulations.dev/files/61fea46614ff5e356d426b89/Figure1.jpg/download/?thumbnail=browse',
    description:
      'Dynamic model of iron distribution in mice. This model includes normal iron and radioactive labelled tracer iron species and was used for parameter estimation given the data from Lopes et al. 2010 for mice fed an adequate iron diet.',
  };

  private calcium = {
    title: 'Calcium-induced NFAT translocation',
    citation: '(Tomida et al., EMBO J, 2003)',
    id: 'NFAT-translocation-Tomida-EMBO-J-2003',
    image: 'https://api.biosimulations.dev/files/61fea46d323a8efc42010524/Figure3a.jpg/download/?thumbnail=view',
    description:
      'Model of the kinetics of dephosphorylation and translocation of NFAT. The model captures the rapid Ca(2+)-dependent dephosphorylation of NFAT and its slow rephosphorylation and nuclear transport which govern the lifetime of NFAT in the cytoplasm.',
  };

  projects = [this.mouse, this.ecoli, this.yeast, this.calcium];*/

  projects = [
    this.simulations,
    this.runSimulations,
    this.publishSimulations,
    this.learnSimulations,
    this.convertFile,
    this.community,
  ];

  public getProjects(): FeaturedProject[] {
    return this.projects;
  }
}
