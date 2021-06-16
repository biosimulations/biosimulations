export type BiosimulationsDataStringAtributes = {
  _type: string;
  uri: string;
  sedmlId: string;
  sedmlName: string;
};
export type BiosimulationsDataArrayAtributes = {
  sedmlDataSetDataTypes: string[];
  sedmlDataSetIds: string[];
  sedmlDataSetLabels: string[];
  sedmlDataSetNames: string[];
  sedmlDataSetShapes: string[];
};
export type StringAttributeName = keyof BiosimulationsDataStringAtributes;
export const isStringAttribute = (
  value: StringAttributeName | ArrayAttributeName,
): value is StringAttributeName => {
  return ['_type', 'uri', 'sedmlId', 'sedmlName'].includes(value);
};
export const isArrayAttribute = (
  value: StringAttributeName | ArrayAttributeName,
): value is ArrayAttributeName => {
  return [
    'sedmlDataSetDataTypes',
    'sedmlDataSetIds',
    'sedmlDataSetLabels',
    'sedmlDataSetNames',
    'sedmlDataSetShapes',
  ].includes(value);
};
type ArrayAttributeName = keyof BiosimulationsDataArrayAtributes;
export type AttributeName = StringAttributeName | ArrayAttributeName;

export type BiosimulationsDataAtributes = BiosimulationsDataArrayAtributes &
  BiosimulationsDataStringAtributes;

export type Dataset = {
  uri: string;
  id: string;
  created?: Date;
  updated?: Date;
  attributes: BiosimulationsDataAtributes;
};
