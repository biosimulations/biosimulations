import { Model } from '../Models/model';
import { RemoteFile } from '../Models/remote-file';
import { Taxon } from '../Models/taxon';
import { Format } from '../Models/format';
import { OntologyTerm } from '../Models/ontology-term';

import { Serializer } from './serializer';
import { environment } from '../../../environments/environment';
import { AccessLevel } from '@biosimulations/datamodel/core';

export class ModelSerializer extends Serializer<Model> {
  constructor() {
    super(Model);
  }
  fromJson(json: any): Model {
    const model = super.fromJson(json);

    model.file = new RemoteFile(
      'Model',
      json.file,
      model.ownerId,
      model.access === AccessLevel.private,
      'xml',
      environment.crbm.CRBMAPI_URL + '/files/' + json.file + '/download',
    );

    // Nested fields
    if (json.taxon) {
      model.taxon = new Taxon(json.taxon.id, json.taxon.name);
    }

    if (json.format) {
      model.format = new Format({
        name: json?.format?.name,
        version: json?.format?.version,
        edamId: json?.format?.edamId,
        url: json?.format?.url,
      });
    }
    if (json.framework) {
      model.framework = new OntologyTerm(json.framework);
    }
    if (json.taxon) {
      model.taxon = new Taxon(json.taxon.id, json.taxon.name);
    }

    return model;
  }
  toJson(model: Model): any {
    const json = super.toJson(model);
    json['format'] = model?.format?.serialize();
    json['taxon'] = model?.taxon?.serialize();
    json['file'] = model.file?.id;
    json['framework'] = model.framework?.serialize();
    return json;
  }
}
