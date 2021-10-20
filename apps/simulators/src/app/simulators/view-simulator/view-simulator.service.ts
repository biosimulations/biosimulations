import { Injectable } from '@angular/core';
import { SimulatorService, Version } from '../simulator.service';
import {
  ViewSimulator,
  ViewIdentifier,
  ViewCitation,
  ViewVersion,
  ViewAlgorithm,
  ViewAlgorithmObservable,
  ViewFramework,
  ViewFormat,
  ViewFormatObservable,
  ViewParameter,
  ViewParameterObservable,
  ViewKisaoTerm,
  ViewSioId,
  ViewAuthor,
  ViewFunding,
  DescriptionFragment,
  DescriptionFragmentType,
  ViewValidationTests,
  ViewTestCaseResult,
  ViewModelChangePattern,
  ViewModelChangeTypeValueName,
  ViewSimulationTypeValueName,
} from './view-simulator.interface';
import { OntologyService } from '@biosimulations/ontology/client';
import { BehaviorSubject, Observable } from 'rxjs';
import { Simulator, Algorithm } from '@biosimulations/datamodel/api';
import { map, pluck } from 'rxjs/operators';
import {
  IEdamOntologyIdVersion,
  ILinguistOntologyId,
  ISboOntologyId,
  ISioOntologyId,
  Identifier,
  Person,
  DependentPackage,
  Funding,
  AlgorithmParameter,
  ValueType,
  SoftwareInterfaceType,
  sortUrls,
  IValidationTests,
  ITestCaseResult,
  TestCaseResultType,
  IModelChangePattern,
  ModelChangeType,
  ModelChangeTypeName,
  SimulationType,
  SimulationTypeName,
  Url,
} from '@biosimulations/datamodel/common';
import { UtilsService } from '@biosimulations/shared/services';
import { parseValue, formatValue } from '@biosimulations/datamodel/utils';
import { Citation } from '@biosimulations/datamodel/api';
import { BiosimulationsError } from '@biosimulations/shared/error-handler';
import { SoftwareApplication, WithContext } from 'schema-dts';

@Injectable({ providedIn: 'root' })
export class ViewSimulatorService {
  constructor(
    private simService: SimulatorService,
    private ontService: OntologyService,
  ) {}

  public getLatest(simulatorId: string): Observable<ViewSimulator> {
    const sim: Observable<Simulator> =
      this.simService.getLatestById(simulatorId);
    return sim.pipe(map(this.apiToView.bind(this, simulatorId, undefined)));
  }

  public getVersion(
    simulatorId: string,
    version: string,
  ): Observable<ViewSimulator> {
    const sim: Observable<Simulator> = this.simService.getOneByVersion(
      simulatorId,
      version,
    );
    return sim.pipe(map(this.apiToView.bind(this, simulatorId, version)));
  }

