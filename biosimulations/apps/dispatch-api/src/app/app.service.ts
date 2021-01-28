import { Injectable } from '@nestjs/common';
import path from 'path';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private fileStorage = this.configService.get<string>('hpc.fileStorage', '');
  public constructor(private configService: ConfigService) {}

  // TODO use the database for output, remove the connection to nfs
  public downloadResultArchive(uId: string): string {
    const zipPath = path.join(
      this.fileStorage,
      'simulations',
      uId,
      `${uId}.zip`,
    );
    return zipPath;
  }
}
