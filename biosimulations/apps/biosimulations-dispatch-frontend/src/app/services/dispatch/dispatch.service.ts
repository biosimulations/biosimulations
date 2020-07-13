import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DispatchService {
  submitJob(fileToUpload: File, selectedSimulator: string) {
    const endpoint = `${environment.crbm.DISPATCH_API_URL}/dispatch`;

    // TODO: Create a datamodel to hold the schema for simulation spec for frontend
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('simulator', selectedSimulator);
    console.log(formData);
    return this.http.post(endpoint, formData);
  }

  constructor(private http: HttpClient) { }
}