  private apiToView(
    simulatorId: string,
    version: string | undefined,
    sim: Simulator | undefined,
  ): ViewSimulator {
    if (sim === undefined) {
      if (version) {
        throw new BiosimulationsError(
          'Simulator version not found',
          `Simulator "${simulatorId}" does not have version "${version}".`,
          404,
        );
      } else {
        throw new BiosimulationsError(
          'Simulator not found',
          `There is no simulator with id "${simulatorId}".`,
          404,
        );
      }
    }

    const viewSimAlgorithms = new BehaviorSubject<ViewAlgorithm[]>([]);

    const viewValidationTests = this.simService
      .getValidationTestResultsForOneByVersion(sim.id, sim.version)
      .pipe(
        map((sim: Simulator): ViewValidationTests | null => {
          let viewValidationTests: ViewValidationTests | null = null;
          if (sim?.biosimulators?.validationTests) {
            const validationTests: IValidationTests =
              sim.biosimulators.validationTests;

            let numTestsPassed = 0;
            let numTestPassedWithWarnings = 0;
            let numTestsSkipped = 0;
            let numTestsFailed = 0;
            validationTests.results.forEach((result: ITestCaseResult): void => {
              if (result.resultType == TestCaseResultType.passed) {
                numTestsPassed++;
                if (result.warnings?.length > 0) {
                  numTestPassedWithWarnings++;
                }
              } else if (result.resultType == TestCaseResultType.skipped) {
                numTestsSkipped++;
              } else {
                numTestsFailed++;
              }
            });

            const viewResults = validationTests.results
              .map((result: ITestCaseResult): ViewTestCaseResult => {
                const caseArchive = result.case.id.split('/')?.[1] || null;

                return {
                  case: {
                    id: result.case.id,
                    description: result.case.description.replace('\n', '<br/>'),
                  },
                  caseUrl:
                    'https://github.com/biosimulators/Biosimulators_test_suite/blob/' +
                    validationTests.testSuiteVersion +
                    '/biosimulators_test_suite/test_case/' +
                    result.case.id.split('.')[0] +
                    '.py',
                  caseClass: result.case.id.split(':')[0],
                  caseArchive: caseArchive,
                  caseArchiveUrl: caseArchive
                    ? 'https://github.com/biosimulators/Biosimulators_test_suite/raw/' +
                      validationTests.testSuiteVersion +
                      '/examples/' +
                      result.case.id.split(':')[1] +
                      '.omex'
                    : null,
                  resultType:
                    result.resultType.substring(0, 1).toUpperCase() +
                    result.resultType.substring(1),
                  duration: result.duration.toFixed(1),
                  exception: result.exception,
                  warnings: result.warnings,
                  skipReason: result.skipReason,
                  log: result.log,
                };
              })
              .sort((a, b) => {
                return a.case.id.localeCompare(b.case.id, undefined, {
                  numeric: true,
                });
              });

            viewValidationTests = {
              testSuiteVersion: validationTests.testSuiteVersion,
              testSuiteVersionUrl:
                'https://github.com/biosimulators/Biosimulators_test_suite/releases/tag/' +
                validationTests.testSuiteVersion,
              numTests: validationTests.results.length,
              numTestsPassed: numTestsPassed,
              numTestPassedWithWarnings: numTestPassedWithWarnings,
              numTestsSkipped: numTestsSkipped,
              numTestsFailed: numTestsFailed,
              results: viewResults,
              ghIssue: validationTests.ghIssue,
              ghIssueUrl: `https://github.com/biosimulators/Biosimulators/issues/${validationTests.ghIssue}`,
              ghActionRun: validationTests.ghActionRun,
              ghActionRunUrl: `https://github.com/biosimulators/Biosimulators/actions/runs/${validationTests.ghActionRun}`,
            };
          }

          return viewValidationTests;
        }),
      );

    const jsonLdData: WithContext<SoftwareApplication> = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: sim.name,
      softwareVersion: sim.version,
      applicationSuite: 'BioSimulators',
      applicationCategory: 'Science',
      applicationSubCategory: 'Simulation',
      abstract: sim.description,
      creativeWorkStatus: 'Published',
      datePublished: this.getDateStr(new Date(sim.biosimulators.created)),
      dateModified: this.getDateStr(new Date(sim.biosimulators.updated)),
      educationalLevel: 'advanced',
      contentRating: {
        '@type': 'Rating',
        ratingValue: UtilsService.getSimulatorCurationStatus(sim),
        ratingExplanation: UtilsService.getSimulatorCurationStatusMessage(
          UtilsService.getSimulatorCurationStatus(sim),
        ),
        worstRating: 1,
        bestRating: 5,
        author: {
          '@type': 'Organization',
          name: 'BioSimulators',
          email: 'info@biosimulators.org',
          url: 'https://biosimulators.org',
        },
      },
      offers: {
        '@type': 'Offer',
        price: 0,
        priceCurrency: 'USD',
      },
    };

    jsonLdData.creator = sim.authors.map((author) => {
      const names = [];
      if (author.firstName) {
        names.push(author.firstName);
      }
      if (author.middleName) {
        names.push(author.middleName);
      }
      if (author.lastName) {
        names.push(author.lastName);
      }

      return {
        '@type': 'Person',
        name: names.join(' '),
        url: author.identifiers.map((identifier) => identifier.url),
      };
    });

