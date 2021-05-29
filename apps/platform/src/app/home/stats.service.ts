import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(private http: HttpClient) {}

  get(): any {
    return {
      countObjectsByType: [
        { category: 'Projects', count: 11 },
        { category: 'Models', count: 153 },
        { category: 'Simulations', count: 1029 },
        { category: 'Visualizations', count: 515 },
      ],
      countModelsByFramework: [
        { category: 'Constraint-based', count: 36 },
        { category: 'Continuous', count: 23 },
        { category: 'Discrete', count: 43 },
        { category: 'Logical', count: 55 },
      ],
      countModelsByFormat: [
        { category: 'CellML', count: 43 },
        { category: 'NeuroML', count: 13 },
        { category: 'SBML-plain', count: 403 },
        { category: 'SBML-fbc', count: 113 },
        { category: 'SBML-spatial', count: 64 },
        { category: 'SBML-qual', count: 87 },
        { category: 'pharmML', count: 5 },
      ],
      countSimulationsBySimulator: [
        { category: 'COBRApy', count: 13 },
        { category: 'COPASI', count: 43 },
        { category: 'NFsim', count: 403 },
        { category: 'tellurium', count: 113 },
        { category: 'Neuron', count: 64 },
        { category: 'OpenCOR', count: 87 },
        { category: 'VCell', count: 5 },
      ],
    };
  }
}
