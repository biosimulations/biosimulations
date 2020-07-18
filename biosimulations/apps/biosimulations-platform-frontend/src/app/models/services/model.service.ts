import { Injectable } from '@angular/core';
import { ModelResource } from '@biosimulations/datamodel/api';
import { Framework } from '../../shared/views/framework';
import { Author } from '../../shared/views/author';
import { Taxon } from '../../shared/views/taxon';
import { Format } from '../../shared/views/format';
import { Person, OntologyTerm, UserId } from '@biosimulations/datamodel/core';
import { ModelHttpService } from './model-http.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Model {
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
  description: string;
  imageUrl: string;
  summary: string;
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
      description: model.attributes.metadata.description,
      summary: model.attributes.metadata.summary,
      imageUrl: '/assets/images/model-v1.svg',
    };
    return modelData;
  }
  refresh(id: string) {
    this.modelHttp.refresh(id);
  }
  get(id: string): Observable<Model | undefined> {
    return this.modelHttp.get(id).pipe(
      map((val: ModelResource | undefined) => {
        if (val !== undefined) {
          return ModelService.toDataModel(val);
        } else {
          return undefined;
        }
      }),
    );
  }
}
