import { AlgorithmParameterDTO } from './algorithm-parameter.dto';

export class AlgorithmDTO {
  id: string; // KISAO id
  name: string;
  parameters: AlgorithmParameterDTO[] = [];
}
