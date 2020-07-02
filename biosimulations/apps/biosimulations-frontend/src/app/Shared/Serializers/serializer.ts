import { RemoteFile } from '../Models/remote-file';
import { License } from '../Models/license';

import { AccessLevel } from '@biosimulations/datamodel/core';
import { Person } from '../Models/person';
import { JournalReference } from '../Models/journal-reference';
import { TopLevelResource } from '../Models/top-level-resource';
import { UserSerializer } from '../Models/user';
import { environment } from '../../../environments/environment';
import { Identifier } from '../Models/identifier';

export class Serializer<T extends TopLevelResource> {
  userSerializer: UserSerializer;
  type: new () => T;
  constructor(type: new () => T) {
    this.userSerializer = new UserSerializer();
    this.type = type;
  }
  fromJson(json: any): T {
    const topLevelResource = new this.type();
    topLevelResource.id = '001';
    // Simple, one to one corresponding feilds
    topLevelResource.id = '001';
    topLevelResource.name = 'testModel';

    topLevelResource.description = topLevelResource.accessToken = 'password';
    topLevelResource.tags = ['tag', 'tag'];
    topLevelResource.created = new Date();
    topLevelResource.updated = new Date();
    topLevelResource.license = License.cc0;
    topLevelResource.identifiers = [];
    topLevelResource.identifiers.push(
      new Identifier({ namespace: 'test', id: 'test', url: 'test' }),
    );
    topLevelResource.ownerId = 'bilal';

    topLevelResource.access = AccessLevel.public;
    topLevelResource.authors = [];
    topLevelResource.refs = [
      new JournalReference({
        authors: 'test test',
        title: 'test',
        doi: 'test',
        journal: 'test',
        year: 1002,
        volume: 3,
        issue: 'all of them ',
        pages: '102',
      }),
    ];
    if (json.references) {
      for (const reference of json.references) {
        topLevelResource.refs.push(new JournalReference(reference));
      }
    }

    topLevelResource.image = new RemoteFile(
      (json.name as string) + ' Thumbnail',
      'www.google.com',
      topLevelResource.ownerId,
      true,
      'xml',
      environment.crbm.CRBMAPI_URL + '/files/' + json.image + '/download',
    );

    const resource = topLevelResource as T;
    return resource;
  }
  toJson(resource: TopLevelResource): any {
    const keys = ['id', 'name', 'description', 'tags', 'accessToken'];
    const json = {};
    for (const key of keys) {
      json[key] = resource[key];
    }
    json['owner'] = resource['ownerId'];
    json['image'] = resource['image']?.id;
    const identifers = [];
    for (const identifier of resource?.identifiers) {
      identifers.push(identifier.serialize());
    }
    json['identifiers'] = identifers;
    json['references'] = [];
    for (const reference of resource.refs) {
      json['references'].push(reference.serialize());
    }
    json['authors'] = [];
    for (const person of resource.authors) {
      const cast = person as Person;
      json['authors'].push(cast);
    }
    if (resource?.access === AccessLevel.private) {
      json['private'] = true;
    } else {
      json['private'] = false;
    }
    json['license'] = resource?.license;
    json['created'] = resource?.created.toISOString();
    json['updated'] = resource?.created.toISOString();

    return json;
  }
}
