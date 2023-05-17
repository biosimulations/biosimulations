import { Injectable } from '@angular/core';
import { FeaturedProject } from './featured.model';

@Injectable()
export class FeaturedService {
  private simulators = {
    title: 'Browse Simulators',
    image: 'https://biosimulators.org/assets/images/biosimulators-logo/logo-white.svg',
    id: 'simulators',
    description:
      'Browse a free registry of biosimulation tools. The registry includes tools for a broad range of frameworks (e.g., logical, kinetic), simulation algorithms (e.g., FBA, SSA), and model formats (e.g., BNGL, CellML, NeuroML/LEMS, SBML, Smoldyn). ',
  };
  private simulations = {
    title: 'Browse Simulations',
    image: 'https://biosimulations.org/assets/images/biosimulations-logo/logo-white.svg',
    id: 'simulations',
    description:
      'Browse a free platform for sharing and re-using biomodels, simulations, simulation results, and visualizations of simulation results.',
  };
  private runSimulations = {
    title: 'Run Simulations',
    image: 'https://run.biosimulations.org/assets/images/runbiosimulations-logo/logo-white.svg',
    id: 'runSimulations',
    description:
      'Interact with a free tool for running a wide range of biological simulations. Through the BioSimulators registry of biosimulation tools, runBioSimulations supports a broad range of modeling frameworks (e.g., logical, kinetic), simulation algorithms (e.g., FBA, SSA), modeling formats (e.g., SBML, SED-ML), and simulation tools (e.g., COBRApy, COPASI).',
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

  projects = [this.simulators, this.simulations, this.runSimulations];

  public getProjects(): FeaturedProject[] {
    return this.projects;
  }
}
