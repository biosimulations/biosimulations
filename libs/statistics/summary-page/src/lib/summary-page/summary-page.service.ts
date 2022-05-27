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

  public getSourceStatItems(): Observable<StatItem[]> {
    return of([
      {
        heading: 'Contributors',
        subheading: 'BioSimulations integrates projects from many contributors',
        icon: 'author',
        chart: {
          type: StatsChartType.histogram,
          title: 'Top contributors',
          label: 'Contributor',
          labels: ['John Doe', 'Jane Doe', 'John Smith', 'Jane Smith'],
          values: getRandomDist(4).map((x) => x * 100),
        },
      },
      {
        heading: 'Primary model repositories',
        subheading: 'BioSimulations integrates models from multiple repositories',
        icon: 'repository',
        chart: {
          type: StatsChartType.histogram,
          title: 'Primary repositories',
          label: 'Repository',
          labels: ['BioModels', 'Physiome', 'RuleHub', 'ModelDB', 'BiGG'],
          values: getRandomDist(5).map((x) => x * 100),
        },
      },
      {
        heading: 'Licenses',
        subheading: 'The projects in BioSimulations are available under a variety of licenses',
        icon: 'license',
        chart: {
          type: StatsChartType.histogram,
          title: 'Licenses',
          label: 'License',
          labels: ['CC-BY-NC-SA', 'CC-BY-NC-ND', 'CC-BY-NC', 'CC-BY-SA', 'CC-BY-ND', 'GPL'],
          values: getRandomDist(6).map((x) => x * 100),
        },
      },
    ]);
  }

  public getSimulationStatItems(): Observable<StatItem[]> {
    const item: StatItem[] = [
      {
        heading: 'Modeling frameworks',
        subheading: 'BioSimulations contains projects involving numerous frameworks',
        icon: 'framework',
        chart: {
          type: StatsChartType.pie,
          title: 'Modeling frameworks',
          label: 'Framework',
          labels: ['Flux balance', 'ODE', 'Stochastic', 'Spatial'],
          values: getRandomDist(6).map((x) => x * 100),
        },
      },
      {
        heading: 'Simulation algorithms',
        subheading: 'BioSimulations contains projects involving numerous algorithms',
        icon: 'math',
        chart: {
          type: StatsChartType.pie,
          title: 'Simulation algorithms',
          label: 'Size',
          labels: ['CVODE', 'Euler', 'RK4', 'Rosenbrock', 'Runge-Kutta', 'ODE'],
          values: getRandomDist(),
        },
      },
      {
        heading: 'Model formats',
        subheading: 'BioSimulations contains projects involving numerous formats',
        icon: 'file',
        chart: {
          type: StatsChartType.histogram,
          title: 'Model formats',
          label: 'Format',
          labels: ['SBML', 'CellML', 'BNGL', 'VCell-ML'],
          values: getRandomDist(4).map((x) => x * 100),
        },
      },
      {
        heading: 'Simulation tools',
        subheading: 'BioSimulations contains projects involving numerous tools',
        icon: 'simulators',
        chart: {
          type: StatsChartType.histogram,
          title: 'Simulation tools',
          label: 'Tool',
          labels: ['VCell', 'Tellurium', 'Copasi', 'Smoldyn'],
          values: getRandomDist(6).map((x) => x * 100),
        },
      },
    ];

    return of(item.filter((item) => !item.hidden));
  }

  public getBiologyStatItems(): Observable<StatItem[]> {
    const randomSizes = getRandomDist(300)
      .map((x) => x * 100)
      .sort((a, b) => a - b);
    const randomSizesLabel = randomSizes.map((x) => `${String(x).slice(0, 3)}mb`);
    return of([
      {
        heading: 'Organisms',
        subheading: 'BioSimulations contains models of various species',
        icon: 'taxon',
        chart: {
          type: StatsChartType.histogram,
          title: 'Organisms',
          label: 'Species',
          labels: ['Homo sapiens', 'Escherichia coli', 'Helix pomatia', 'Mus musculus', 'Plasmodium vivax'],
          values: getRandomDist(5).map((x) => x * 100),
        },
      },
      {
        heading: 'Systems',
        subheading: 'BioSimulations contains models of various systems',
        icon: 'model',
        chart: {
          type: StatsChartType.histogram,
          title: 'Systems',
          label: 'Size',
          labels: ['Action potentials', 'Ion channels', 'Cell signaling', 'Calcium'],
          values: getRandomDist(4).map((x) => x * 100),
        },
      },
      {
        heading: 'Project sizes',
        subheading: 'The projects in BioSimulations span a broad range of sizes',
        icon: 'file',
        hidden: true,
        chart: {
          type: StatsChartType.distribution,
          title: 'Size',
          label: 'Size',
          labels: randomSizesLabel,
          values: randomSizes,
        },
      },
    ]);
  }
}
