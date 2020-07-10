import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DispatchService {
  submitJob(fileToUpload: File, selectedSimulator: string) {
    const endpoint = 'http://localhost:3333/api/dispatch';
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('simulator', selectedSimulator);
    console.log(formData);
    return this.http.post(endpoint, formData);
  }

  constructor(private http: HttpClient) { }
}
