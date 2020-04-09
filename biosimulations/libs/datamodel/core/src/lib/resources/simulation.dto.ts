import { ResourceDTO } from './resource.dto';
import { FormatDTO } from '../common/format.dto';
import { ParameterChangeDTO } from '../common/parameter-change.dto';
import { AlgorithmDTO } from '../common/algorithm.dto';
import { LogItemDTO } from '../common/log-item.dto';
import { ResourceType } from '../enums/resource-type';

export class SimualtionDTO extends ResourceDTO {
  type = ResourceType.simulation;
  format: FormatDTO;
  model: string;  
  modelParameterChanges: ParameterChangeDTO[];    
  startTime: number;
  endTime: number;
  length: number;  
  algorithm: AlgorithmDTO;
  algorithmParameterChanges: ParameterChangeDTO[];
  submitDate: Date;
  runDate: Date;
  endDate: Date;
  wallTime: number;
  outlog: LogItemDTO[];
  errlog: LogItemDTO[];
}
