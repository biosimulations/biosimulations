/**
 * The files to be uploaded
 */
export class FileInput {
  private readonly _fileNames: string;

  public constructor(private _files: File[] | null, private delimiter: string = ', ') {
    this._fileNames = (this._files || []).map((f: File) => f.name).join(delimiter);
  }

  public get files(): File[] | null {
    return this._files || [];
  }

  public get fileNames(): string {
    return this._fileNames;
  }
}
