export class RemoteFile {
  constructor(
    name?: string,
    id?: string,
    owner?: string,
    isPrivate?: boolean,
    type?: string,
    url?: string,
    size?: number,
    metadata?: any
  ) {
    this.name = name;
    this.id = id;
    this.owner = owner;
    this.private = isPrivate;
    this.type = type;
    this.url = url;
    this.size = size;
    this.metadata = metadata;
  }
  name?: string; // original filename
  id?: string; // The id of the file on the server
  owner?: string; // The username of the owner of the file
  private?: boolean; // Whether the file is private to the owner
  type?: string; // MIME type
  url?: string;
  size?: number; // size in bytes
  metadata: any; // other metadata stored in the file
}