    if (sim.license) {
      jsonLdData.license = 'https://identifiers.org/spdx:' + sim.license.id;
    } else {
      jsonLdData.license = sim.urls
        .filter((url: Url): boolean => url.type === 'License')
        .map((url) => url.url);
    }

    jsonLdData.url = sim.urls
      .filter((url: Url): boolean => url.type === 'Home page')
      .map((url) => url.url);
    jsonLdData.downloadUrl = sim.urls
      .filter((url: Url): boolean =>
        ['Software catalogue', 'Source repository'].includes(url.type),
      )
      .map((url) => url.url);
    jsonLdData.installUrl = sim.urls
      .filter((url: Url): boolean => url.type === 'Installation instructions')
      .map((url) => url.url);
    jsonLdData.softwareHelp = sim.urls
      .filter((url: Url): boolean =>
        ['Tutorial', 'Documentation'].includes(url.type),
      )
      .map((url) => {
        return {
          '@type': 'WebPage',
          name: url.type,
          url: url.url,
        };
      });
    jsonLdData.discussionUrl = sim.urls
      .filter((url: Url): boolean => url.type === 'Discussion forum')
      .map((url) => url.url);
    jsonLdData.releaseNotes = sim.urls
      .filter((url: Url): boolean => url.type === 'Release notes')
      .map((url) => url.url);
    jsonLdData.operatingSystem = sim.supportedOperatingSystemTypes;

    jsonLdData.citation = sim.references.citations.map((citation) => {
      const formattedCitation = this.makeCitation(citation);
      return {
        '@type': 'Article',
        headline: citation.title,
        abstract: formattedCitation.text,
        author: {
          '@type': 'Person',
          name: citation.authors,
        },
        url: citation.identifiers.map((identifier) => identifier.url),
      };
    });

    jsonLdData.funder = sim.funding.map((funding) => {
      return {
        '@type': 'Organization',
        // name: this.ontService
        //  .getFunderRegistryTerm(funding.funder.id)
        //  .pipe(pluck('name')),
        url: 'http://data.crossref.org/fundingdata/funder/' + funding.funder.id,
      };
    });

    const viewSim: ViewSimulator = {
      _json: JSON.stringify(sim, null, 2),
      id: sim.id,
      version: sim.version,
      name: sim.name,
      image: sim.image,
      cli: sim?.cli,
      pythonApi: sim?.pythonApi,
      description: sim.description,
      urls: sim.urls.sort(sortUrls),
      authors: this.getAuthors(sim),
      identifiers: sim?.references?.identifiers
        ?.map(this.makeIdentifier, this)
        .sort((a, b) => {
          return a.text.localeCompare(b.text, undefined, { numeric: true });
        }),
      citations: sim?.references?.citations?.map(this.makeCitation, this),

      licenseName: sim.license
        ? this.ontService.getSpdxTerm(sim.license.id).pipe(
            pluck('name'),
            map((name: string) =>
              name.replace(/\bLicense\b/, '').replace('  ', ' '),
            ),
          )
        : null,
      licenseUrl: sim.license
        ? this.ontService.getSpdxTerm(sim.license.id).pipe(pluck('url'))
        : null,
      versions: this.simService
        .getVersions(sim.id)
        .pipe(map((value: Version[]) => value.map(this.setVersionDate, this))),
      algorithms: viewSimAlgorithms.asObservable(),
      otherInterfaceTypes: sim.interfaceTypes
        .filter((interfaceType: SoftwareInterfaceType): boolean => {
          if (sim?.biosimulators?.validated === true) {
            if (
              interfaceType ===
                SoftwareInterfaceType.bioSimulatorsDockerImage &&
              sim?.image
            ) {
              return false;
            }
            if (
              interfaceType === SoftwareInterfaceType.commandLine &&
              sim?.cli
            ) {
              return false;
            }
            if (
              interfaceType === SoftwareInterfaceType.library &&
              sim?.pythonApi
            ) {
              return false;
            }
          }

          return true;
        })
        .map((interfaceType: SoftwareInterfaceType): string => {
          return (
            interfaceType.substring(0, 1).toUpperCase() +
            interfaceType.substring(1)
          );
        })
        .sort((a: string, b: string) => {
          return a.localeCompare(b, undefined, { numeric: true });
        }),
      supportedOperatingSystemTypes: sim.supportedOperatingSystemTypes.sort(
        (a: string, b: string) => {
          return a.localeCompare(b, undefined, { numeric: true });
        },
      ),
      supportedProgrammingLanguages: sim.supportedProgrammingLanguages.sort(
        (a: ILinguistOntologyId, b: ILinguistOntologyId) => {
          return a.id.localeCompare(b.id, undefined, { numeric: true });
        },
      ),
      curationStatus: UtilsService.getSimulatorCurationStatusMessage(
        UtilsService.getSimulatorCurationStatus(sim),
      ),
      validated: sim?.biosimulators?.validated || false,
      validationTests: viewValidationTests,
      funding: sim.funding.map(this.getFunding, this),
      created: this.getDateStr(new Date(sim.biosimulators.created)),
      updated: this.getDateStr(new Date(sim.biosimulators.updated)),
      jsonLdData: jsonLdData,
    };

