import { Injectable } from '@angular/core';
import { ModelResource } from '@biosimulations/platform/api-models';
import { Framework } from '../../shared/views/framework';
import { Author } from '../../shared/views/author';
import { Taxon } from '../../shared/views/taxon';
import { Format } from '../../shared/views/format';
import { Owner } from '../../shared/views/owner';
import {
  Person,
  IOntologyTerm,
  UserId,
} from '@biosimulations/datamodel/common';
import { ModelHttpService } from './model-http.service';
import { map } from 'rxjs/operators';
import { Observable, throwError, never } from 'rxjs';
import { LicenseModel } from '../../shared/views/license';
import { BiomodelVariable } from '../../shared/views/biomodelVariable';
import { BiomodelParameter } from '../../shared/views/biomodelParameter';

export interface Model {
  id: string;
  name: string;
  tags: string[];
  description: string;
  summary: string;
  imageUrl: string;

  framework: IOntologyTerm;
  format: Format;
  authors: Author[];
  owner: Owner;
  created: Date;
  updated: Date;
  taxon: Taxon | null;
  license: LicenseModel;
  variables: BiomodelVariable[];
  parameters: BiomodelParameter[];
}
@Injectable({
  providedIn: 'root',
})
export class ModelService {
  constructor(private modelHttp: ModelHttpService) {}

  static toDataModel(model: ModelResource): Model {
    const format = model.attributes.format;
    const modelData: Model = {
      id: model.id,
      name: model.attributes.metadata.name.replace('_', ' ').replace('-', ' '),
      tags: model.attributes.metadata.tags,
      framework: Framework.fromDTO(model.attributes.framework),
      format: Format.fromDTO(model.attributes.format),
      parameters: model.attributes.parameters.map((dto) =>
        BiomodelParameter.fromDto(dto),
      ),
      variables: model.attributes.variables.map((dto) =>
        BiomodelVariable.fromDTO(dto),
      ),

      authors: model.attributes.metadata.authors.map((person: Person) => {
        return new Author(person.firstName, person.lastName, person.middleName);
      }),
      owner: new Owner(model.relationships.owner.data.id),
      created: new Date(model.meta.created),
      updated: new Date(model.meta.updated),
      taxon: model.attributes.taxon
        ? new Taxon(model.attributes.taxon?.id, model.attributes.taxon?.name)
        : null,
      license: new LicenseModel(model.attributes.metadata.license),
      description: model.attributes.metadata.description,
      summary: model.attributes.metadata.summary,
      imageUrl: '/assets/images/default-resource-images/model.svg',
    };
    return modelData;
  }
  refresh(id: string) {
    this.modelHttp.refresh(id);
  }
  get(id: string): Observable<Model | undefined> {
    return this.modelHttp.get(id).pipe(
      map((val: ModelResource | undefined) => {
        if (val === undefined) {
          throwError('not found');
        } else {
          return ModelService.toDataModel(val);
        }
      }),
    );
  }
}
