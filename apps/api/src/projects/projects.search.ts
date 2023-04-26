import { ProjectSummary as IProjectSummary } from '@biosimulations/datamodel/api';
import elasticlunr, { Index, SearchResults } from 'elasticlunr';

export interface ProjectSummarySearchResults {
  projectSummaries: IProjectSummary;
  scores: number[];
}

export interface SearchableProjectSummary {
  id: string;
  title?: string;
  abstract?: string;
  description?: string;
  modelLanguageName?: string;
  projectSummary?: IProjectSummary;
}

export class ProjectsSearch {
  private searchIndex!: Index<SearchableProjectSummary>;
  private projectSummaryMap = new Map<string, IProjectSummary>();

  public constructor() {
    this.searchIndex = elasticlunr<SearchableProjectSummary>(function () {
      this.addField('title');
      this.addField('abstract');
      this.addField('description');
      this.addField('modelLanguageName');
      this.setRef('id');
    });
  }

  public addDocument(projectSummary: IProjectSummary): void {
    if (this.projectSummaryMap.has(projectSummary.id)) {
      return;
    }
    this.projectSummaryMap.set(projectSummary.id, projectSummary);
    const searchableProjectSummary = ProjectsSearch.toSearchableProjectSummary(projectSummary);
    this.searchIndex.addDoc(searchableProjectSummary);
  }

  public static toSearchableProjectSummary(projectSummary: IProjectSummary): SearchableProjectSummary {
    const id = projectSummary.id;
    let title = '';
    let abstract = '';
    let description: string | undefined = '';
    let modelLanguageName: string | undefined = '';
    // get modelLanguageName from any simulation tasks
    if (projectSummary.simulationRun.tasks) {
      for (const task of projectSummary.simulationRun.tasks) {
        modelLanguageName = task.model.language.name + ' ' + task.model.language.acronym;
        break;
      }
    }
    if (projectSummary.simulationRun.metadata) {
      for (const metadata of projectSummary.simulationRun.metadata) {
        if (metadata.title) title = metadata.title;
        if (metadata.abstract) abstract = metadata.abstract;
        if (metadata.description) description = metadata.description;
      }
    }
    const summary: SearchableProjectSummary = {
      abstract: abstract,
      description: description,
      id: id,
      modelLanguageName: modelLanguageName,
      projectSummary: projectSummary,
      title: title,
    };

    return summary;
  }

  public search(searchText: string, scoreThreshold: number = 0.0001): IProjectSummary[] {
    const searchResults: SearchResults[] = this.searchIndex.search(searchText);
    const projectSummaries: IProjectSummary[] = searchResults
      .filter((result) => result.score > scoreThreshold)
      .filter((result) => this.projectSummaryMap.has(result.ref))
      .map((result) => this.projectSummaryMap.get(result.ref)!);
    return projectSummaries;
  }
}