    const unresolvedAlgorithms = sim.algorithms
      .filter((alg: Algorithm) => {
        return !!alg.kisaoId;
      })
      .map(this.mapAlgorithms, this);
    UtilsService.recursiveForkJoin(unresolvedAlgorithms).subscribe(
      (algorithms: ViewAlgorithm[] | undefined) => {
        if (algorithms !== undefined) {
          algorithms.sort((a, b) => {
            return a.name.localeCompare(b.name, undefined, { numeric: true });
          });

          algorithms.forEach((algorithm: ViewAlgorithm): void => {
            algorithm.modelingFrameworks.sort(
              (a: ViewFramework, b: ViewFramework): number => {
                return a.name.localeCompare(b.name, undefined, {
                  numeric: true,
                });
              },
            );
            algorithm.modelFormats.sort(
              (a: ViewFormat, b: ViewFormat): number => {
                return a.term.name.localeCompare(b.term.name, undefined, {
                  numeric: true,
                });
              },
            );
            algorithm.simulationFormats.sort(
              (a: ViewFormat, b: ViewFormat): number => {
                return a.term.name.localeCompare(b.term.name, undefined, {
                  numeric: true,
                });
              },
            );
            algorithm.archiveFormats.sort(
              (a: ViewFormat, b: ViewFormat): number => {
                return a.term.name.localeCompare(b.term.name, undefined, {
                  numeric: true,
                });
              },
            );

            algorithm.parameters?.forEach((parameter: ViewParameter): void => {
              if (
                parameter.type !== ValueType.boolean &&
                parameter.type !== ValueType.integer &&
                parameter.type !== ValueType.float &&
                parameter.range
              ) {
                (parameter.range as string[]).sort((a: string, b: string) => {
                  return a.localeCompare(b, undefined, { numeric: true });
                });
              }

              parameter.valueUrl =
                parameter.type === ValueType.kisaoId
                  ? this.ontService.getKisaoUrl(parameter.rawValue as string)
                  : null;
              parameter.formattedValue = formatValue(
                parameter.type as ValueType,
                parameter.value,
              );

              if (parameter.range) {
                if (parameter.type === ValueType.kisaoId) {
                  parameter.formattedKisaoRange = (
                    parameter.rawRange as string[]
                  ).map((id: string, index: number): ViewKisaoTerm => {
                    return {
                      id: id,
                      name: parameter.range?.[index] as string,
                      url: this.ontService.getKisaoUrl(id),
                    };
                  });
                } else {
                  parameter.formattedRange = (
                    parameter.range as (boolean | number | string)[]
                  ).map((value: boolean | number | string): string => {
                    return formatValue(
                      parameter.type as ValueType,
                      value,
                    ) as string;
                  });
                }
              }
            });

            algorithm.parameters?.sort((a: ViewParameter, b: ViewParameter) => {
              return a.name.localeCompare(b.name, undefined, { numeric: true });
            });
          });
          viewSimAlgorithms.next(algorithms);
        }
      },
    );

