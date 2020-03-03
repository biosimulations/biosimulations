import { Model } from '../Models/model';
import { RemoteFile } from '../Models/remote-file';
import { Taxon } from '../Models/taxon';
import { Format } from '../Models/format';
import { OntologyTerm } from '../Models/ontology-term';

import { Serializer } from './serializer';
import { environment } from 'src/environments/environment';
import { AccessLevel } from '../Enums/access-level';

export class ModelSerializer extends Serializer<Model> {
  constructor() {
    super(Model);
  }
  fromJson(json: any): Model {
    const model = super.fromJson(json);

    model.file = new RemoteFile(
      'Model',
      json.file,
      model.OWNER,
      model.access === AccessLevel.private,
      'xml',
      environment.crbm.CRBMAPI_URL + '/files/' + json.file + '/download'
    );

    // Nested fields
    if (json.taxon) {
      model.taxon = new Taxon(json.taxon.id, json.taxon.name);
    }

    if (json.format) {
      model.format = new Format(
        json.format.name,
        json.format.version,
        json.format.edamID,
        json.format.url
      );
    }
    if (json.framework) {
      model.framework = new OntologyTerm(
        json.framework.ontology,
        json.framework.id,
        json.framework.name,
        json.framework.description,
        json.framework.iri
      );
    }
    if (json.taxon) {
      model.taxon = new Taxon(json.taxon.id, json.taxon.name);
    }

    return model;
  }
  toJson(model: Model): any {
    return {};
  }
}
