import { Injectable } from '@angular/core';
import { of, delayWhen, map, timer, Observable } from 'rxjs';
import { CombineArchiveElementMetadata } from './view.model';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  constructor() {}

  public getArchiveMetadata(
    id: string,
  ): Observable<CombineArchiveElementMetadata> {
    const metaData: Observable<CombineArchiveElementMetadata> = this.getProject(
      id,
    ).pipe(map((metadata) => metadata[0]));

    return metaData;
  }
  public getProject(id: string) {
    const metadata: CombineArchiveElementMetadata[] = [
      {
        _type: 'BioSimulationsCombineArchiveElementMetadata',
        abstract:
          'Hybrid-stochastic model of tumour suppression by the immune system through stochastic oscillations',
        citations: [
          {
            _type: 'BioSimulationsMetadataValue',
            label:
              "Giulio Caravagna, Alberto d'Onofrio, Paolo Milazzo & Roberto Barbuti. Journal of Theoretical Biology 265, 3 (2010) 336-345.",
            uri: 'https://identifiers.org/doi:10.1016/j.jtbi.2010.05.013',
          },
        ],
        contributors: [
          {
            _type: 'BioSimulationsMetadataValue',
            label: 'Mohammad Umer Sharif Shohan',
            uri: 'https://identifiers.org/orcid:0000-0001-9521-6012',
          },
          {
            _type: 'BioSimulationsMetadataValue',
            label: 'Jonathan Karr',
            uri: 'https://identifiers.org/orcid:0000-0002-2605-5080',
          },
        ],
        created: '2010-05-16',
        creators: [
          {
            _type: 'BioSimulationsMetadataValue',
            label: 'Giulio Caravagna',
            uri: 'https://identifiers.org/orcid:0000-0003-4240-3265',
          },
          {
            _type: 'BioSimulationsMetadataValue',
            label: "Alberto d'Onofrio",
            uri: 'https://identifiers.org/orcid:0000-0002-2190-272X',
          },
          {
            _type: 'BioSimulationsMetadataValue',
            label: 'Paolo Milazzo',
            uri: 'https://identifiers.org/orcid:0000-0002-7309-6424',
          },
          {
            _type: 'BioSimulationsMetadataValue',
            label: 'Roberto Barbuti',
            uri: null,
          },
        ],
        description:
          'Hybrid-stochastic version of the Kirschner-Panetta model for tumour-immune System interplay which reproduces a number of features of this essential interaction, including tumour suppression by the immune system through stochastic oscillations.',
        encodes: [],
        funders: [],
        seeAlso: [],
        identifiers: [
          {
            _type: 'BioSimulationsMetadataValue',
            label: 'biomodels.db:BIOMD0000000912',
            uri: 'https://identifiers.org/biomodels.db:BIOMD0000000912',
          },
        ],
        keywords: [
          { label: 'biological clock', uri: null },
          { label: 'immunology', uri: null },
          { label: 'immunotherapy', uri: null },
          { label: 'neoplasm', uri: null },
        ],
        license: {
          _type: 'BioSimulationsMetadataValue',
          label: 'CC0',
          uri: 'https://identifiers.org/spdx:CC0',
        },
        modified: ['2021-06-26'],
        other: [],
        predecessors: [
          {
            _type: 'BioSimulationsMetadataValue',
            label:
              'Denise Kirschner & John Carl Panetta. Modeling immunotherapy of the tumor-immune interaction. Journal of Mathematical Biology 37, 3 (1998): 235-252.',
            uri: 'https://identifiers.org/doi:10.1007/s002850050127',
          },
        ],

        sources: [],
        successors: [],
        taxa: [
          {
            _type: 'BioSimulationsMetadataValue',
            label: 'Homo sapiens',
            uri: 'https://identifiers.org/taxonomy/9606',
          },
        ],
        thumbnails: [
          '/assets/images/resource-banners/models.svg',
          '/assets/images/resource-banners/visualizations.svg',
          '/assets/images/resource-banners/simulations.svg',
          '/assets/images/resource-banners/charts.svg',
        ],
        title:
          'Tumor-suppressive oscillations (Caravagna et al., Journal of Theoretical Biology, 2010)',
        uri: '.',
      },
      {
        _type: 'BioSimulationsCombineArchiveElementMetadata',
        abstract: 'null',
        citations: [],
        contributors: [],
        created: 'null',
        creators: [],
        description: 'null',
        encodes: [],
        funders: [],
        identifiers: [
          {
            _type: 'BioSimulationsMetadataValue',
            label: 'Figure 1 (bottom left)',
            uri: 'https://identifiers.org/doi:10.1016/j.jtbi.2010.05.013',
          },
        ],
        keywords: [],
        license: { label: 'MIT', uri: 'mit' },
        modified: [],
        other: [],
        predecessors: [],
        seeAlso: [],
        sources: [],
        successors: [],
        taxa: [],
        thumbnails: [],
        title: 'null',
        uri: './BIOMD0000000912_sim.sedml/Figure_1',
      },
    ];
    const delayForFiveSeconds = (): Observable<0> => timer(1000);
    return of(metadata).pipe(delayWhen(delayForFiveSeconds));
  }
}
