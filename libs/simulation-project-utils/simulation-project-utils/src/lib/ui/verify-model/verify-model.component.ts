import { Component, OnInit } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { interval, of, takeWhile } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface LineGraphData {
  x?: number[];
  y?: number[];
  type: string;
  mode: string;
  marker?: { key: string };
  name?: string;
}

// type: 'scatter', mode: 'lines+points'
interface LineGraphLayout {
  width: number;
  height: number;
  title: string;
}

interface LineGraphConfig {
  data: LineGraphData[];
  layout: LineGraphLayout;
}

interface SimulationObservables {
  [outerKey: string]: {
    [innerKey: string]: number[];
  };
}

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
  public observableNames!: string[];
  public showExamplePlot = true;
  public defaultSimulators = ['amici', 'copasi', 'tellurium'];
  public minValue: number | undefined;
  public minRowKey: string | undefined;
  public minColKey: string | undefined;
  public optimalSimulator: string | undefined | null;
  public graphConfig!: LineGraphConfig;
  public graphConfigs: LineGraphConfig[] = [];

  public exampleOutputData = {
    MKKK: {
      copasi: [89.99999999999999, 58.39337576836103, 29.098107240593944, 14.204931906912767],
      tellurium: [90, 58.39332631552485, 29.09798187836074, 14.204972911253414],
    },
  };
  public graph = {
    data: [
      {
        y: this.exampleOutputData.MKKK.copasi,
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'red' },
        name: 'COPASI',
      },
      {
        y: this.exampleOutputData.MKKK.tellurium,
        type: 'scatter',
        mode: 'lines+points',
        marker: { color: 'blue' },
        name: 'tellurium',
      },
    ],
    layout: { width: 400, height: 300, title: 'MKKK over time' },
  };

  public constructor(private httpClient: HttpClient, private formBuilder: UntypedFormBuilder) {
    this.verificationFormGroup = this.formBuilder.group({
      modelFile: [null, Validators.required],
      startTime: [0, Validators.required],
      endTime: [10, Validators.required],
      steps: [100, Validators.required],
      // simulators: this.formBuilder.array(['amici', 'copasi', 'tellurium']),
      simulators: [this.defaultSimulators, Validators.required],
    });
  }

  public ngOnInit(): void {
    this.showExamplePlot = false;
  }

  public enableExamplePlot(): void {
    this.showExamplePlot = !this.showExamplePlot;
  }

  private calculateBestSimulator(): void {
    let min = Number.POSITIVE_INFINITY;
    let bestSimulator: string | undefined = undefined;

    for (const rowKey of this.tableHeaders) {
      for (const colKey of this.tableHeaders) {
        const value = this.rmseMatrix[rowKey][colKey];
        if (value > 0 && value < min) {
          min = value;
          this.minValue = min;
          this.minRowKey = rowKey;
          this.minColKey = colKey;
          bestSimulator = rowKey;
        }
      }
    }

    if (min === Number.POSITIVE_INFINITY) {
      this.minValue = undefined;
      this.minRowKey = undefined;
      this.minColKey = undefined;
      bestSimulator = undefined;
    }

    this.optimalSimulator = bestSimulator;
  }

  private setGraphData(outputResponse: any, observableName: string, width: number = 400, height: number = 400): void {
    // declare layout
    const layout: LineGraphLayout = { width: width, height: height, title: observableName };

    // parse obs data and declare graph data
    const resultData = outputResponse?.content?.results;
    const yData: LineGraphData[] = [];
    const obsData = resultData[observableName].output_data;
    const simulatorNames = Object.keys(obsData);
    simulatorNames.forEach((simulatorName) => {
      const simData = obsData[simulatorName];
      if (typeof simData !== 'string') {
        const graphData: LineGraphData = { type: 'scatter', mode: 'lines+points', y: simData, name: simulatorName };
        yData.push(graphData);
      }
    });

    // set graph config
    const config: LineGraphConfig = {
      data: yData,
      layout: layout,
    };

    this.graphConfig = config;
    this.graphConfigs.push(config);
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
                // store and parse results once the status == "COMPLETED"
                this.outputData = outputResponse;
                this.rmseMatrix = outputResponse.content?.results?.rmse;
                this.tableHeaders = Object.keys(this.rmseMatrix);
                this.calculateBestSimulator();

                // parse observable names
                const obsNames = Object.keys(outputResponse?.content?.results);
                const observableNames = obsNames.filter((value) => value !== 'rmse');
                observableNames.forEach((observableName) => {
                  this.setGraphData(outputResponse, observableName, 600, 500);
                });

                // cease loading once output is recieved
                this.isLoading = false;
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
