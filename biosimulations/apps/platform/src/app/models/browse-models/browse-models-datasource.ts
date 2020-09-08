// TODO: remove or merge with `./models-datasource.ts`

import { DataSource } from '@angular/cdk/collections';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';

import {
  BiomodelAttributes,
  OntologyTerm,
  UserId,
  Person,
} from '@biosimulations/shared/datamodel';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { map, shareReplay, tap } from 'rxjs/operators';
import { ModelHttpService } from '../services/model-http.service';
import { Injectable } from '@angular/core';
import { ModelResource } from '@biosimulations/platform/api-models';
import { Author } from '../../shared/views/author';
import { Taxon } from '../../shared/views/taxon';
import { Format } from '../../shared/views/format';
import { Framework } from '../../shared/views/framework';

export interface ModelTableItem {
  id: string;
  name: string;
  tags: string[];
  framework: OntologyTerm;
  format: Format;
  authors: Author[];
  owner: UserId;
  created: Date;
  updated: Date;
  taxon: Taxon | null;
  license: string;
}

/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
@Injectable()
export class ModelTableDataSource extends DataSource<ModelTableItem> {
  data: ModelTableItem[] = [];
  paginator!: MatPaginator;
  sort!: MatSort;
  private isLoading = new BehaviorSubject(true);
  searchPredicate: Observable<string | null> = observableOf(null);

  constructor(private modelHttp: ModelHttpService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ModelTableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [this.paginator.page, this.sort.sortChange];

    return merge(...dataMutations).pipe(
      map(() => {
        return this.getPagedData(this.getSortedData([...this.data]));
      }),
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: ModelTableItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: ModelTableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'id':
          return compare(+a.id, +b.id, isAsc);
        default:
          return 0;
      }
    });
  }
  private getFilteredData(data: ModelTableItem[]) {}
  isLoading$() {
    return this.isLoading.asObservable();
  }
}
/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function toDataModel(model: ModelResource): ModelTableItem {
  const format = model.attributes.format;
  const modelData: ModelTableItem = {
    id: model.id,
    name: model.attributes.metadata.name.replace('_', ' ').replace('-', ' '),
    tags: model.attributes.metadata.tags,
    framework: new Framework(model.attributes.framework),
    format: new Format(
      format.id,
      format.name,
      format.version,
      format.edamId,
      format.specUrl,
      format.url,
      format.mimetype,
      format.extension,
      format.sedUrn,
    ),
    authors: model.attributes.metadata.authors.map((person: Person) => {
      return new Author(person.firstName, person.lastName, person.middleName);
    }),
    owner: model.relationships.owner.data.id,
    created: new Date(model.meta.created),
    updated: new Date(model.meta.updated),
    taxon: model.attributes.taxon
      ? new Taxon(model.attributes.taxon?.id, model.attributes.taxon?.name)
      : null,
    license: model.attributes.metadata.license,
  };
  return modelData;
}
