import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  SedDocumentReportsCombineArchiveContent,
  SedReport,
  SedDataSet,
  PlotlyDataLayout,
  PlotlyTraceType,
} from '@biosimulations/datamodel/common';
import { UriSedDataSetMap, UriSetDataSetResultsMap, Heatmap2DVisualization } from '@biosimulations/datamodel/project';
import { ViewService } from '@biosimulations/shared/project-service';
import { Observable, of, map } from 'rxjs';
import { Spec as VegaSpec } from 'vega';
import vegaTemplate from './vega-template.json';
import { Endpoints } from '@biosimulations/config/common';

@Component({
  selector: 'biosimulations-project-design-heatmap-2d-visualization',
  templateUrl: './design-heatmap-2d-viz.component.html',
  styleUrls: ['./design-heatmap-2d-viz.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignHeatmap2DVisualizationComponent implements OnInit {
 @Input()
  visualization!: Heatmap2DVisualization;

  @Input()
  simulationRunId!: string;
  
  @Input()
  combineArchiveSedDocs!: SedDocumentReportsCombineArchiveContent[];

  @Input()
  uriSedDataSetMap!: UriSedDataSetMap;

  @Input()
  formGroup!: FormGroup;
  
  yDataSetsFormControl!: FormControl;

  private endpoints = new Endpoints();

  constructor(private formBuilder: FormBuilder, private viewService: ViewService) {}

  ngOnInit(): void {
    this.formGroup.setControl(
      'yDataSets',
      this.formBuilder.control([], [Validators.minLength(1)]),
    );
    this.formGroup.setControl(
      'xDataSet',
      this.formBuilder.control(null),
    );

    this.yDataSetsFormControl = this.formGroup.controls
      .yDataSets as FormControl;
  }

  public setSelectedDataSets(
    type: 'SedDocument' | 'SedReport' | 'SedDataSet',
    sedDocument: SedDocumentReportsCombineArchiveContent,
    sedDocumentId: string,
    report?: SedReport,
    reportId?: string,
    dataSet?: SedDataSet,
    dataSetId?: string,
  ): void {
    const formControl = this.yDataSetsFormControl;
    sedDocument = sedDocument as SedDocumentReportsCombineArchiveContent;

    const selectedUris = new Set(formControl.value);

    const uri =
      sedDocumentId +
      (reportId ? '/' + reportId : '') +
      (dataSetId ? '/' + dataSetId : '');
    const selected = selectedUris.has(uri);

    if (type === 'SedDocument') {
      sedDocument.location.value.outputs.forEach((report: SedReport): void => {
        const reportUri = uri + '/' + report.id;
        if (selected) {
          selectedUris.add(reportUri);
        } else {
          selectedUris.delete(reportUri);
        }

        report.dataSets.forEach((dataSet: SedDataSet): void => {
          const dataSetUri = reportUri + '/' + dataSet.id;
          if (selected) {
            selectedUris.add(dataSetUri);
          } else {
            selectedUris.delete(dataSetUri);
          }
        });
      });
    } else if (type === 'SedReport') {
      if (!selected) {
        selectedUris.delete(sedDocumentId);
      }

      (report as SedReport).dataSets.forEach((dataSet: SedDataSet): void => {
        const dataSetUri = uri + '/' + dataSet.id;
        if (selected) {
          selectedUris.add(dataSetUri);
        } else {
          selectedUris.delete(dataSetUri);
        }
      });

      let hasAllReports = true;
      for (const report of sedDocument.location.value.outputs) {
        const reportUri = sedDocumentId + '/' + (report as SedReport).id;
        if (!selectedUris.has(reportUri)) {
          hasAllReports = false;
          break;
        }
      }
      if (hasAllReports) {
        selectedUris.add(sedDocumentId);
      }
    } else {
      if (selected) {
        let hasAllDataSets = true;
        for (const dataSet of (report as SedReport).dataSets) {
          const dataSetUri =
            sedDocumentId + '/' + (report as SedReport).id + '/' + dataSet.id;
          if (!selectedUris.has(dataSetUri)) {
            hasAllDataSets = false;
            break;
          }
        }
        if (hasAllDataSets) {
          selectedUris.add(sedDocumentId + '/' + (reportId as string));
        }

        let hasAllReports = true;
        for (const report of sedDocument.location.value.outputs) {
          const reportUri = sedDocumentId + '/' + (report as SedReport).id;
          if (!selectedUris.has(reportUri)) {
            hasAllReports = false;
            break;
          }
        }
        if (hasAllReports) {
          selectedUris.add(sedDocumentId);
        }
      } else {
        selectedUris.delete(sedDocumentId + '/' + (reportId as string));
        selectedUris.delete(sedDocumentId);
      }
    }

    formControl.setValue(Array.from(selectedUris));
  }

  public getPlotlyDataLayout(): Observable<PlotlyDataLayout | false> {
    const formGroup = this.formGroup;
    const yFormControl = formGroup.controls.yDataSets as FormControl;
    const xFormControl = formGroup.controls.xDataSet as FormControl;
    const selectedYUris = yFormControl.value;
    const selectedXUri = xFormControl.value;

    const dataSetUris = [...selectedYUris];
    dataSetUris.push(selectedXUri);

    return this.viewService.getReportResults(this.simulationRunId, dataSetUris).pipe(
      map((uriResultsMap: UriSetDataSetResultsMap): PlotlyDataLayout | false => {
        let missingData = false;

        const zData: any[][] = [];
        const yTicks: string[] = [];
        for (let selectedUri of selectedYUris) {
          if (selectedUri.startsWith('./')) {
            selectedUri = selectedUri.substring(2);
          }

          const selectedDataSet = this.uriSedDataSetMap?.[selectedUri];
          if (selectedDataSet) {
            const data = uriResultsMap?.[selectedUri];
            if (data) {
              const flattenedData = this.viewService.flattenArray(data.values);
              zData.push(flattenedData);
              yTicks.push(data.label);
            } else {
              missingData = true;
              break;
            }
          }
        }

        let xTicks: any[] | undefined = undefined;
        let xAxisTitle: string | undefined = undefined;
        if (selectedXUri) {
          const data = uriResultsMap?.[selectedXUri];
          if (data) {
            xTicks = this.viewService.flattenArray(data.values);
            xAxisTitle = data.label;
          } else {
            missingData = true;
          }
        }

        zData.reverse();
        yTicks.reverse();

        const trace = {
          z: zData,
          y: yTicks,
          x: xTicks,
          xaxis: 'x1',
          yaxis: 'y1',
          type: PlotlyTraceType.heatmap,
          hoverongaps: false,
        };

        const dataLayout = {
          data: [trace],
          layout: {
            xaxis1: {
              anchor: 'x1',
              title: xAxisTitle,
              type: 'linear',
            },
            //yaxis1: {
            //  anchor: 'y1',
            //  title: undefined,
            //  type: 'linear',
            //},
            grid: {
              rows: 1,
              columns: 1,
              pattern: 'independent',
            },
            showlegend: false,
            width: undefined,
            height: undefined,
          },
        } as PlotlyDataLayout;

        if (missingData) {
          return false;
        } else {
          return dataLayout;
        }
      })
    );
  }

  public exportToVega(): Observable<VegaSpec> {
    return of({});
  }
}
