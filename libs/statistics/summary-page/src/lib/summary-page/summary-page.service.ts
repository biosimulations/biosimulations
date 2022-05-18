import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { StatItem, StatsChartType } from '../summary-page.model';

// TODO remove temp data generator

function randn_bm(): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
  return num;
}

function getRandomDist(count = 10) {
  const data: number[] = [];
  for (let i = 0; i < count; i++) {
    data.push(randn_bm());
  }
  return data;
}

@Injectable({
  providedIn: 'root',
})
export class SummaryPageService {
  constructor() {}
  public getModelStatItems(): Observable<StatItem[]> {
    return of([
      {
        heading: 'Modeling formats',
        subheading: 'BioSimulations contains many model formats',
        icon: 'model',
        chart: {
          type: StatsChartType.histogram,
          title: 'Modeling Format',
          label: 'Format',
          labels: ['SBML', 'CellML', 'BNGL', 'VCell-ML'],
          values: getRandomDist(4).map((x) => x * 100),
        },
      },
      {
        heading: 'Community repositories',
        subheading: 'BioSimulations contains models from many community repositories',
        icon: 'repository',
        chart: {
          type: StatsChartType.histogram,
          title: 'Projects by Repository',
          label: 'Repository',
          labels: ['BioModels', 'Physiome', 'RuleHub', 'ModelDB', 'BiGG'],
          values: getRandomDist(5).map((x) => x * 100),
        },
      },
      {
        heading: 'Contributors',
        subheading: 'BioSimulations relies on community contributions and curators',
        icon: 'author',
        chart: {
          type: StatsChartType.histogram,
          title: 'Top Contributors',
          label: 'Contributor',
          labels: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'],
          values: getRandomDist(4).map((x) => x * 100),
        },
      },
      {
        heading: 'Licensing',
        subheading: 'BioSimulations enables authors to publish models under many licenses',
        icon: 'license',
        chart: {
          type: StatsChartType.histogram,
          title: 'Top Licenses',
          label: 'License',
          labels: ['CC-BY-NC-SA', 'CC-BY-NC-ND', 'CC-BY-NC', 'CC-BY-SA', 'CC-BY-ND', 'GPL'],
          values: getRandomDist(6).map((x) => x * 100),
        },
      },
    ]);
  }
  public getSimulationStatItems(): Observable<StatItem[]> {
    const randomSizes = getRandomDist(300)
      .map((x) => x * 100)
      .sort((a, b) => a - b);
    const randomSizesLabel = randomSizes.map((x) => `${String(x).slice(0, 3)}mb`);
    const item: StatItem[] = [
      {
        heading: 'Simulation frameworks',
        subheading: 'BioSimulations contains many simulation frameworks',
        icon: 'framework',
        chart: {
          type: StatsChartType.pie,
          title: 'Simulation Framework',
          label: 'Framework',
          labels: ['FluxBalance', 'ODE', 'Stochastic', 'Spatial'],
          values: getRandomDist(6).map((x) => x * 100),
        },
      },
      {
        heading: 'Simulation Tools',
        subheading: 'BioSimulations supports numerous simulation tools',
        icon: 'simulators',
        chart: {
          type: StatsChartType.histogram,
          title: 'Simulation Tools',
          label: 'Tool',
          labels: ['VCell', 'Tellurium', 'Copasi', 'Smoldyn'],
          values: getRandomDist(6).map((x) => x * 100),
        },
      },
      {
        heading: 'Simulation Algorithms',
        subheading: 'BioSimulations supports many simulation algorithms',
        icon: 'math',
        chart: {
          type: StatsChartType.pie,
          title: 'Simulation Algorithm',
          label: 'Size',
          labels: ['CVODE', 'Euler', 'RK4', 'Rosenbrock', 'Runge-Kutta', 'ODE'],
          values: getRandomDist(),
        },
      },
      {
        heading: 'Simulation Size',
        subheading: 'BioSimulations support a wide range of simulation sizes',
        icon: 'download',
        hidden: true,
        chart: {
          type: StatsChartType.distribution,
          title: 'Number of Projects by Size',
          label: 'Size',
          labels: randomSizesLabel,
          values: randomSizes,
        },
      },
    ];

    return of(item.filter((item) => !item.hidden));
  }

  public getBiologyStatItems(): Observable<StatItem[]> {
    return of([
      {
        heading: 'Model Species',
        subheading: 'BioSimulations contains models from various species',
        icon: 'taxon',
        chart: {
          type: StatsChartType.histogram,
          title: 'Model Taxon',
          label: 'Species',
          labels: ['Homo Sapiens', 'Escherichia Coli', 'Helix Pomatia', 'Mus Musculus', 'Plasmodium Vivax'],
          values: getRandomDist().map((x) => x * 100),
        },
      },
      {
        heading: 'Model Systems',
        subheading: 'BioSimulations represent various biological systems',
        icon: 'cell',
        chart: {
          type: StatsChartType.histogram,
          title: 'Number of Projects by Biology Encoded',
          label: 'Size',
          labels: ['Action Potentials', 'Ion Channels', 'Cell Signaling', 'Calcium'],
          values: getRandomDist().map((x) => x * 100),
        },
      },
    ]);
  }
}
