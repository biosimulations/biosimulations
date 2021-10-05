import { Injectable } from '@angular/core';
import {
  SedPlot2D,
  PlotlyDataLayout,
  PlotlyTrace,
  PlotlyTraceMode,
  PlotlyTraceType,
} from '@biosimulations/datamodel/common';
/*
import {
  SimulationRunOutput,
  SimulationRunResults,
  SimulationRunOutputDatum,
} from '@biosimulations/dispatch/api-models';
*/

interface SedDatasetResults {
  uri: string;
  id: string;
  location: string;
  outputId: string;
  label: string;
  values: (number | boolean | string)[];
}

interface SedDatasetResultsMap {
  [uri: string]: SedDatasetResults;
}

@Injectable({
  providedIn: 'root',
})
export class SedPlot2DVisualizationService {
  public getPlotlyDataLayout(simulationRunId: string, sedDocLocation: string, plot: SedPlot2D, results: any): PlotlyDataLayout {
    const resultsMap: SedDatasetResultsMap = this.getSimulationRunResults(`${sedDocLocation}/{plot.id}`, results);

    const traces: PlotlyTrace[] = [];
    const xAxisTitlesSet = new Set<string>();
    const yAxisTitlesSet = new Set<string>();
    let missingData = false;
    for (const curve of plot.curves) {
      const xId = curve.xDataGenerator._resultsDataSetId;
      const yId = curve.yDataGenerator._resultsDataSetId;
      xAxisTitlesSet.add(
        curve.xDataGenerator.name || curve.xDataGenerator.id,
      );
      yAxisTitlesSet.add(
        curve.yDataGenerator.name || curve.yDataGenerator.id,
      );
      const trace = {
        name: curve.name || curve.id,
        x: resultsMap?.[xId]?.values,
        y: resultsMap?.[yId]?.values,
        xaxis: 'x1',
        yaxis: 'y1',
        type: PlotlyTraceType.scatter,
        mode: PlotlyTraceMode.lines,
      };
      if (trace.x && trace.y) {
        traces.push(trace as PlotlyTrace);
      } else {
        missingData = true;
      }
    }

    const xAxisTitlesArr = Array.from(xAxisTitlesSet);
    const yAxisTitlesArr = Array.from(yAxisTitlesSet);
    let xAxisTitle: string | undefined = undefined;
    let yAxisTitle: string | undefined = undefined;
    let showLegend = false;

    if (xAxisTitlesArr.length == 1) {
      xAxisTitle = xAxisTitlesArr[0];
    } else if (xAxisTitlesArr.length > 1) {
      xAxisTitle = 'Multiple';
      showLegend = true;
    }

    if (yAxisTitlesArr.length == 1) {
      yAxisTitle = yAxisTitlesArr[0];
    } else if (yAxisTitlesArr.length > 1) {
      yAxisTitle = 'Multiple';
      showLegend = true;
    }

    if (missingData) {
      // TODO: handle error
    }

    const dataLayout: PlotlyDataLayout = {
      data: traces,
      layout: {
        xaxis1: {
          anchor: 'x1',
          title: xAxisTitle,
          type: plot.xScale,
        },
        yaxis1: {
          anchor: 'y1',
          title: yAxisTitle,
          type: plot.yScale,
        },
        grid: {
          rows: 1,
          columns: 1,
          pattern: 'independent',
        },
        showlegend: showLegend,
        width: undefined,
        height: undefined,
      },
    };

    return dataLayout;
  }

  private getSimulationRunResults(outputId: string, result: any): SedDatasetResultsMap {
    const outputs = outputId
      ? [result as any] // SimulationRunOutput
      : (result as any).outputs; // SimulationRunResults

    const datasetResultsMap: SedDatasetResultsMap = {};

    outputs.forEach((output: any): void => { // SimulationRunOutput
      const sedmlLocationOutputId = output.outputId;

      const sedmlLocation = this.getLocationFromSedmLocationId(
        sedmlLocationOutputId,
      );

      const outputId = this.getOutputIdFromSedmlLocationId(
        sedmlLocationOutputId,
      );

      output.data.forEach((datum: any): void => { // SimulationRunOutputDatum
        const uri = sedmlLocation + '/' + outputId + '/' + datum.id;
        datasetResultsMap[uri] = {
          uri: uri,
          id: datum.id,
          location: sedmlLocation,
          outputId: outputId,
          label: datum.label,
          values: datum.values,
        };
      });
    });

    return datasetResultsMap;
  }

  private getLocationFromSedmLocationId(locationId: string): string {
    // Remove the last "/" and the text after the last "/"
    // EG simulation_1.sedml/subfolder1/Figure_3b" => simulation_1.sedml/subfolder1
    // TODO write tests
    return locationId.split('/').reverse().slice(1).reverse().join('/');
  }

  private getOutputIdFromSedmlLocationId(location: string): string {
    return location.split('/').reverse()[0];
  }
}
