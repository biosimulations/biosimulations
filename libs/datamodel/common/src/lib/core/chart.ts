type VegaSpecification = any;

export interface ChartAttributes {
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

export interface ChartDataField {
  name: string;
  shape: ChartDataFieldShape;
  type: ChartDataFieldType;
}
