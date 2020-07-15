import { MatTableDataSource } from '@angular/material/table';
import { Subscription, BehaviorSubject, Observable, merge, of } from 'rxjs';
import {
  BiomodelAttributes,
  OntologyTerm,
  UserId,
  Person,
} from '@biosimulations/datamodel/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { map, shareReplay } from 'rxjs/operators';
import { ModelHttpService } from '../services/model-http.service';
import { Injectable } from '@angular/core';
import { ModelResource } from '@biosimulations/datamodel/api';
import { Author } from '../../shared/viewmodels/author';
import { Taxon } from '../../shared/viewmodels/taxon';
import { Format } from '../../shared/viewmodels/format';

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

@Injectable()
export class ModelDataSource extends MatTableDataSource<ModelData> {
  paginator!: MatPaginator;
  sort!: MatSort;
  subscription?: Subscription;
  constructor(modelHttp: ModelHttpService) {
    super();

    let newData = modelHttp
      .loadAll()
      .pipe(
        shareReplay(1),
        map((value: ModelResource[]) =>
          value.map((model: ModelResource) => {
            return ModelDataSource.toDataModel(model);
          }),
        ),
      )
      .subscribe((value: ModelData[]) => (this.data = value));
  }
  static toDataModel(model: ModelResource): ModelData {
    const format = model.attributes.format;
    let modelData: ModelData = {
      id: model.id,
      name: model.attributes.metadata.name.replace('_', ' ').replace('-', ' '),
      tags: model.attributes.metadata.tags,
      framework: model.attributes.framework,
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
