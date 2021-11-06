import { Injectable } from '@angular/core';
import { SimulatorService } from '../simulator.service';
import { Observable } from 'rxjs';
import { map, mergeAll, shareReplay } from 'rxjs/operators';
import { TableSimulator } from './tableSimulator.interface';
import { OntologyService } from '@biosimulations/ontology/client';
import {
  sortUrls,
  ILinguistOntologyId,
  IAlgorithm,
  Person,
  DependentPackage,
  Identifier,
  Citation,
  Funding,
  Ontologies,
  IOntologyId,
  IOntologyTerm,
} from '@biosimulations/datamodel/common';
import { ISimulator } from '@biosimulations/datamodel/common';
import { UtilsService } from '@biosimulations/shared/angular';

interface PartialIOntologyTerm {
  namespace: Ontologies;
  id: string;
  name: string;
}

type OntologyTermMap = {[ontologyId: string]: {[termId: string]: PartialIOntologyTerm}};

@Injectable({ providedIn: 'root' })
export class SimulatorTableService {
  private ontologyIdTermMap!: Observable<OntologyTermMap>;

  constructor(
    private service: SimulatorService,
    private ontologyService: OntologyService,
  ) {}

  getData(): Observable<TableSimulator[]> {
    const data = this.service.getLatest().pipe(
      //Data from the service is an array of API objects - Convert to array of table objects
      map((simulators: ISimulator[]): Observable<TableSimulator[]> => {
        // Go through the array and convert each API object to an observable of a table object
        if (!this.ontologyIdTermMap) {
          this.ontologyIdTermMap = this.getOntologyIdTermMap(simulators);
        }
        
        return this.ontologyIdTermMap.pipe(
          map((ontologyIdTermMap: OntologyTermMap): TableSimulator[] => {
            return simulators.map((simulator: ISimulator): TableSimulator => {
              const ontologyTermIdsMap = {
                'algorithms': new Set<string>(),
                'parameters': new Set<string>(),
                'frameworks': new Set<string>(),
                'modelFormats': new Set<string>(),
                'simulationFormats': new Set<string>(),
                'archiveFormats': new Set<string>(),
              };

              for (const algorithm of simulator.algorithms) {
                if (algorithm.kisaoId) {
                  ontologyTermIdsMap['algorithms'].add(algorithm.kisaoId.id);
                }

                for (const parameter of (algorithm?.parameters || [])) {
                  if (parameter.kisaoId) {
                    ontologyTermIdsMap['parameters'].add(parameter.kisaoId.id);
                  }
                }

                for (const framework of algorithm.modelingFrameworks) {
                  ontologyTermIdsMap['frameworks'].add(framework.id);
                }

                for (const format of algorithm.modelFormats) {
                  ontologyTermIdsMap['modelFormats'].add(format.id + '_:_' + (format.version || ''));
                }

                for (const format of algorithm.simulationFormats) {
                  ontologyTermIdsMap['simulationFormats'].add(format.id + '_:_' + (format.version || ''));
                }

                for (const format of algorithm.archiveFormats) {
                  ontologyTermIdsMap['archiveFormats'].add(format.id + '_:_' + (format.version || ''));
                }
              }

              const modelFormats = this.getFormats(ontologyTermIdsMap['modelFormats'], ontologyIdTermMap[Ontologies.EDAM]);
              const simulationFormats = this.getFormats(ontologyTermIdsMap['simulationFormats'], ontologyIdTermMap[Ontologies.EDAM]);
              const archiveFormats = this.getFormats(ontologyTermIdsMap['archiveFormats'], ontologyIdTermMap[Ontologies.EDAM]);

              return {
                id: simulator.id,
                name: simulator.name,
                description: simulator.description,
                latestVersion: simulator.version,
                url: simulator.urls.sort(sortUrls)?.[0]?.url || null,
                updated: new Date(simulator.biosimulators.updated),
                license: simulator.license
                  ? this.shortenLicense(ontologyIdTermMap?.[Ontologies.SPDX]?.[simulator.license.id]?.name || null)
                  : null,
                licenseId: simulator.license
                  ? simulator.license.id
                  : null,
                frameworks: Array.from(ontologyTermIdsMap['frameworks'])
                  .map((id: string): string => {
                    const name = ontologyIdTermMap?.[Ontologies.SBO]?.[id]?.name;
                    if (name) {
                      return this.trimFramework(name);
                    } else {
                      return id;
                    }
                  }),
                frameworkIds: Array.from(ontologyTermIdsMap['frameworks']),
                algorithms: Array.from(ontologyTermIdsMap['algorithms'])
                  .map((id: string): string => {
                    return ontologyIdTermMap?.[Ontologies.KISAO]?.[id]?.name || id;
                  }),
                algorithmIds: Array.from(ontologyTermIdsMap['algorithms']),
                modelFormats: modelFormats,
                modelFormatIds: Array.from(ontologyTermIdsMap['modelFormats']),
                simulationFormats: simulationFormats,
                simulationFormatIds: Array.from(ontologyTermIdsMap['simulationFormats']),
                archiveFormats: archiveFormats,
                archiveFormatIds: Array.from(ontologyTermIdsMap['archiveFormats']),
                interfaceTypes: simulator.interfaceTypes.sort(
                  (a: string, b: string) => {
                    return a.localeCompare(b, undefined, {
                      numeric: true,
                    });
                  },
                ),
                supportedOperatingSystemTypes:
                  simulator.supportedOperatingSystemTypes.sort(
                    (a: string, b: string) => {
                      return a.localeCompare(b, undefined, {
                        numeric: true,
                      });
                    },
                  ),
                supportedProgrammingLanguages:
                  simulator.supportedProgrammingLanguages
                    .map(
                      (
                        supportedProgrammingLanguage: ILinguistOntologyId,
                      ): string => {
                        return supportedProgrammingLanguage.id;
                      },
                    )
                    .sort((a: string, b: string) => {
                      return a.localeCompare(b, undefined, {
                        numeric: true,
                      });
                    }),
                image: simulator.image?.url || undefined,
                cli: simulator?.cli?.package || undefined,
                pythonApi: simulator?.pythonApi?.package || undefined,
                curationStatus: UtilsService.getSimulatorCurationStatus(simulator),
                algorithmParameters: Array.from(ontologyTermIdsMap['parameters'])
                  .map((id: string): string => {
                    const name = ontologyIdTermMap?.[Ontologies.KISAO]?.[id]?.name;
                    if (name) {
                      return id + ' ' + name;
                    } else {
                      return id;
                    }
                  })
                  .join(' '),
                dependencies: this.getDependencies(simulator.algorithms),
                authors: this.getAuthors(simulator.authors),
                citations: this.getCitations(simulator.references.citations),
                identifiers: this.getIdentifiers(simulator.references.identifiers),
                funding: this.getFunding(simulator.funding, ontologyIdTermMap?.[Ontologies.FunderRegistry] || {}),
              };
            });
          }),
        );
      }),
      mergeAll(),
      shareReplay(1),
    );
    return data;
  }

