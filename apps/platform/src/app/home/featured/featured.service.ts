import { Injectable } from '@angular/core';
import { FeaturedProject } from './featured.model';

@Injectable()
export class FeaturedService {
  private ecoli = {
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

  projects = [this.mouse, this.ecoli, this.yeast, this.calcium];

  public getProjects(): FeaturedProject[] {
    return this.projects;
  }
}
