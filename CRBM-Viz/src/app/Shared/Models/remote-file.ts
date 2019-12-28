export class RemoteFile {
  constructor(name?: string, type?: string, url?: string, size?: number) {
    this.name = name;
    this.type = type;
    this.url = url;
    this.size = size;
  }
  name?: string; // original filename
  type?: string; // MIME type
  url?: string;
  size?: number; // size in bytes
}
