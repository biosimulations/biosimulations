import { Injectable } from '@nestjs/common';
import { metadata } from './metadata';
@Injectable()
export class MetadataService {
  public getAllMetadata() {
    const meta1 = this.getMetadata('1');
    const meta2 = this.getMetadata('2');
    return [meta1, meta2];
  }

  public getMetadata(id: string) {
    const data = { id, metadata, simulationRun: id };
    return data;
  }

  public createMetadata(data: any) {
    return this.getMetadata(data.id);
  }
}
 