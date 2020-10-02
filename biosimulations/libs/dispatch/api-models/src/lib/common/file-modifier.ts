import * as fs from 'fs';
import * as rmrf from 'rimraf';

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

  // TODO: Deletes all the content of the folders but not the specified folder, fix it.
  static async deleteNonEmptyDir(path: string) {
    if (await FileModifiers.exists(path)) {
      const files = await FileModifiers.readDir(path);

      if (files.length > 0) {
        for (const filename of files) {
          const fileStat: fs.Stats = await FileModifiers.stat(
            path + '/' + filename
          );
          if (fileStat.isDirectory()) {
            FileModifiers.deleteNonEmptyDir(path + '/' + filename);
          } else {
            await FileModifiers.unlink(path + '/' + filename);
          }
        }
        await FileModifiers.deletEmptyDir(path);
      } else {
        await FileModifiers.deletEmptyDir(path);
      }
    } else {
      console.log('Directory path not found.');
    }
  }

  static async deletEmptyDir(path: string) {
    return new Promise((resolve, reject) => {
      fs.rmdir(path, (err) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }
 
  static async unlink(path: string) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }

  static async exists(path: string) {
    return new Promise((resolve, reject) => {
      fs.exists(path, (exists) => {
        if (exists) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  static async stat(path: string): Promise<fs.Stats> {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, data: fs.Stats) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }


  static async rmrfDir(path: string): Promise<void | Error> {
    return new Promise((resolve, reject) => {
      rmrf.default(path, (err) => {
        if(err) {
          reject(err)
        } else {
          resolve();
        }
      });
    })
  }
}
