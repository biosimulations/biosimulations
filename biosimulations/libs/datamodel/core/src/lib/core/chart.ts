import { DTO } from '@biosimulations/datamodel/utils';
// See if json-schema can somehow be made into a type

type VegaSpecification = any;

export interface Chart {
  spec: VegaSpecification;
}

export enum ChartDataFieldType {
  dynamicSimulationResult = 'dynamicSimulationResult',
  static = 'static',
}

export enum ChartDataFieldShape {
  scalar = 'scalar',
  array = 'array',
}

export enum ChartType {
  basic = 'basic',
  advanced = 'advanced',
}

export interface ChartDataFieldCore {
  name: string;
  shape: ChartDataFieldShape;
  type: ChartDataFieldType;
}

export type ChartDataFieldDTO = DTO<ChartDataFieldCore>;
