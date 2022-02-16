import { Injectable } from '@angular/core';
import {
  SedPlot2D,
  SedStyle,
  SedLineStyleType,
  PlotlyDataLayout,
  PlotlyTrace,
  PlotlyTraceMode,
  PlotlyTraceType,
  PlotlyTraceLineDash,
  PlotlyTraceMarkerSymbol,
  SimulationRunOutput,
  SimulationRunOutputDatum,
  SimulationRunOutputDatumElement,
} from '@biosimulations/datamodel/common';
/*
import {
  SimulationRunOutput,
  SimulationRunResults,
  SimulationRunOutputDatum,
} from '@biosimulations/datamodel/api';
*/
import { flattenTaskResults, getRepeatedTaskTraceLabel } from '../utils/utils';
import hexToRgba from 'hex-to-rgba';

interface SedDatasetResults {
  uri: string;
  id: string;
  location: string;
  outputId: string;
  label: string;
  values: SimulationRunOutputDatumElement[];
}

interface SedDatasetResultsMap {
  [uri: string]: SedDatasetResults;
}

const sedLineStyleTypePlotlyMap: {
  [sedType: string]: PlotlyTraceLineDash | undefined;
} = {
  none: undefined,
  solid: 'solid',
  dash: 'dash',
  dot: 'dot',
  dashDot: 'dashdot',
  dashDotDot: 'longdashdot',
};

const sedMarkerStyleTypePlotlyMap: {
  [sedType: string]: PlotlyTraceMarkerSymbol | undefined;
} = {
  none: undefined,
  square: 'square',
  circle: 'circle',
  diamond: 'diamond',
  xCross: 'x',
  plus: 'cross',
  star: 'star',
  triangleUp: 'triangle-up',
  triangleDown: 'triangle-down',
  triangleLeft: 'triangle-left',
  triangleRight: 'triangle-right',
  hDash: 'line-ew',
  vDash: 'line-ns',
};

@Injectable({
  providedIn: 'root',
})
export class SedPlot2DVisualizationService {
  public getPlotlyDataLayout(
    simulationRunId: string,
    sedDocLocation: string,
    plot: SedPlot2D,
    results: SimulationRunOutput,
  ): PlotlyDataLayout {
    if (sedDocLocation.startsWith('./')) {
      sedDocLocation = sedDocLocation.substring(2);
    }

    const resultsMap: SedDatasetResultsMap =
      this.getSimulationRunResults(results);

    const traces: PlotlyTrace[] = [];
    const xAxisTitlesSet = new Set<string>();
    const yAxisTitlesSet = new Set<string>();
    const errors: string[] = [];
    for (const curve of plot.curves) {
      const xId =
        sedDocLocation + '/' + plot.id + '/' + curve.xDataGenerator.id;
      const yId =
        sedDocLocation + '/' + plot.id + '/' + curve.yDataGenerator.id;

      const xData = resultsMap?.[xId]?.values;
      const yData = resultsMap?.[yId]?.values;

      if (xData && yData) {
        xAxisTitlesSet.add(
          curve.xDataGenerator.name || curve.xDataGenerator.id,
        );
        yAxisTitlesSet.add(
          curve.yDataGenerator.name || curve.yDataGenerator.id,
        );

        const style: SedStyle | undefined = curve?.style
          ? this.resolveStyle(curve.style)
          : undefined;

        const flatData = flattenTaskResults([xData, yData]);

        for (let iTrace = 0; iTrace < flatData.data[0].length; iTrace++) {
          const name =
            (curve.name || curve.id) +
            (flatData.data[0].length > 1
              ? ` (${getRepeatedTaskTraceLabel(iTrace, flatData.outerShape)})`
              : '');
          const trace: PlotlyTrace = {
            name: name,
            x: flatData.data[0][iTrace],
            y: flatData.data[1][iTrace],
            xaxis: 'x1',
            yaxis: 'y1',
            type: PlotlyTraceType.scatter,
          };

          const hasLine = !(style?.line && style.line?.type === SedLineStyleType.none);
          const hasMarker = style?.marker && style.marker?.type && sedMarkerStyleTypePlotlyMap?.[style.marker.type];

          if (hasLine || hasMarker) {
            if (hasLine) {
              if (hasMarker) {
                trace.mode = PlotlyTraceMode.linesMarkers;
              } else {
                trace.mode = PlotlyTraceMode.lines;
              }
            } else {
              trace.mode = PlotlyTraceMode.markers;
            }
          } else {
            trace.mode = PlotlyTraceMode.none;
          }

          if (hasLine) {
            trace.line = {
              dash: style?.line?.type
                ? sedLineStyleTypePlotlyMap?.[style.line.type]
                : undefined,
              color: style?.line?.color
                ? hexToRgba(style.line.color)
                : undefined,
              width: style?.line?.thickness,
            };
            if (trace.line.dash === undefined) {
              trace.line.width = 0;
            }
          }

          if (hasMarker) {
            trace.marker = {
              symbol: style?.marker?.type
                ? sedMarkerStyleTypePlotlyMap[style.marker.type]
                : undefined,
              size: style?.marker?.size,
              color: style?.marker?.fillColor
                ? hexToRgba(style.marker.fillColor)
                : undefined,
            };

            if (style.marker?.lineColor || style.marker?.lineThickness) {
              trace.marker.line = {
                color: style.marker?.lineColor
                  ? hexToRgba(style.marker?.lineColor)
                  : undefined,
                width: style.marker?.lineThickness,
              };
            }
          }

          if (style?.fill) {
            console.warn(`Fill was ignored for curve '${curve.id}' of plot '${plot.id}'. SED-ML does not support fills for point curves.`);
            /*
            trace.fill = 'toself';
            trace.fillcolor = style.fill?.color
              ? hexToRgba(style.fill?.color)
              : undefined;
            */
          }

          traces.push(trace);
        }
      } else {
        errors.push(`Curve '${curve.id}' of '${xId}' and '${yId}'.`);
      }
    }

    const xAxisTitlesArr = Array.from(xAxisTitlesSet);
    const yAxisTitlesArr = Array.from(yAxisTitlesSet);
    let xAxisTitle: string | undefined;
    let yAxisTitle: string | undefined;
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

    const dataLayout: PlotlyDataLayout = {
      data: traces.length ? traces : undefined,
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
      dataErrors: errors.length > 0 ? errors : undefined,
    };

    return dataLayout;
  }

