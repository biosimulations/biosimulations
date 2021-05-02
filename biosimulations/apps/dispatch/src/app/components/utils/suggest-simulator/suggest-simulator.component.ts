import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DispatchService, SimulatorsData } from '../../../services/dispatch/dispatch.service';
import { CombineService } from '../../../services/combine/combine.service';
import { AlgorithmSubstitution, AlgorithmSubstitutionPolicy, AlgorithmSubstitutionPolicyLevels, Algorithm as KisoaAlgorithm } from '../../../kisao.interface';
import { Observable } from 'rxjs';
import { map, withLatestFrom, concatAll } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Algorithm {
  id: string;
  name: string;
  url: string;
}

interface AlgorithmPolicy {
  algorithms: Algorithm[];
  maxPolicy: AlgorithmSubstitutionPolicy;
}

interface Simulator {
  id: string;
  name: string;
  url: string;
  algorithms: Algorithm[];
}

interface SimulatorPolicy {
  simulators: Simulator[];
  maxPolicy: AlgorithmSubstitutionPolicy;
}

interface AlgorithmData {
  algorithm: Algorithm;
  altAlgorithms: AlgorithmPolicy[];
  simulators: SimulatorPolicy[];
}

const EBI_KISAO_BASE_URL = 'https://www.ebi.ac.uk/ols/ontologies/kisao/terms?iri=http%3A%2F%2Fwww.biomodels.net%2Fkisao%2FKISAO%23';

@Component({
  selector: 'biosimulations-suggest-simulator',
  templateUrl: './suggest-simulator.component.html',
  styleUrls: ['./suggest-simulator.component.scss'],
})
export class SuggestSimulatorComponent implements OnInit {
  algorithms: Observable<AlgorithmData[]> | undefined = undefined;
  private algorithmsMap: {[id: string]: AlgorithmData} | undefined = undefined;

  formGroup: FormGroup;
  selectedAlgorithm: Algorithm | undefined = undefined;

