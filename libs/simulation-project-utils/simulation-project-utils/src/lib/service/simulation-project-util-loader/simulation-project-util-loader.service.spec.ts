import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  DispatchService,
  CombineApiService,
  SimulationProjectUtilLoaderService,
  SimulatorsData,
  SimulationProjectUtilData,
} from '../../index';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlgorithmSubstitution } from '@biosimulations/datamodel/common';

class MockDispatchService {
  public getSimulatorsFromDb(): Observable<SimulatorsData> {
    return of({
      simulatorSpecs: {},
      modelFormats: {},
      modelingFrameworks: {},
      simulationAlgorithms: {
        alg1: {
          id: 'algId1',
          name: 'algName1',
          simulators: new Set<string>(),
          disabled: false,
        },
        alg2: {
          id: 'algId2',
          name: 'algName2',
          simulators: new Set<string>(),
          disabled: false,
        },
      },
    });
  }
}

class MockCombineApiService {
  public getSimilarAlgorithms(_: string[]): Observable<AlgorithmSubstitution[] | undefined> {
    return of([
      {
        _type: 'KisaoAlgorithmSubstitution',
        algorithms: [],
        minPolicy: {
          _type: 'KisaoAlgorithmSubstitutionPolicy',
          id: '',
          name: '',
          level: 0,
        },
      },
    ]);
  }
}

class MockSnackBar {
  public open(): void {}
}

describe('SimulationProjectUtilLoaderService', () => {
  let service: SimulationProjectUtilLoaderService;

  beforeEach(() => {
    const mockRoute = { queryParams: of([{ id: 1 }]) };

    TestBed.configureTestingModule({
      providers: [
        { provide: DispatchService, useValue: new MockDispatchService() },
        { provide: CombineApiService, useValue: new MockCombineApiService() },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: MatSnackBar, useValue: new MockSnackBar() },
      ],
    });
    service = TestBed.inject(SimulationProjectUtilLoaderService);
  });

  it('should load data', waitForAsync(() => {
    const mockDispatchService = TestBed.inject(DispatchService);
    jest.spyOn(mockDispatchService, 'getSimulatorsFromDb');

    const mockCombineService = TestBed.inject(CombineApiService);
    jest.spyOn(mockCombineService, 'getSimilarAlgorithms');

    const mockSnackBar = TestBed.inject(MatSnackBar);
    jest.spyOn(mockSnackBar, 'open');

    const loadObs = service.loadSimulationUtilData();
    loadObs.subscribe((data: SimulationProjectUtilData): void => {
      expect(mockDispatchService.getSimulatorsFromDb).toHaveBeenCalled();
      expect(mockCombineService.getSimilarAlgorithms).toHaveBeenCalledWith(expect.arrayContaining(['alg1', 'alg2']));
      expect(mockSnackBar.open).not.toHaveBeenCalled();
      expect(data).toBeTruthy();
    });
  }));

  it('should show snackbar when no substitutions', waitForAsync(() => {
    const mockDispatchService = TestBed.inject(DispatchService);
    jest.spyOn(mockDispatchService, 'getSimulatorsFromDb');

    const mockCombineService = TestBed.inject(CombineApiService);
    jest.spyOn(mockCombineService, 'getSimilarAlgorithms').mockReturnValue(of(undefined));

    const mockSnackBar = TestBed.inject(MatSnackBar);
    jest.spyOn(mockSnackBar, 'open');

    const loadObs = service.loadSimulationUtilData();
    loadObs.subscribe((data: SimulationProjectUtilData): void => {
      expect(mockDispatchService.getSimulatorsFromDb).toHaveBeenCalled();
      expect(mockCombineService.getSimilarAlgorithms).toHaveBeenCalledWith(expect.arrayContaining(['alg1', 'alg2']));
      expect(mockSnackBar.open).toHaveBeenCalled();
      expect(data).toBeTruthy();
    });
  }));
});
