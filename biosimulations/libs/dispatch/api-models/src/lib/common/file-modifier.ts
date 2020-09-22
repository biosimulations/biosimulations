import * as fs from 'fs';

// TODO: Move file modifier to shared libs 
export class FileModifiers {

  static readDir(dirPath: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      fs.readdir(dirPath, (err, data) => {
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
      fs.writeFile(path, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}