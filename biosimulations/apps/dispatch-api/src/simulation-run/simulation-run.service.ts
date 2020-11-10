import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SimulationRun } from './simulation-run.dto';
import { SimulationFile } from './file.model';
import { Model } from 'mongoose';
import { SimulationRunModel } from './simulation-run.model';
@Injectable()
export class SimulationRunService {
  async createRun(run: SimulationRun, file: any) {
    console.log(this.fileModel.schema);
    const fileParsed = {
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      buffer: file.buffer,
      size: file.size,
    };
    const newFile = new this.fileModel(fileParsed);

    const res = await newFile.save();
    console.log(res);
    return res;
  }
  constructor(
    @InjectModel(SimulationFile.name) private fileModel: Model<SimulationFile>,
    @InjectModel(SimulationRunModel.name)
    private simulationRunModel: Model<SimulationRunModel>
  ) {}
}