  private getOntologyIdTermMap(simulators: ISimulator[]): Observable<OntologyTermMap> {
    const ontologyTermIdsMap = {
      'EDAM': new Set<string>(),
      'FunderRegistry': new Set<string>(),
      'KISAO': new Set<string>(),
      'SBO': new Set<string>(),
      'SPDX': new Set<string>(),
    };
    simulators.forEach((simulator: ISimulator): void => {
      for (const algorithm of simulator.algorithms) {
        if (algorithm.kisaoId) {
          ontologyTermIdsMap['KISAO'].add(algorithm.kisaoId.id);
        }

        for (const parameter of (algorithm?.parameters || [])) {
          if (parameter.kisaoId) {
            ontologyTermIdsMap['KISAO'].add(parameter.kisaoId.id);
          }
        }

        for (const framework of algorithm.modelingFrameworks) {
          ontologyTermIdsMap['SBO'].add(framework.id);
        }

        for (const format of algorithm.modelFormats) {
          ontologyTermIdsMap['EDAM'].add(format.id);
        }

        for (const format of algorithm.simulationFormats) {
          ontologyTermIdsMap['EDAM'].add(format.id);
        }

        for (const format of algorithm.archiveFormats) {
          ontologyTermIdsMap['EDAM'].add(format.id);
        }
      }

      if (simulator.license) {
        ontologyTermIdsMap['SPDX'].add(simulator.license.id);
      }

      for (const funding of simulator.funding) {
        ontologyTermIdsMap['FunderRegistry'].add(funding.funder.id);
      }
    });

    const ontologyIdsArray: IOntologyId[] = [];
    Object.entries(ontologyTermIdsMap).forEach((namespaceIds: [string, Set<string>]): void => {
      const namespace: string = namespaceIds[0];
      const ids: Set<string> = namespaceIds[1];
      ids.forEach((id: string): void => {
        ontologyIdsArray.push({
          namespace: namespace as Ontologies,
          id: id,
        })
      })
    });

    return this.ontologyService.getTerms<PartialIOntologyTerm>(ontologyIdsArray, ['namespace', 'id', 'name']).pipe(
      map((ontologyTerms: PartialIOntologyTerm[]): OntologyTermMap => {
        const ontologyIdTermMap: OntologyTermMap = {};          
        ontologyTerms.forEach((ontologyTerm: PartialIOntologyTerm): void => {
          if (!(ontologyTerm.namespace in ontologyIdTermMap)) {
            ontologyIdTermMap[ontologyTerm.namespace] = {};  
          }
          ontologyIdTermMap[ontologyTerm.namespace][ontologyTerm.id] = ontologyTerm;            
        });
        return ontologyIdTermMap;
      }),
      shareReplay(1),
    );
  }

