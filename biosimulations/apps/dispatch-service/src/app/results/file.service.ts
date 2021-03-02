import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dirent, promises as fsPromises } from 'fs';
import path from 'path';
import ospath from 'path';

export interface resultFile {
  name: string;
  path: string;
}

@Injectable()
export class FileService {
  private fileStorage: string = this.configService.get<string>(
    'hpc.fileStorage',
    '',
  );

  private hpcBase: string = this.configService.get<string>(
    'hpc.hpcBaseDir',
    '',
  );
  public constructor(private readonly configService: ConfigService) {}

  public getResultsDirectory(id: string): string {
    return path.join(this.fileStorage, 'simulations', id);
  }
  public getSSHResultsDirectory(id: string): string {
    return path.join(this.hpcBase, id);
  }

  public async getFilesRecursively(path: string): Promise<resultFile[]> {
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
      const subFiles = await this.getFilesRecursively(
        ospath.join(path, folder.name),
      );
      files.push(...subFiles);
    }
    return files;
  }
}
