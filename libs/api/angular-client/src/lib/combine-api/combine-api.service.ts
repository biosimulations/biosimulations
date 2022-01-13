import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Endpoints } from '@biosimulations/config/common';

@Injectable({
  providedIn: 'root',
})
export class CombineApiService {
  private endpoints = new Endpoints();

  constructor(private http: HttpClient) {}

  public addFileToCombineArchive(
    archiveFileOrUrl: File | string,
    newContentLocation: string,
    newContentFormat: string,
    newContentMaster: boolean,
    newContentFile: Blob,
    overwriteLocations = false,
    download = false,
  ): Observable<ArrayBuffer | string> {
    const formData = new FormData();

    if (typeof archiveFileOrUrl === 'object') {
      formData.append('files', archiveFileOrUrl);
      formData.append(
        'archive',
        JSON.stringify({ filename: archiveFileOrUrl.name }),
      );
    } else {
      formData.append('archive', JSON.stringify({ url: archiveFileOrUrl }));
    }

    const newContentFilename = '__new_content__';
    formData.append('files', newContentFile, newContentFilename);

    formData.append(
      'newContent',
      JSON.stringify({
        _type: 'CombineArchiveContent',
        location: newContentLocation,
        format: newContentFormat,
        master: newContentMaster,
        filename: newContentFilename,
      }),
    );

    formData.append('overwriteLocations', JSON.stringify(overwriteLocations));
    formData.append('download', JSON.stringify(download));

    const headers = {
      Accept: 'application/zip',
    };

    return this.http.post<string>(
      this.endpoints.getAddFileToCombineArchiveEndpoint(false),
      formData,
      {
        headers: headers,
        responseType: 'json',
      },
    );
  }
}