  getFormats(
    idVersions: Set<string>,
    ontologyIdTermMap: {[termId: string]: PartialIOntologyTerm},
  ): string[] {
    return Array.from(idVersions)
      .map((idVersion: string): string => {
        const iSplit = idVersion.lastIndexOf('_:_')
        const id = idVersion.substring(0, iSplit)
        const version = idVersion.substring(iSplit + 3);
        if (version) {
          return (ontologyIdTermMap?.[id]?.name || id) + ' ' + version;
        } else {
          return (ontologyIdTermMap?.[id]?.name || id);
        }
      });
  }

  trimFramework(name: string): string {
    if (name && name.toLowerCase().endsWith(' framework')) {
      name = name.substring(0, name.length - 10).trim();
    }
    return name;
  }

  shortenLicense(name: string | null): string | null {
    if (name) {
      return name
        .replace(/\bLicense\b/, '')
        .replace('  ', ' ')
        .trim();
    } else {
      return null;
    }
  }

  getDependencies(algorithms: IAlgorithm[]): string {
    const text: string[] = [];
    algorithms.forEach((algorithm: IAlgorithm): void => {
      algorithm?.dependencies?.forEach((dependency: DependentPackage): void => {
        text.push(dependency.name);
      });
    });
    return text.join(' ');
  }

  getAuthors(authors: Person[]): string {
    const text: string[] = [];
    authors.forEach((author: Person): void => {
      if (author?.firstName) {
        text.push(author?.firstName);
      }
      if (author?.middleName) {
        text.push(author?.middleName);
      }
      if (author?.lastName) {
        text.push(author?.lastName);
      }
      author.identifiers.forEach((identifier: Identifier): void => {
        text.push(identifier.namespace);
        text.push(identifier.id);
      });
    });
    return text.join(' ');
  }

  getCitations(citations: Citation[]): string {
    const text: string[] = [];
    citations.forEach((citation: Citation): void => {
      if (citation?.authors) {
        text.push(citation.authors);
      }
      if (citation?.title) {
        text.push(citation.title);
      }
      if (citation?.journal) {
        text.push(citation.journal);
      }
      if (citation?.volume) {
        text.push(citation.volume);
      }
      if (citation?.issue) {
        text.push(citation.issue);
      }
      if (citation?.pages) {
        text.push(citation.pages);
      }
      if (citation?.year) {
        text.push(citation.year.toString());
      }

      citation.identifiers.forEach((identifier: Identifier): void => {
        text.push(identifier.namespace);
        text.push(identifier.id);
      });
    });
    return text.join(' ');
  }

  getIdentifiers(identifiers: Identifier[]): string {
    const text: string[] = [];
    identifiers.forEach((identifier: Identifier): void => {
      text.push(identifier.namespace);
      text.push(identifier.id);
    });
    return text.join(' ');
  }

  getFunding(funding: Funding[], ontologyIdTermMap: {[termId: string]: PartialIOntologyTerm}): string {
    const funderIds = new Set<string>();
    const grants: string[] = [];
    funding.forEach((funding: Funding): void => {
      funderIds.add(funding.funder.id);
      if (funding?.grant) {
        grants.push(funding.grant);
      }
    });

    const funderNames: string[] = [];
    for (const funderId of funderIds) {
      funderNames.push(
        ontologyIdTermMap?.[funderId]?.name || funderId,
      );
    }

    return (
      funderNames.join(' ') +
      ' ' +
      Array.from(funderIds).join(' ') +
      ' ' +
      grants.join(' ')
    );
  }
}
