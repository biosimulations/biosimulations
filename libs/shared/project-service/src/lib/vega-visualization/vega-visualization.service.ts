import { Injectable } from '@angular/core';
import {
  SedDocument,
  SedSimulation,
  SedReport,
  SedDocumentSpecifications,
} from '@biosimulations/datamodel/common';
import { Spec as VegaSpec } from 'vega';
import { Endpoints } from '@biosimulations/config/common';

@Injectable({
  providedIn: 'root',
})
export class VegaVisualizationService {
  private endpoints = new Endpoints();

  public linkSignalsAndDataSetsToSimulationsAndResults(
    simulationRunId: string, sedDocumentConfigurations: SedDocumentSpecifications[], spec: VegaSpec
  ): VegaSpec | false {
    if (Array.isArray(spec?.signals)) {
      for (const signal of spec?.signals) {
        const anySignal = signal as any;

        if ('sedmlUri' in signal) {
          const sedmlSimulationAttributePath = anySignal.sedmlUri as any;
          anySignal.value = this.getValueOfSedmlObjectAttribute(
            sedmlSimulationAttributePath,
            sedDocumentConfigurations,
          );
          if (anySignal.value === undefined) {
            return false;
          }
          delete anySignal['sedmlUri'];
        }

        if ('bind' in signal) {
          const bind = signal.bind as any;
          for (const [key, val] of Object.entries(bind)) {
            const anyVal = val as any;
            if (
              anyVal != null &&
              typeof anyVal === 'object' &&
              'sedmlUri' in anyVal
            ) {
              bind[key] = this.getValueOfSedmlObjectAttribute(
                anyVal['sedmlUri'],
                sedDocumentConfigurations,
              );
              if (bind[key] === undefined) {
                return false;
              }
            }
          }
        }
      }
    }

    if (Array.isArray(spec?.data)) {
      for (const data of spec?.data) {
        const anyData = data as any;
        const name = anyData?.name;
        if ('sedmlUri' in anyData) {
          if (
            anyData.sedmlUri?.length == 0 ||
            (anyData.sedmlUri?.length == 2 &&
              this.getSedReport(anyData.sedmlUri, sedDocumentConfigurations) &&
              !Array.isArray(this.getSedReport(anyData.sedmlUri, sedDocumentConfigurations)))
          ) {
            anyData.url = this.endpoints.getRunResultsEndpoint(
              simulationRunId,
              anyData.sedmlUri.join('/'),
              true,
            );
            anyData.format = {
              type: 'json',
              property: anyData.sedmlUri?.length == 0 ? 'outputs' : 'data',
            };
            delete anyData['sedmlUri'];
            if ('values' in anyData) {
              delete anyData['values'];
            }
          } else {
            return false;
          }
        }
      }
    }
    return spec;
  }

  private getSedDocument(path: any, sedDocumentConfigurations: SedDocumentSpecifications[]): SedDocument | SedDocument[] | undefined {
    if (!Array.isArray(path)) {
      return undefined;
    }

    if (!sedDocumentConfigurations) {
      console.error('No sedDocumentConfigurations');
      return undefined;
    }

    const contentTypeUriStr = path?.[0];
    if (
      !(
        typeof contentTypeUriStr === 'string' ||
        contentTypeUriStr instanceof String
      )
    ) {
      return undefined;
    }

    const contentTypeUriArr = contentTypeUriStr.split(':');
    const contentType =
      contentTypeUriArr.length === 1 ? '' : contentTypeUriArr[0];
    let contentUri = contentTypeUriArr[contentTypeUriArr.length - 1];

    if (contentUri.startsWith('./')) {
      contentUri = contentUri.substring(2);
    }

    const contents: SedDocument[] = [];
    const multipleContents = contentUri === '*';

    for (
      let iContent = 0;
      iContent < sedDocumentConfigurations.length;
      iContent++
    ) {
      const content = sedDocumentConfigurations[iContent];
      let thisContentUri = content.id;
      if (thisContentUri.startsWith('./')) {
        thisContentUri = thisContentUri.substring(2);
      }
      if (
        ['', 'SedDocument'].includes(contentType) &&
        (['*', thisContentUri].includes(contentUri) ||
          contentUri === `[${iContent}]`)
      ) {
        contents.push(content as SedDocument);
      }
    }

    if (multipleContents) {
      return contents;
    } else if (contents.length) {
      return contents[0];
    } else {
      return undefined;
    }
  }