  suggestions: AlgorithmData | undefined = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private dispatchService: DispatchService,
    private combineService: CombineService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.formGroup = this.formBuilder.group(
      {
        algorithm: [null, [Validators.required]],
      },
    );
    this.formGroup.controls.algorithm.disable();
  }

  ngOnInit(): void {
    const simulatorsDataObs = this.dispatchService.getSimulatorsFromDb();
    const algSubObs = simulatorsDataObs.pipe(
      map((simulatorsData: SimulatorsData): Observable<AlgorithmSubstitution[] | undefined> => {
        return this.combineService.getSimilarAlgorithms(Object.keys(simulatorsData.simulationAlgorithms));
      }),
      concatAll(),
      withLatestFrom(simulatorsDataObs, this.activatedRoute.queryParams),
    )

    this.algorithms = algSubObs.pipe(
      map((args: [AlgorithmSubstitution[] | undefined, SimulatorsData, Params]): AlgorithmData[] => {
        const algSubstitutions = args[0];
        const simulatorsData = args[1];
        const simulatorSpecsMap = simulatorsData.simulatorSpecs;
        const simulationAlgorithmsMap = simulatorsData.simulationAlgorithms;
        const params = args[2];

        if (!algSubstitutions) {
          this.snackBar.open(
            'Sorry! We were unable to load information about the simularity among algorithms.',
            undefined,
            {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            },
          );
          return [];
        }

        const algorithmsMap: {[id: string]: any} = {};
        algSubstitutions.forEach((algSubstitution: AlgorithmSubstitution): void => {
          algSubstitution.algorithms.forEach((algorithm: KisoaAlgorithm): void => {
            if (!(algorithm.id in algorithmsMap)) {
              algorithmsMap[algorithm.id] = {
                algorithm: {
                  id: algorithm.id,
                  name: algorithm.name,
                  url: EBI_KISAO_BASE_URL + algorithm.id,
                },
                altAlgorithms: {},
                simulators: {},
              }
            }
          });

          const mainAlg = algSubstitution.algorithms[0];
          const altAlg = algSubstitution.algorithms[1]
          const subPolicy = algSubstitution.maxPolicy;

          // algorithm substitution
          if (!(subPolicy.level in algorithmsMap[mainAlg.id].altAlgorithms)) {
            algorithmsMap[mainAlg.id].altAlgorithms[subPolicy.level] = {
              maxPolicy: subPolicy,
              algorithms: {},
            }
          }
          if (!(subPolicy.level in algorithmsMap[altAlg.id].altAlgorithms)) {
            algorithmsMap[altAlg.id].altAlgorithms[subPolicy.level] = {
              maxPolicy: subPolicy,
              algorithms: {},
            }
          }

          algorithmsMap[mainAlg.id].altAlgorithms[subPolicy.level].algorithms[altAlg.id] = {
            id: altAlg.id,
            name: altAlg.name,
            url: EBI_KISAO_BASE_URL + altAlg.id,
          }
          algorithmsMap[altAlg.id].altAlgorithms[subPolicy.level].algorithms[mainAlg.id] = {
            id: mainAlg.id,
            name: mainAlg.name,
            url: EBI_KISAO_BASE_URL + mainAlg.id,
          }

          // simulators
          const mainAlgSimulators = simulationAlgorithmsMap[mainAlg.id].simulators;

          mainAlgSimulators.forEach((simulator: string): void => {
            // implementation of main algorithm
            algorithmsMap[mainAlg.id].simulators[simulator] = {
              maxPolicy: {
                id: 'SAME_METHOD',
                name: 'Same method',
                level: AlgorithmSubstitutionPolicyLevels.SAME_METHOD,
              },
              simulatorAlgorithms: {
                id: simulator,
                name: simulatorSpecsMap[simulator].name,
                url: 'https://biosimulators.org/simulators/' + simulator,
                algorithms: {},
              }
            };
            algorithmsMap[mainAlg.id].simulators[simulator].simulatorAlgorithms.algorithms[mainAlg.id] = {
              id: mainAlg.id,
              name: mainAlg.name,
              url: EBI_KISAO_BASE_URL + mainAlg.id,
            };

            // alt implementations
            if (!(simulator in algorithmsMap[altAlg.id].simulators)) {
              algorithmsMap[altAlg.id].simulators[simulator] = {
                maxPolicy: subPolicy,
                simulatorAlgorithms: {
                  id: simulator,
                  name: simulatorSpecsMap[simulator].name,
                  url: 'https://biosimulators.org/simulators/' + simulator,
                  algorithms: {},
                }
              };
            }

            if (subPolicy.level < algorithmsMap[altAlg.id].simulators[simulator].maxPolicy.level) {
              algorithmsMap[altAlg.id].simulators[simulator].maxPolicy = subPolicy;
              algorithmsMap[altAlg.id].simulators[simulator].simulatorAlgorithms.algorithms = {};
            }
            if (subPolicy.level <= algorithmsMap[altAlg.id].simulators[simulator].maxPolicy.level) {
              algorithmsMap[altAlg.id].simulators[simulator].simulatorAlgorithms.algorithms[mainAlg.id]  = {
                id: mainAlg.id,
                name: mainAlg.name,
                url: EBI_KISAO_BASE_URL + mainAlg.id,
              };
            }
          });
        });

        const algorithms = Object.values(algorithmsMap)
        algorithms.sort((a: AlgorithmData, b: AlgorithmData): number => {
          return a.algorithm.name.localeCompare(b.algorithm.name, undefined, { numeric: true });
        });

        algorithms.forEach((algorithmData: AlgorithmData): void => {
          // algorithms
          algorithmData.altAlgorithms = Object.values(algorithmData.altAlgorithms)
            .filter((algPolicy: AlgorithmPolicy): boolean => {
              return algPolicy.maxPolicy.level > 1;
            });
          algorithmData.altAlgorithms.sort((a: AlgorithmPolicy, b: AlgorithmPolicy): number => {
            if (a.maxPolicy.level < b.maxPolicy.level) {
              return -1;
            } else if (a.maxPolicy.level > b.maxPolicy.level) {
              return 1;
            } else {
              return 0;
            }
          });
          algorithmData.altAlgorithms.forEach((algPolicy: AlgorithmPolicy): void => {
            algPolicy.algorithms = Object.values(algPolicy.algorithms);
            algPolicy.algorithms.sort((a: Algorithm, b: Algorithm): number => {
              return a.name.localeCompare(b.name, undefined, { numeric: true });
            });
          })

          // implementations
          const simulatorPolicices: any = {};
          Object.values(algorithmData.simulators).forEach((simulatorPolicyAlgs: any): void => {
            if (!(simulatorPolicyAlgs.maxPolicy.level in simulatorPolicices)) {
              simulatorPolicices[simulatorPolicyAlgs.maxPolicy.level] = {
                maxPolicy: simulatorPolicyAlgs.maxPolicy,
                simulators: [],
              }
            }
            simulatorPolicices[simulatorPolicyAlgs.maxPolicy.level].simulators.push(simulatorPolicyAlgs.simulatorAlgorithms);
            simulatorPolicyAlgs.simulatorAlgorithms.algorithms = Object.values(simulatorPolicyAlgs.simulatorAlgorithms.algorithms)
          });

          algorithmData.simulators = Object.values(simulatorPolicices);
          algorithmData.simulators.sort((a: SimulatorPolicy, b: SimulatorPolicy): number => {
            if (a.maxPolicy.level < b.maxPolicy.level) {
              return -1;
            } else if (a.maxPolicy.level > b.maxPolicy.level) {
              return 1;
            } else {
              return 0;
            }
          });

          algorithmData.simulators.forEach((simulatorPolicy: SimulatorPolicy): void => {
            simulatorPolicy.simulators.sort((a: Simulator, b: Simulator): number => {
              return a.name.localeCompare(b.name, undefined, { numeric: true });
            });
            simulatorPolicy.simulators.forEach((simulator: Simulator): void => {
              simulator.algorithms.sort((a: Algorithm, b: Algorithm): number => {
                return a.name.localeCompare(b.name, undefined, { numeric: true });
              });
            })
          })
        })

        this.algorithmsMap = algorithmsMap;

        const simulationAlgorithm = params?.simulationAlgorithm;
        if (simulationAlgorithm && simulationAlgorithm in algorithmsMap) {
          this.formGroup.controls.algorithm.setValue(simulationAlgorithm)
        }

        this.formGroup.controls.algorithm.enable();
        return algorithms;
      })
    );
  }

  getAlgorithmSimulatorSuggestions(): void {
    const selectedAlgorithmId = this.formGroup.controls.algorithm.value;
    this.suggestions = this.algorithmsMap?.[selectedAlgorithmId];
  }
}
