import { MatTableDataSource } from '@angular/material/table';
import { Subscription, BehaviorSubject, Observable, merge, of } from 'rxjs';
import {
  BiomodelAttributes,
  OntologyTerm,
  Format,
  Taxon,
  UserId,
  Person,
} from '@biosimulations/datamodel/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { map } from 'rxjs/operators';
import { ModelHttpService } from '../services/model-http.service';
import { Injectable } from '@angular/core';
import { ModelResource } from '@biosimulations/datamodel/api';

class Author {
  constructor(
    private firstName: string,
    private lastName: string,
    private middleName: string | null,
  ) {}
  toString() {
    if (!this.middleName) {
      this.middleName = '';
    }
    return this.firstName + ' ' + this.middleName + ' ' + this.lastName;
  }
}
export interface ModelData {
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

const initData: ModelData[] = initDataFunc();
function initDataFunc(count = 100) {
  const items = [];

  for (let i = 0; i <= count; i++) {
    const item = {
      id: i + '',
      name: 'model' + i,
      tags: ['test', 'test2'],
      framework: {
        id: 'test',
        iri: 'test',
        name: 'test',
        ontology: 'test',
        description: 'test',
      },
      format: {
        id: 'test',
        name: 'name',
        version: '3',
        edamId: null,
        specUrl: null,
        url: null,
        extension: null,
        mimetype: null,
        sedUrn: null,
      },
      license: 'mit',
      authors: [
        new Author('bilal', 'shaikh', null),
        new Author('bilal', 'shaikh', null),
      ],
      owner: 'bilalshaikh42',
      created: new Date(Date.now() - 100000 * i),
      updated: new Date(),
      taxon: { id: 22, name: 'bilal' },
    };
    items.push(item);
  }
  return items;
}

@Injectable()
export class ModelDataSource extends MatTableDataSource<ModelData> {
  paginator!: MatPaginator;
  sort!: MatSort;
  subscription?: Subscription;
  constructor(modelHttp: ModelHttpService) {
    super([]);
    let newData = modelHttp
      .loadAll()
      .pipe(
        map((value: ModelResource[]) =>
          value.map((model: ModelResource) => {
            return ModelDataSource.toDataModel(model);
          }),
        ),
      )
      .subscribe((value: ModelData[]) => (this.data = value));
  }
  static toDataModel(model: ModelResource): ModelData {
    let modelData: ModelData = {
      id: model.id,
      name: model.attributes.metadata.name,
      tags: model.attributes.metadata.tags,
      framework: model.attributes.framework,
      format: model.attributes.format,
      authors: model.attributes.metadata.authors.map((person: Person) => {
        return new Author(person.firstName, person.lastName, person.middleName);
      }),
      owner: model.relationships.owner.data.id,
      created: new Date(model.meta.created),
      updated: new Date(model.meta.updated),
      taxon: model.attributes.taxon,
      license: model.attributes.metadata.license,
    };
    return modelData;
  }
  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
}
