import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dirent, promises as fsPromises } from 'fs';
import ospath from 'path';
import path from 'path';
import csv from 'csvtojson';

export interface resultFile {
  name: string;
  path: string;
}
export type Result = { [key: string]: Array<any> };
@Injectable()
export class ResultsService {
  private logger = new Logger(ResultsService.name);
  private fileStorage: string = this.configService.get<string>(
    'hpc.fileStorage',
    ''
  );
  constructor(private readonly configService: ConfigService) {}

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
  readCSV(file: string): Result {
    throw new Error('Method not implemented.');
  }
  async uploadResultFile(id: string, file: resultFile, transpose: boolean) {
    let file_json;
    if (transpose) {
      file_json = this.parseToJson(file);
    } else {
      file_json = this.readCSV(file.path);
    }

    //apidomain/results/simulationID/report
    const sedml = encodeURI(
      file.path
        .replace(this.getResultsDirectory(id) + '/', '')
        .replace('.csv', '')
    );

    this.uploadJSON(id, sedml, await file_json);
  }
  uploadJSON(simId: string, resultId: string, result: Result) {
    // TODO Complete implementation
    this.logger.debug(simId);
    this.logger.debug(resultId);
    this.logger.debug(result);
  }
  async parseToJson(file: resultFile): Promise<Result> {
    const jsonArray = await csv().fromFile(file.path);
    this.logger.debug(jsonArray);
    const headers = Object.keys(jsonArray[0]);
    const resultObject: Result = {};
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
  static async getFilesRecursively(path: string): Promise<resultFile[]> {
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