  private getSimulationRunResults(
    result: SimulationRunOutput,
  ): SedDatasetResultsMap {
    const datasetResultsMap: SedDatasetResultsMap = {};

    const sedmlLocationOutputId = result.outputId;

    const sedmlLocation = this.getLocationFromSedmLocationId(
      sedmlLocationOutputId,
    );

    const outputId = this.getOutputIdFromSedmlLocationId(sedmlLocationOutputId);

    result.data.forEach((datum: SimulationRunOutputDatum): void => {
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

    return datasetResultsMap;
  }

  private getLocationFromSedmLocationId(outputLocationId: string): string {
    // Remove the last "/" and the text after the last "/"
    // EG simulation_1.sedml/subfolder1/Figure_3b" => simulation_1.sedml/subfolder1
    // TODO write tests
    let docLocation = outputLocationId
      .split('/')
      .reverse()
      .slice(1)
      .reverse()
      .join('/');
    if (docLocation.startsWith('./')) {
      docLocation = docLocation.substring(2);
    }
    return docLocation;
  }

  private getOutputIdFromSedmlLocationId(location: string): string {
    return location.split('/').reverse()[0];
  }

  private resolveStyle(style: SedStyle): SedStyle {
    let resolvedStyle!: SedStyle;

    if (style?.base) {
      resolvedStyle = this.resolveStyle(style.base);
    } else {
      resolvedStyle = {
        _type: 'SedStyle',
        id: style.id,
      };
    }

    resolvedStyle.id = style.id;
    resolvedStyle.name = style?.name;
    resolvedStyle.base = style?.base;

    if (style?.line !== undefined) {
      if (resolvedStyle?.line === undefined) {
        resolvedStyle.line = {
          _type: 'SedLineStyle',
        };
      }
      if (style.line?.type !== undefined) {
        resolvedStyle.line.type = style.line.type;
      }
      if (style.line?.color !== undefined) {
        resolvedStyle.line.color = style.line.color;
      }
      if (style.line?.thickness !== undefined) {
        resolvedStyle.line.thickness = style.line.thickness;
      }
    }

    if (style?.marker !== undefined) {
      if (resolvedStyle?.marker === undefined) {
        resolvedStyle.marker = {
          _type: 'SedMarkerStyle',
        };
      }
      if (style.marker?.type !== undefined) {
        resolvedStyle.marker.type = style.marker.type;
      }
      if (style.marker?.size !== undefined) {
        resolvedStyle.marker.size = style.marker.size;
      }
      if (style.marker?.lineColor !== undefined) {
        resolvedStyle.marker.lineColor = style.marker.lineColor;
      }
      if (style.marker?.lineThickness !== undefined) {
        resolvedStyle.marker.lineThickness = style.marker.lineThickness;
      }
      if (style.marker?.fillColor !== undefined) {
        resolvedStyle.marker.fillColor = style.marker.fillColor;
      }
    }

    if (style?.fill !== undefined) {
      if (resolvedStyle?.fill === undefined) {
        resolvedStyle.fill = {
          _type: 'SedFillStyle',
          color: style.fill.color,
        };
      }
    }

    return resolvedStyle;
  }
}
