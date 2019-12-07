import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
    constructor(private http: HttpClient) {}

    get(): object {
        return {
            numProjects: 10,
            numModels: 100,
            numSimulations: 1000,
            numVisualizations: 10,
        };
    }
}
