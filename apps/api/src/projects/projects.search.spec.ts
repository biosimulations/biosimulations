import { beforeAll, describe, expect, it } from '@jest/globals';
import { ProjectsSearch } from './projects.search';
import { ProjectSummary } from '@biosimulations/datamodel/api';

import { projectSummary_mock1, projectSummary_mock2, projectSummary_mock3 } from './projects.mock';

describe('ProjectsSearch', () => {
  let projectsSearch: ProjectsSearch;

  beforeAll(() => {
    projectsSearch.addDocument(projectSummary_mock1);
    projectsSearch.addDocument(projectSummary_mock2);
    projectsSearch.addDocument(projectSummary_mock3);
  });

  it('should find one result for KEGG', () => {
    const results: ProjectSummary[] = projectsSearch.search('KEGG');
    expect(results).toBeDefined();
    expect(results.length == 1).toBeTruthy();
    expect(results[0].id == '3fd').toBeTruthy();
  });

  it('should find one result for VCML', () => {
    const results: ProjectSummary[] = projectsSearch.search('VCML');
    expect(results).toBeDefined();
    expect(results.length == 1).toBeTruthy();
    expect(results[0].id == 'model3').toBeTruthy();
  });

  it('should find not find "needle"', () => {
    const results: ProjectSummary[] = projectsSearch.search('needle');
    expect(results).toBeDefined();
    expect(results.length == 0).toBeTruthy();
  });
});
