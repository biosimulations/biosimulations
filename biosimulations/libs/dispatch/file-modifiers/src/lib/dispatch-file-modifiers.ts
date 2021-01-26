import * as fs from 'fs';
import * as rmrf from 'rimraf';
import ospath from 'path';

export interface RecursiveFiles {
  name: string;
  path: string;
}

export class FileModifiers {
  static readDir(dirPath: string, options?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fs.readdir(dirPath, options, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  static readFile(filePath: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  static writeFile(path: string, data: Buffer | string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(path, data, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async rmrfDir(path: string): Promise<void | Error> {
    return new Promise((resolve, reject) => {
      rmrf.default(path, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async getFilesRecursive(path: string) {
    const entries = await FileModifiers.readDir(path, { withFileTypes: true });

    // Get files within the current directory and add a path key to the file objects
    const files: RecursiveFiles[] = entries
      .filter((file: any) => !file.isDirectory())
      .map((file: any) => ({ ...file, path: ospath.join(path, file.name) }));

    // Get folders within the current directory
    const folders = entries.filter((folder: any) => folder.isDirectory());

    /*
              Add the found files within the subdirectory to the files array by calling the
              current function itself
            */
    for (const folder of folders)
      files.push(
        // ...(await FileModifiers.getFilesRecursive(`${path}/${folder.name}`))
        ...(await FileModifiers.getFilesRecursive(
          ospath.join(path, folder.name),
        )),
      );

    return files;
  }
}
