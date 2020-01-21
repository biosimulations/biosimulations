import { Model } from '../Models/model';
import { RemoteFile } from '../Models/remote-file';
import { License } from '../Enums/license';
import { AccessLevel } from '../Enums/access-level';
import { Taxon } from '../Models/taxon';
import { Format } from '../Models/format';
import { OntologyTerm } from '../Models/ontology-term';
import { Person } from '../Models/person';
import { JournalReference } from '../Models/journal-reference';
import { Serializer } from './serializer';

export class ModelSerializer extends Serializer<Model> {
  constructor() {
    super();
  }
  fromJson(json: any): Model {
    const res = super.fromJson(json);
    const newmodel = new Model();
    const model = Object.assign(newmodel, res);
    model.file = new RemoteFile('Model XML', 'xml', json.file, null);
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
        json.framework.ontonlogy,
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
  toJson(model: Model): any {}
}
