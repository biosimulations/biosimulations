/**
 * @file results.service Uses teh mounted nfs to read the results file for a particular simulations
 * Parses them into individual reports, and then uploads them to the dispatch api.
 * @author Bilal Shaikh <bilalshaikh42@gmail.com>
 * 2020-12-13
 * @copyright Biosimulations Team 2020
 * @license MIT
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dirent, promises as fsPromises } from 'fs';
import ospath from 'path';
import path from 'path';
import csv from 'csvtojson';

import readline from 'readline';
import fs from 'fs';
import {
  SimulationRunReportData,
  SimulationRunReportDataStrings
} from '@biosimulations/dispatch/api-models';
import { SimulationRunService } from '../simulation-run/simulation-run.service';

export interface resultFile {
  name: string;
  path: string;
}

@Injectable()
export class ResultsService {
  private logger = new Logger(ResultsService.name);
  private fileStorage: string = this.configService.get<string>(
    'hpc.fileStorage',
    ''
  );
  constructor(
    private readonly configService: ConfigService,
    private submit: SimulationRunService
  ) {}

  private getResultsDirectory(id: string) {
    return path.join(this.fileStorage, 'simulations', id, 'out');
  }
  async createResults(id: string, transpose: boolean) {
    const resultsDirectory = this.getResultsDirectory(id);
    const fileList: resultFile[] = await ResultsService.getFilesRecursively(
      resultsDirectory
    );

    /* @todo Change this to hdf
     * @body change this to hdf files to implement changes needed for #1669
     */
    const csvFileList = fileList.filter((value: resultFile) =>
      value.name.endsWith('.csv')
    );

    csvFileList.forEach((file: resultFile) => {
      this.uploadResultFile(id, file, transpose);
    });
  }
  private async readCSV(file: string): Promise<SimulationRunReportDataStrings> {
    // info https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line

    try {
      const rlp = readline.createInterface({
        terminal: false,
        input: fs.createReadStream(file),
        crlfDelay: Infinity
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
  async uploadResultFile(id: string, file: resultFile, transpose: boolean) {
    let file_json: Promise<SimulationRunReportDataStrings>;

    if (transpose) {
      file_json = this.parseToJson(file);
    } else {
      file_json = this.readCSV(file.path);
    }

    // apidomain/results/simulationID/reportId
    const sedml = encodeURIComponent(
      file.path
        .replace(this.getResultsDirectory(id) + '/', '')
        .replace('.csv', '')
    );

    this.uploadJSON(id, sedml, await file_json);
  }
  private uploadJSON(
    simId: string,
    resultId: string,
    result: SimulationRunReportDataStrings
  ) {
    this.logger.debug(simId);
    this.logger.debug(resultId);
    this.logger.debug(result);
    this.submit
      .sendReport(simId, resultId, result)
      .catch((err) => this.logger.error(err));
  }
  private async parseToJson(
    file: resultFile
  ): Promise<SimulationRunReportDataStrings> {
    const jsonArray = await csv().fromFile(file.path);
    this.logger.debug(jsonArray);
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
    this.logger.warn(resultObject);
    return resultObject;
  }
  private static async getFilesRecursively(
    path: string
  ): Promise<resultFile[]> {
    // Get all the files and folders int the directory
    const entries = fsPromises.readdir(path, { withFileTypes: true });

    // Filter out the directories, then map the files into resultFile type
    const files: resultFile[] = (await entries)
      .filter((value: Dirent) => !value.isDirectory())
      .map((file: Dirent) => ({
        name: file.name,
        path: ospath.join(path, file.name)
      }));

    //Filter out all the files
    const directories = (await entries).filter((value: Dirent) =>
      value.isDirectory()
    );

    // Get the files in each directory
    for (const folder of directories) {
      const subFiles = await ResultsService.getFilesRecursively(
        ospath.join(path, folder.name)
      );
      files.push(...subFiles);
    }
    return files;
  }
}
