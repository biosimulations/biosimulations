import { Component, OnInit } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { interval, of, takeWhile } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

/* const content: Content = {
job_id: v.content.job_id, timestamp: v.content.job_id, status: v.content.status, results: v.content.results, rmse: v.content.rmse, source: v.content.source, requestedSimulators: v.content.requested_simulators }
 */

@Component({
  selector: 'biosimulations-verify-model',
  templateUrl: './verify-model.component.html',
  styleUrls: ['./verify-model.component.scss'],
})
export class VerifyModelComponent implements OnInit {
  public verificationFormGroup: UntypedFormGroup;
  public outputData: any = null;
  public isLoading = false;
  public rmseMatrix!: { [key: string]: { [key: string]: number } };
  public tableHeaders: string[] = [];
  public isSubmitted = false;

  public constructor(private httpClient: HttpClient, private formBuilder: UntypedFormBuilder) {
    this.verificationFormGroup = this.formBuilder.group({
      modelFile: [null, Validators.required],
      startTime: [0, Validators.required],
      endTime: [100, Validators.required],
      steps: [3, Validators.required],
      simulators: this.formBuilder.array(['amici', 'copasi', 'tellurium']),
    });
  }

  public ngOnInit(): void {
    console.log('Init');
  }

  public onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.verificationFormGroup.patchValue({
        modelFile: file,
      });
    }
  }

  public onSubmitVerification(): void {
    if (this.verificationFormGroup.valid) {
      this.isSubmitted = true;
      const formValues = this.verificationFormGroup.value;
      const simulatorsArray = this.verificationFormGroup.get('simulators')?.value as string[];
      const queryParams = {
        start: formValues.startTime,
        end: formValues.endTime,
        steps: formValues.steps,
        simulators: simulatorsArray,
      };

      const formData = new FormData();
      const modelFile: File = this.verificationFormGroup.get('modelFile')?.value;
      if (modelFile) {
        formData.append('uploaded_file', modelFile);
      }

      this.isLoading = true;
      this.httpClient
        .post<{ job_id: string }>('https://biochecknet.biosimulations.org/verify-sbml', formData, {
          params: queryParams,
        })
        .pipe(
          switchMap((response) => {
            const jobId = response.job_id;
            if (jobId) {
              // Poll the server every 2 seconds to check the status
              return interval(2000).pipe(
                switchMap(() =>
                  this.httpClient.get<{ status: string; result: any }>(
                    `https://biochecknet.biosimulations.org/get-output/${jobId}`,
                  ),
                ),
                // eslint-disable-next-line max-len
                takeWhile((outputResponse: any) => outputResponse.content.status !== 'COMPLETED', true),
              );
            } else {
              console.error('job_id not found in response.');
              return of(null);
            }
          }),
          catchError((error) => {
            console.error('Error during verification or fetching output:', error);
            this.isLoading = false; // Stop loading on error
            return of(null);
          }),
        )
        .subscribe(
          (outputResponse) => {
            if (outputResponse) {
              if (outputResponse?.content?.results?.rmse !== undefined) {
                this.outputData = outputResponse; // Store the result once the status is 'COMPLETED'
                this.rmseMatrix = outputResponse.content?.results?.rmse;
                this.tableHeaders = Object.keys(this.rmseMatrix);
                this.isLoading = false; // Stop loading once the result is received
              }
            } else {
              console.error('No output response received.');
              this.isLoading = false; // Stop loading if no response is received
            }
          },
          (error) => {
            console.error('Error retrieving output:', error);
            this.isLoading = false; // Stop loading on error
          },
        );
    }
  }
}
