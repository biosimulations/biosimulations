/**
 * @file results.service Uses the mounted nfs to read the results file for a particular simulations
 * Parses them into individual reports, and then uploads them to the dispatch api.
 * @author Bilal Shaikh <bilalshaikh42@gmail.com>
 * 2020-12-13
 * @copyright Biosimulations Team 2020
 * @license MIT
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import csv from 'csvtojson';

import readline from 'readline';
import fs from 'fs';
import { SimulationRunReportDataStrings } from '@biosimulations/dispatch/api-models';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import {
  DispatchProcessedPayload,
  DispatchMessage,
  DispatchFailedPayload,
} from '@biosimulations/messages/messages';
import { ClientProxy } from '@nestjs/microservices';
import { FileService, resultFile } from './file.service';

@Injectable()
export class ResultsService {
  private logger = new Logger(ResultsService.name);

  public constructor(
    private readonly fileService: FileService,
    private submit: SimulationRunService,
    @Inject('NATS_CLIENT') private client: ClientProxy,
  ) {}

  public async createResults(id: string, transpose: boolean): Promise<void> {
    const resultsDirectory = this.fileService.getResultsDirectory(id);
    //const resultsDirectory = 'testDir';

    try {
      const fileList: resultFile[] = await this.fileService.getFilesRecursively(
        resultsDirectory,
      );
      /* @todo Change this to hdf
       * @body change this to hdf files to implement changes needed for #1669
       */
      const csvFileList = fileList.filter((value: resultFile) =>
        value.name.endsWith('.csv'),
      );

      const resultPromises: Promise<void>[] = [];

      csvFileList.forEach((file: resultFile) => {
        resultPromises.push(this.uploadResultFile(id, file, transpose));
      });
      return (
        Promise.all(resultPromises)
          .then((_) => {
            const data: DispatchProcessedPayload = {
              _message: DispatchMessage.processed,
              id: id,
            };
            this.client.emit(DispatchMessage.processed, data);
          })
          //This is catching any errors from Sending the results
          .catch((e) => {
            this.logger.error('Failed to upload all results');
            this.logger.error(e);
            const data: DispatchFailedPayload = new DispatchFailedPayload(
              id,
              false,
            );
            this.client.emit(DispatchMessage.failed, data);
            throw e; //pass on error to controller
          })
      );
      // This is catching any errors from reading the results
    } catch (e) {
      this.logger.error(e);
      const data: DispatchFailedPayload = new DispatchFailedPayload(id, false);
      this.client.emit(DispatchMessage.failed, data);
      throw e;
    }
  }

  private async readCSV(file: string): Promise<SimulationRunReportDataStrings> {
    // info https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line

    try {
      const rlp = readline.createInterface({
        terminal: false,
        input: fs.createReadStream(file),
        crlfDelay: Infinity,
      });
      const resultObject: SimulationRunReportDataStrings = {};

      for await (const line of rlp) {
        const header = line.split(',')[0];
        resultObject[header] = [];
        const values = line.split(',').slice(1);
        values.forEach((value) => resultObject[header].push(value));
      }

      return resultObject;
    } catch (error) {
      this.logger.error('ERROR reading results file');
      this.logger.error(file);
      this.logger.error(error);
      throw error;
    }
    // This should be much faster way to do it @Todo investigate
    /*    rlp.on('line', (input) => {
      const header = input.split(',')[0];
      resultObject[header] = [];
      const values = input.split(',').slice(1);
      values.forEach((value) => resultObject[header].push(value));
    });
    await once(rlp, 'close');
    return resultsObject
    */
  }
  private async uploadResultFile(
    id: string,
    file: resultFile,
    transpose: boolean,
  ): Promise<void> {
    let file_json: Promise<SimulationRunReportDataStrings>;

    if (transpose) {
      file_json = this.parseToJson(file);
    } else {
      file_json = this.readCSV(file.path);
    }
    this.logger.log('Read CSV');
    // apidomain/results/simulationID/reportId
    const sedml = encodeURIComponent(
      file.path
        .replace(this.fileService.getResultsDirectory(id) + '/', '')
        .replace('.csv', ''),
    );

    return this.uploadJSON(id, sedml, await file_json);
  }
  private uploadJSON(
    simId: string,
    resultId: string,
    result: SimulationRunReportDataStrings,
  ): Promise<void> {
    // Make sure this is actually returned
    return this.submit
      .sendReport(simId, resultId, result)
      .then((_) =>
        this.logger.log(
          `Successfully uploaded report ${resultId} for simulation ${simId}`,
        ),
      )
      .catch((err) => {
        this.logger.error(
          `Failed to upload report ${resultId} for simulation ${simId}`,
        );
        this.logger.error(err);
        throw err;
      });
  }
  private async parseToJson(
    file: resultFile,
  ): Promise<SimulationRunReportDataStrings> {
    const jsonArray = await csv().fromFile(file.path);

    const headers = Object.keys(jsonArray[0]);
    const resultObject: SimulationRunReportDataStrings = {};
    headers.forEach((key) => {
      resultObject[key] = [];
    });
    jsonArray.forEach((row) => {
      headers.forEach((key) => {
        resultObject[key].push(row[key]);
      });
    });

    return resultObject;
  }
}
