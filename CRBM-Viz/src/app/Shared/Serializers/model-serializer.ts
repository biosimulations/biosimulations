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
    const model = new Model();
    model.id = json.id;
    // Simple, one to one corresponding feilds
    model.id = json.id;
    model.name = json.name;
    model.image = new RemoteFile('model Picture', 'png', json.image, null);
    model.description = json.description;
    model.accessToken = json.accessToken;
    model.tags = json.tags;
    model.created = new Date(Date.parse(json.created));
    model.updated = new Date(Date.parse(json.updated));
    model.license = json.license as License;
    model.identifiers = [];
    model.OWNER = json.owner;
    // Boolean
    if (json.private) {
      model.access = AccessLevel.private;
    } else {
      model.access = AccessLevel.public;
    }

    if (json.authors) {
      model.authors = [];
      for (const author of json.authors) {
        model.authors.push(
          new Person(author.firstName, author.middleName, author.lastName)
        );
      }
    }
    model.refs = [];
    if (json.references) {
      for (const refrence of json.references) {
        model.refs.push(
          new JournalReference(
            refrence.authors,
            refrence.title,
            refrence.journal,
            refrence.volume,
            refrence.number,
            refrence.pages,
            refrence.year,
            refrence.doi
          )
        );
      }
    }

    console.log('From json');
    console.log(model);
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
