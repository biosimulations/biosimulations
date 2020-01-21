import { TopLevelResource } from '../Models/top-level-resource';

export interface Serializer {
  fromJson(json: any): TopLevelResource;
  toJson(resource: TopLevelResource): any;
}