  private getSedReport(path: any, sedDocumentConfigurations: SedDocumentSpecifications[]): SedReport | SedReport[] | undefined {
    const sedDocument: SedDocument | SedDocument[] | undefined =
      this.getSedDocument(path, sedDocumentConfigurations);
    if (!sedDocument || Array.isArray(sedDocument)) {
      return undefined;
    }

    const reportTypeIdStr = path?.[1];
    if (
      !(
        typeof reportTypeIdStr === 'string' || reportTypeIdStr instanceof String
      )
    ) {
      return undefined;
    }

    const reportTypeIdArr = reportTypeIdStr.split(':');
    const reportType = reportTypeIdArr.length === 1 ? '' : reportTypeIdArr[0];
    const reportId = reportTypeIdArr[reportTypeIdArr.length - 1];

    const reports: SedReport[] = [];
    const multipleReports = reportId === '*';

    let iReport = -1;
    for (const thisOutput of sedDocument.outputs) {
      if (thisOutput._type == 'SedReport') {
        iReport++;
        if (
          ['', 'Report'].includes(reportType) &&
          (['*', thisOutput.id].includes(reportId) ||
            reportId === `[${iReport}]`)
        ) {
          reports.push(thisOutput as SedReport);
        }
      }
    }

    if (multipleReports) {
      return reports;
    } else {
      if (reports.length) {
        return reports[0];
      }
    }

    return undefined;
  }

  private getValueOfSedmlObjectAttribute(path: any, sedDocumentConfigurations: SedDocumentSpecifications[]): any {
    const sedDocument: SedDocument | SedDocument[] | undefined =
      this.getSedDocument(path, sedDocumentConfigurations);
    if (!sedDocument) {
      return undefined;
    }

    const objectTypeIdStr = path?.[1];
    if (
      !(
        typeof objectTypeIdStr === 'string' || objectTypeIdStr instanceof String
      )
    ) {
      return undefined;
    }
    const objectTypeIdArr = objectTypeIdStr.split(':');
    const objectType = objectTypeIdArr.length === 1 ? '' : objectTypeIdArr[0];
    const objectId = objectTypeIdArr[objectTypeIdArr.length - 1];

    const sedObjects: (SedSimulation | SedReport)[] = [];
    const multipleSedObjects = objectId === '*' || Array.isArray(sedDocument);
    const sedDocuments = Array.isArray(sedDocument)
      ? sedDocument
      : [sedDocument];

    for (const sedDocument of sedDocuments) {
      for (let iSim = 0; iSim < sedDocument.simulations.length; iSim++) {
        const thisSimulation = sedDocument.simulations[iSim];
        if (
          ['Simulation', ''].includes(objectType) &&
          (['*', thisSimulation.id].includes(objectId) ||
            objectId === `[${iSim}]`)
        ) {
          sedObjects.push(thisSimulation);
        }
      }
      let iReport = -1;
      for (let iOutput = 0; iOutput < sedDocument.outputs.length; iOutput++) {
        const thisOutput = sedDocument.outputs[iOutput];
        if (thisOutput._type == 'SedReport') {
          iReport++;
          if (
            ['Report', ''].includes(objectType) &&
            (['*', thisOutput.id].includes(objectId) ||
              objectId === `[${iReport}]`)
          ) {
            sedObjects.push(thisOutput as SedReport);
          }
        }
      }
    }

    if (!multipleSedObjects && !sedObjects.length) {
      return undefined;
    }

    if (path.length > 3) {
      return undefined;
    }

    let attributeName = path?.[2];
    if (
      !(typeof attributeName === 'string' || attributeName instanceof String)
    ) {
      return undefined;
    }
    if (attributeName === 'numberOfPoints') {
      attributeName = 'numberOfSteps';
    }

    const attributeValues: any[] = [];
    for (const sedObject of sedObjects) {
      if (attributeName in (sedObject as any)) {
        attributeValues.push((sedObject as any)[attributeName]);
      } else {
        return undefined;
      }
    }

    if (multipleSedObjects) {
      return attributeValues;
    } else {
      return attributeValues[0];
    }

    return undefined;
  }
}

