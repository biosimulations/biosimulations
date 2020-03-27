import { ResourceDTO } from './resource.dto';
import { FormatDTO } from '../common/format.dto';
import { ParameterChangeDTO } from '../common/parameter-change.dto';
import { LogItemDTO } from '../common/log-item.dto';

export class Simualtion extends ResourceDTO {
  model: string;
  format: FormatDTO;
  modelParameterChanges: ParameterChangeDTO[];
  startTime: number;
  endTime: number;
  length: number;
  submitDate: Date;
  runDate: Date;
  endDate: Date;
  wallTime: number;
  outlog: LogItemDTO[];
  errlog: LogItemDTO[];
}
