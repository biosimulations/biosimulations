import { Injectable } from '@angular/core';
import { ModelResource } from '@biosimulations/datamodel/api';
import { ModelData } from '../browse-models/models-datasource';
import { Framework } from '../../shared/views/framework';
import { Author } from '../../shared/views/author';
import { Taxon } from '../../shared/views/taxon';
import { Format } from '../../shared/views/format';
import { Person } from '@biosimulations/datamodel/core';
import { ModelHttpService } from './model-http.service';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  constructor(modelHttp: ModelHttpService) {}

  static toDataModel(model: ModelResource): ModelData {
    const format = model.attributes.format;
    const modelData: ModelData = {
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
}
