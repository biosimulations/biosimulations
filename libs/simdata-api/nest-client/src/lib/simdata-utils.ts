import { DatasetData } from './model/dataset-data';
import nj from '@d4c/numjs';

export function datasetDataToNjArray(datasetData: DatasetData): nj.NdArray {
  return nj.array(datasetData.values).reshape(...datasetData.shape);
}

export function njArrayToDatasetData(njArray: nj.NdArray): DatasetData {
  return {
    shape: njArray.shape,
    values: njArray.flatten().tolist() as Array<number>
  };
}

export function extractArray(njArray: nj.NdArray, index: number): Array<number> {
  return njArray.tolist()[index] as Array<number>;
}
