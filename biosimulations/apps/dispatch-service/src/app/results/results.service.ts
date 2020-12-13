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
@Injectable()
export class ResultsService {
  private logger = new Logger(ResultsService.name);
  private fileStorage: string = this.configService.get<string>(
    'hpc.fileStorage',
    ''
  );
  constructor(private readonly configService: ConfigService) {}

  async createResults(id: string, transpose: boolean) {
    const resultsDirectory = path.join(
      this.fileStorage,
      'simulations',
      id,
      'out'
    );
    const fileList: resultFile[] = await ResultsService.getFilesRecursively(
      resultsDirectory
    );

    /* @todo Change this to hdf
     * @body change this to hdf files to implement changes needed for #1669
     */
    let csvFileList = fileList.filter((value: resultFile) =>
      value.name.endsWith('.csv')
    );

    csvFileList.forEach((file: resultFile) => {
      this.uploadResultFile(id, file, transpose);
    });
  }
  transpose(file: string): string {
    throw new Error('Method not implemented.');
  }
  async uploadResultFile(id: string, file: resultFile, transpose: boolean) {
    const file_json = this.parseToJson(file);
    const report = file.name.split('.csv')[0];

    //apidomain/results/simulationID/report
    const sedml = encodeURI(file.path.split('/').slice(0, -1).join('/'));

    this.uploadJSON(id, sedml, report, await file_json, transpose);
  }
  uploadJSON(
    id: string,
    sedml: any,
    report: string,
    file_json: string,
    transpose: boolean
  ) {
    // TODO Complete implementation
    if (transpose) {
      file_json = this.transpose(file_json);
    }
    this.logger.warn(id);
    this.logger.warn(sedml);
    this.logger.warn(report);
    this.logger.warn(file_json);
  }
  async parseToJson(file: resultFile): Promise<string> {
    this.logger.warn(file);
    const jsonArray = await csv().fromFile(file.path);
    this.logger.warn(jsonArray);
    //return JSON.stringify(jsonArray);
    return jsonArray.toString();
  }
  static async getFilesRecursively(path: string) {
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
