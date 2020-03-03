import { RemoteFile } from '../Models/remote-file';
import { License } from '../Enums/license';
import { AccessLevel } from '../Enums/access-level';
import { Person } from '../Models/person';
import { JournalReference } from '../Models/journal-reference';
import { TopLevelResource } from '../Models/top-level-resource';
import { UserSerializer } from '../Models/user';
import { environment } from 'src/environments/environment';

export class Serializer<T extends TopLevelResource> {
  userSerializer: UserSerializer;
  type: new () => T;
  constructor(type: new () => T) {
    this.userSerializer = new UserSerializer();
    this.type = type;
  }
  fromJson(json: any): T {
    const topLevelResource = new this.type();
    topLevelResource.id = json.id;
    // Simple, one to one corresponding feilds
    topLevelResource.id = json.id;
    topLevelResource.name = json.name;

    topLevelResource.description = json.description;
    topLevelResource.accessToken = json.accessToken;
    topLevelResource.tags = json.tags;
    topLevelResource.created = new Date(Date.parse(json.created));
    topLevelResource.updated = new Date(Date.parse(json.updated));
    topLevelResource.license = json.license as License;
    topLevelResource.identifiers = [];
    // Owner if embedded
    if (typeof json.owner === 'string') {
      topLevelResource.ownerId = json.owner;
    } else if (typeof json.owner === 'object' && json.owner !== null) {
      topLevelResource.owner = this.userSerializer.fromJson(json.owner);
      topLevelResource.ownerId = topLevelResource.owner.userName;
    }
    if (json.private) {
      // Boolean
      topLevelResource.access = AccessLevel.private;
    } else {
      topLevelResource.access = AccessLevel.public;
    }

    if (json.authors) {
      topLevelResource.authors = [];
      for (const author of json.authors) {
        topLevelResource.authors.push(
          new Person(author.firstName, author.middleName, author.lastName)
        );
      }
    }
    topLevelResource.refs = [];
    if (json.references) {
      for (const reference of json.references) {
        topLevelResource.refs.push(
          new JournalReference(
            reference.authors,
            reference.title,
            reference.journal,
            reference.volume,
            reference.number,
            reference.pages,
            reference.year,
            reference.doi
          )
        );
      }
    }

    topLevelResource.image = new RemoteFile(
      (json.name as string) + ' Thumbnail',
      json.image,
      topLevelResource.ownerId,
      topLevelResource.access === AccessLevel.private,
      'xml',
      environment.crbm.CRBMAPI_URL + '/files/' + json.image + '/download'
    );

    const resource = topLevelResource as T;
    return resource;
  }
  toJson(resource: TopLevelResource): any {
    return {};
  }
}
