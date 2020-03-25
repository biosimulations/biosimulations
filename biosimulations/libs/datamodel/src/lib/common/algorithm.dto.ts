import { AlgorithmParameterDTO } from './algorithm-paramater.dto';

export class AlgorithmDTO {
  id?: string; // KISAO id
  name?: string;
  parameters: AlgorithmParameterDTO[] = [];
}
