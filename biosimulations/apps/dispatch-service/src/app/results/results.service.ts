/**
 * @file results.service Uses teh mounted nfs to read the results file for a particular simulations
 * Parses them into individual reports, and then uploads them to the dispatch api.
 * @author Bilal Shaikh <bilalshaikh42@gmail.com>
 * 2020-12-13
 * @copyright Biosimulations Team 2020
 * @license MIT
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dirent, promises as fsPromises } from 'fs';
import ospath from 'path';
import path from 'path';
import csv from 'csvtojson';
import YAML from 'yaml';

import readline from 'readline';
import fs from 'fs';
import { SimulationRunReportDataStrings } from '@biosimulations/dispatch/api-models';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import {
  DispatchProcessedPayload,
  DispatchMessage,
} from '@biosimulations/messages/messages';
import { ClientProxy } from '@nestjs/microservices';

export interface resultFile {
  name: string;
  path: string;
}

@Injectable()
export class ResultsService {
  private logger = new Logger(ResultsService.name);
  private fileStorage: string = this.configService.get<string>(
    'hpc.fileStorage',
    '',
  );
  constructor(
    private readonly configService: ConfigService,
    private submit: SimulationRunService,
    @Inject('NATS_CLIENT') private client: ClientProxy,
  ) {}

  private getResultsDirectory(id: string) {
    return path.join(this.fileStorage, 'simulations', id, 'out');
  }
  async createResults(id: string, transpose: boolean) {
    const resultsDirectory = this.getResultsDirectory(id);
    //const resultsDirectory = 'testDir';
    const fileList: resultFile[] = await ResultsService.getFilesRecursively(
      resultsDirectory,
    );
    console.log(fileList);

    /* @todo Change this to hdf
     * @body change this to hdf files to implement changes needed for #1669
     */
    const csvFileList = fileList.filter((value: resultFile) =>
      value.name.endsWith('.csv'),
    );
    const runLogs = fileList.filter(
      (value: resultFile) => value.name == 'log.yml',
    );

    const resultPromises: Promise<void>[] = [];

    if (runLogs.length != 1) {
      // TODO handle this error
      console.log('No log found');
    } else {
      resultPromises.push(this.uploadLog(id, runLogs[0].path));
    }

    csvFileList.forEach((file: resultFile) => {
      resultPromises.push(this.uploadResultFile(id, file, transpose));
    });
    Promise.all(resultPromises).then((_) => {
      const data: DispatchProcessedPayload = {
        _message: DispatchMessage.processed,
        id: id,
      };
      this.client.emit(DispatchMessage.processed, data);
    });
  }
  uploadLog(id: string, path: string) {
    return fsPromises.readFile(path, 'utf8').then((file) => {
      const log = YAML.parse(file);
      return this.submit
        .sendLog(id, log)
        .toPromise()
        .then((_) => {
          return;
        });
    });
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
      // TODO handle error
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
  async uploadResultFile(
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
        .replace(this.getResultsDirectory(id) + '/', '')
        .replace('.csv', ''),
    );

    this.uploadJSON(id, sedml, await file_json);
  }
  private uploadJSON(
    simId: string,
    resultId: string,
    result: SimulationRunReportDataStrings,
  ) {
    this.submit
      .sendReport(simId, resultId, result)
      .then((value) =>
        this.logger.log(
          `Successfully uploaded report ${resultId} for simulation ${simId}`,
        ),
      )
      .catch((err) => this.logger.error(err));
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
  private static async getFilesRecursively(
    path: string,
  ): Promise<resultFile[]> {
    // Get all the files and folders int the directory
    const entries = fsPromises.readdir(path, { withFileTypes: true });

    // Filter out the directories, then map the files into resultFile type
    const files: resultFile[] = (await entries)
      .filter((value: Dirent) => !value.isDirectory())
      .map((file: Dirent) => ({
        name: file.name,
        path: ospath.join(path, file.name),
      }));

    //Filter out all the files
    const directories = (await entries).filter((value: Dirent) =>
      value.isDirectory(),
    );

    // Get the files in each directory
    for (const folder of directories) {
      const subFiles = await ResultsService.getFilesRecursively(
        ospath.join(path, folder.name),
      );
      files.push(...subFiles);
    }
    return files;
  }
}