    return viewSim;
  }

  private mapAlgorithms(value: Algorithm): ViewAlgorithmObservable {
    const kisaoTerm = this.ontService.getKisaoTerm(value.kisaoId.id);
    const kisaoName = kisaoTerm.pipe(pluck('name'));

    return {
      kisaoId: value.kisaoId.id,

      name: kisaoName,
      heading: kisaoName.pipe(
        map((nameval: string) => nameval + ' (' + value.kisaoId.id + ')'),
      ),
      description: kisaoTerm.pipe(
        pluck('description'),
        map(this.formatKisaoDescription),
      ),
      kisaoUrl: kisaoTerm.pipe(pluck('url')),
      modelingFrameworks: value.modelingFrameworks.map(this.getFramework, this),
      modelFormats: value.modelFormats.map(this.getFormat, this),
      modelChangePatterns:
        value?.modelChangePatterns?.map(this.getModelChangePattern, this) || [],
      simulationFormats: value.simulationFormats.map(this.getFormat, this),
      simulationTypes: value.simulationTypes.map(this.getSimulationType),
      archiveFormats: value.archiveFormats.map(this.getFormat, this),
      parameters: value.parameters
        ? value.parameters.map(this.getParameter, this)
        : null,
      outputDimensions: value?.outputDimensions
        ? (value?.outputDimensions?.map(
            this.getOutputDimensions,
            this,
          ) as Observable<ViewSioId>[])
        : null,
      outputVariablePatterns: value?.outputVariablePatterns || [],
      availableSoftwareInterfaceTypes: value.availableSoftwareInterfaceTypes
        .map((interfaceType: SoftwareInterfaceType): string => {
          return (
            interfaceType.substring(0, 1).toUpperCase() +
            interfaceType.substring(1)
          );
        })
        .sort((a: string, b: string) => {
          return a.localeCompare(b, undefined, { numeric: true });
        }),
      dependencies: value?.dependencies
        ? value?.dependencies?.sort(
            (a: DependentPackage, b: DependentPackage) => {
              return a.name.localeCompare(b.name, undefined, { numeric: true });
            },
          )
        : null,
      citations: value?.citations
        ? value.citations.map(this.makeCitation, this)
        : [],
    };
  }

  private getParameter(parameter: AlgorithmParameter): ViewParameterObservable {
    const kisaoTerm = this.ontService.getKisaoTerm(parameter.kisaoId.id);

    const getKisaoTermName = (id: string): Observable<string> => {
      return this.ontService.getKisaoTerm(id).pipe(pluck('name'));
    };

    return {
      name: kisaoTerm.pipe(pluck('name')),
      type: parameter.type,
      rawValue: parameter.value,
      value: parseValue<Observable<string>>(
        getKisaoTermName,
        parameter.type,
        parameter.value,
      ),
      valueUrl: null,
      formattedValue: null,
      rawRange: parameter.recommendedRange,
      range: parameter.recommendedRange
        ? parameter.recommendedRange.map(
            (value: string): boolean | number | string | Observable<string> => {
              return parseValue<Observable<string>>(
                getKisaoTermName,
                parameter.type,
                value,
              ) as boolean | number | string | Observable<string>;
            },
          )
        : null,
      formattedRange: null,
      formattedKisaoRange: null,
      kisaoId: parameter.kisaoId.id,
      kisaoUrl: this.ontService.getKisaoUrl(parameter.kisaoId.id),
      availableSoftwareInterfaceTypes:
        parameter.availableSoftwareInterfaceTypes.sort(
          (a: string, b: string) => {
            return a.localeCompare(b, undefined, { numeric: true });
          },
        ),
    };
  }

  private getOutputDimensions(value: ISioOntologyId): Observable<ViewSioId> {
    return this.ontService.getSioTerm(value.id);
  }

  private getFramework(value: ISboOntologyId): Observable<ViewFramework> {
    return this.ontService.getSboTerm(value.id);
  }

  private getSimulationType(
    value: SimulationType,
  ): ViewSimulationTypeValueName {
    return {
      value: value,
      name: SimulationTypeName[value as keyof typeof SimulationTypeName],
    };
  }

  private getFormat(value: IEdamOntologyIdVersion): ViewFormatObservable {
    return {
      term: this.ontService.getEdamTerm(value.id),
      version: value.version,
      supportedFeatures: value?.supportedFeatures?.sort(
        (a: string, b: string) => {
          return a.localeCompare(b, undefined, { numeric: true });
        },
      ),
    };
  }

  private getModelChangePattern(
    value: IModelChangePattern,
  ): ViewModelChangePattern {
    return {
      name: value.name,
      types: value.types.map(
        (value: ModelChangeType): ViewModelChangeTypeValueName => {
          return {
            value: value,
            name: ModelChangeTypeName[
              value as keyof typeof ModelChangeTypeName
            ],
          };
        },
      ),
      target: value?.target || null,
      symbol: value?.symbol || null,
    };
  }

  private setVersionDate(value: Version): ViewVersion {
    return {
      label: value.version,
      created: this.getDateStr(new Date(value.created as Date)),
      image: value.image,
      curationStatus: value.curationStatus,
      validated: value.validated,
    };
  }

  private getAuthors(simulator: Simulator): ViewAuthor[] {
    return simulator?.authors?.map((author: Person): ViewAuthor => {
      let name = author.lastName;
      if (author.middleName) {
        name = author.middleName + ' ' + name;
      }
      if (author.firstName) {
        name = author.firstName + ' ' + name;
      }

      let orcidUrl: string | null = null;
      for (const identifier of author.identifiers) {
        if (identifier.namespace === 'orcid') {
          orcidUrl = identifier.url;
        }
      }

      return { name, orcidUrl };
    });
  }

  private formatKisaoDescription(
    value: string | null,
  ): DescriptionFragment[] | null {
    if (value == null) {
      return null;
    }

    const formattedValue: DescriptionFragment[] = [];
    let prevEnd = 0;

    const regExp = /\[(https?:\/\/.*?)\]/gi;
    let match;
    while ((match = regExp.exec(value)) !== null) {
      if (match.index > 0) {
        formattedValue.push({
          type: DescriptionFragmentType.text,
          value: value.substring(prevEnd, match.index),
        });
      }
      prevEnd = match.index + match[0].length;
      formattedValue.push({
        type: DescriptionFragmentType.href,
        value: match[1],
      });
    }
    if (prevEnd < value?.length) {
      formattedValue.push({
        type: DescriptionFragmentType.text,
        value: value.substring(prevEnd),
      });
    }
    return formattedValue;
  }

  private makeIdentifier(identifier: Identifier): ViewIdentifier {
    return {
      text: identifier.namespace + ':' + identifier.id,
      url: this.getIdentifierUrl(identifier),
    };
  }

  private makeCitation(citation: Citation): ViewCitation {
    let text = citation.authors + '. ' + citation.title;
    if (citation.journal) {
      text += '. <i>' + citation.journal + '</i>';
    }
    if (citation.volume) {
      text += ' ' + citation.volume;
    }
    if (citation.issue) {
      text += ' (' + citation.issue + ')';
    }
    if (citation.pages) {
      text += ', ' + citation.pages.replace(/-+/g, '–');
    }
    text += ' (' + citation.year + ').';

    const identifier = citation?.identifiers?.[0];
    let url: string | null = null;
    if (identifier) {
      url = this.getIdentifierUrl(identifier);
    }

    return {
      text: text,
      url: url,
    };
  }

  private getIdentifierUrl(identifier: Identifier): string {
    return identifier.url;
  }

  private getDateStr(date: Date): string {
    return UtilsService.formatDate(date);
  }

  private getFunding(funding: Funding): ViewFunding {
    return {
      funderName: this.ontService
        .getFunderRegistryTerm(funding.funder.id)
        .pipe(pluck('name')),
      funderUrl: this.ontService
        .getFunderRegistryTerm(funding.funder.id)
        .pipe(pluck('url')),
      grant: funding.grant,
      url: funding.url,
    };
  }
}
