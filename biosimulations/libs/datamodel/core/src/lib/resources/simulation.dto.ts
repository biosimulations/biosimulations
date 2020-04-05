import { ResourceDTO } from './resource.dto';
import { ModelFormatDTO } from '../common/model-format.dto';
import { ParameterChangeDTO } from '../common/parameter-change.dto';
import { LogItemDTO } from '../common/log-item.dto';
import { ResourceType } from '../enums/resource-type';

export class SimualtionDTO extends ResourceDTO {
  type = ResourceType.simulation;
  model: string;
  format: ModelFormatDTO;
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
