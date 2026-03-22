import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatisticType } from '@biosimulations/statistics-datamodel';

import { combineLatest, map, Observable } from 'rxjs';
import { StatItem, StatsChartType } from '../summary-page.model';
import { Endpoints } from '@biosimulations/config/common';

@Injectable({
  providedIn: 'root',
})
export class SummaryPageService {
  private endpoints = new Endpoints();
  private apiEndpoint = this.endpoints.getProjectStatisticsEndpoint();

  public constructor(private http: HttpClient) {}

  public getSourceStatItems(): Observable<StatItem[]> {
    const contributors = this.getStat('contributors', 10, false);
    const repositories = this.getStat('repositories', 10, false);
    const licenses = this.getStat('licenses', 10, false);

    const stats: Observable<StatisticType[]> = combineLatest([contributors, repositories, licenses]);
    const items: Observable<StatItem[]> = stats.pipe(
      map((stats) => {
        return [
          {
            heading: 'Contributors',
            subheading: 'BioSimulations contains projects by numerous contributors',
            icon: 'author',
            chart: {
              type: StatsChartType.histogram,
              yAxis: 'logarithmic',
              yLabelRotation: 30,
              title: 'Contributors',
              label: 'Contributor',
              labels: stats[0].labels,
              values: stats[0].values,
            },
          },
          {
            heading: 'Repositories',
            subheading: 'BioSimulations contains projects from numerous repositories',
            icon: 'repository',
            chart: {
              type: StatsChartType.histogram,
              yLabelRotation: 30,
              yAxis: 'logarithmic',
              title: 'Repositories',
              label: 'Repository',
              labels: stats[1].labels.map((repo) => (repo.includes('Physiome') ? 'Physiome' : repo)),
              values: stats[1].values,
            },
          },
          {
            heading: 'Licenses',
            subheading: 'BioSimulations contains models licensed under a variety of licenses',
            icon: 'license',
            chart: {
              yAxis: 'logarithmic',
              yLabelRotation: 30,
              type: StatsChartType.histogram,
              title: 'Licenses',
              label: 'License',
              labels: stats[2].labels,
              values: stats[2].values,
            },
          },
        ];
      }),
    );

    return items;
  }

  public getSimulationStatItems(): Observable<StatItem[]> {
    const frameworks = this.getStat('frameworks', 6, false);
    const algorithms = this.getStat('algorithms', 6, false);
    const formats = this.getStat('formats', 6, false);
    const tools = this.getStat('simulators', 10, false);

    const stats: Observable<StatisticType[]> = combineLatest([frameworks, algorithms, formats, tools]);
    const items: Observable<StatItem[]> = stats.pipe(
      map((stats) => {
        return [
          {
            heading: 'Frameworks',
            subheading: 'BioSimulations contains simulations using numerous frameworks',
            icon: 'framework',
            chart: {
              yAxis: 'logarithmic',
              yLabelRotation: 30,
              type: StatsChartType.histogram,
              title: 'Frameworks',
              label: 'Framework',
              labels: stats[0].labels.map(this.processFramework.bind(this)),
              values: stats[0].values,
            },
          },
          {
            heading: 'Algorithms',
            subheading: 'BioSimulations contains simulations using numerous algorithms',
            icon: 'math',
            chart: {
              yLabelRotation: 30,
              type: StatsChartType.histogram,
              yAxis: 'logarithmic',
              title: 'Algorithms',
              label: 'Algorithm',
              labels: stats[1].labels,
              values: stats[1].values,
            },
          },
          {
            heading: 'Formats',
            subheading: 'BioSimulations contains models in numerous formats',
            icon: 'format',

            chart: {
              yLabelRotation: 30,
              type: StatsChartType.histogram,
              yAxis: 'logarithmic',
              title: 'Formats',
              label: 'Format',
              labels: stats[2].labels,
              values: stats[2].values,
            },
          },
          {
            heading: 'Tools',
            subheading: 'BioSimulations contains simulations using numerous tools',
            icon: 'simulators',
            chart: {
              yAxis: 'logarithmic',
              yLabelRotation: 30,
              type: StatsChartType.histogram,
              title: 'Tools',
              label: 'Tool',
              labels: stats[3].labels,
              values: stats[3].values,
            },
          },
        ];
      }),
    );

    return items;
  }

  public getBiologyStatItems(): Observable<StatItem[]> {
    const organisms = this.getStat('taxons', 6, false);
    const systems = this.getStat('systems', 6, false);
    const sizes = this.getStat('sizes', 0, true);
    const stats: Observable<StatisticType[]> = combineLatest([organisms, systems, sizes]);
    const items: Observable<StatItem[]> = stats.pipe(
      map((stats) => {
        return [
          {
            heading: 'Organisms',
            subheading: 'BioSimulations contains models of various organisms',
            icon: 'taxon',
            chart: {
              yLabelRotation: 30,
              type: StatsChartType.histogram,
              yAxis: 'logarithmic',
              title: 'Organisms',
              label: 'Organism',
              labels: stats[0].labels.map((label) => {
                const genus = label.split(' ')[0];
                const species = label.split(' ')[1];
                const genusInitial = genus.charAt(0);
                return `${genusInitial}. ${species}`;
              }),
              values: stats[0].values,
            },
          },
          {
            heading: 'Systems',
            subheading: 'BioSimulations contains models of various biological systems',
            icon: 'model',
            chart: {
              type: StatsChartType.histogram,
              yLabelRotation: 30,
              title: 'Systems',
              label: 'System',
              labels: stats[1].labels,
              values: stats[1].values,
            },
          },
          {
            heading: 'Sizes',
            subheading: 'BioSimulations contains projects over a range of sizes',
            icon: 'download',
            chart: {
              type: StatsChartType.counter,
              title: 'Sizes',
              label: 'Size',
              yLabelRotation: 30,
              labels: stats[2].labels.map((label, index) =>
                index === stats[2].labels.length - 1
                  ? `> ${this.formatSize(stats[2].labels[index - 1])}`
                  : `${this.formatSize(stats[2].labels[index])}`,
              ),
              values: stats[2].values,
            },
          },
        ];
      }),
    );

    return items;
  }

  private getStat(id: string, topCount = 0, includeOther = false): Observable<StatisticType> {
    return this.http.get<StatisticType>(`${this.apiEndpoint}/${id}`, {
      params: {
        top: topCount.toString(),
        group: includeOther.toString(),
      },
    });
  }

  private processFramework(framework: string): string {
    let label = framework.replace('framework', '');
    label = label.replace('simulation', '');
    return label;
  }

  private formatSize = (size: string): string => {
    const num = parseInt(size);
    if (num < 1000) {
      return `${size} B`;
    } else if (num < 1000000) {
      return `${(num / 1000).toFixed(0)} KB`;
    } else {
      return `${(num / 1000000).toFixed(1)} MB`;
    }
  };
}
