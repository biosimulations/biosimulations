import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { RemoteFile } from '../../Models/remote-file';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private http: HttpClient, private injector: Injector) {}
  public create(
    file: File,
    name?: string,
    type?: string,
    isprivate?: boolean,
    owner?: string,
    id?: string
  ): Observable<string> {
    return of('5e5dae15053c527deb65d33f');
  }
  public read(id: string): Observable<RemoteFile> {
    const file = new RemoteFile(
      'model.xml',
      '5e5dae15053c527deb65d33f',
      'bilalshaikh42',
      false,
      'xml',
      'localhost:5001/5e571e1b7051aa2c8814ceeb/download',
      200,
      {}
    );
    return of(file);
  }
}
