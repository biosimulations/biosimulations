import nj from '@d4c/numjs';
import { DatasetData } from './model/dataset-data';
import { datasetDataToNjArray, njArrayToDatasetData } from './simdata-utils';

describe('test conversion between DatasetData and nj.array', () => {

  // add a before clause to initialize the njArray and datasetData variables and import simdata-api/nest-client nestjs module


  const njArray = nj.array([1, 2, 3, 4, 5, 6]).reshape(2, 3);

  const njArray_flat = nj.array([1, 2, 3, 4, 5, 6]);

  const datasetData = { values: [1, 2, 3, 4, 5, 6], shape: [2, 3] } as DatasetData;

  it('should convert nj.array to DatasetData', () => {
    expect(njArrayToDatasetData(njArray)).toEqual(datasetData);
  });

  it('should convert DatasetData to nj.array', () => {
    expect(datasetDataToNjArray(datasetData)).toEqual(njArray);
  });

  it('nj.array.flatten() should work as expected', () => {
    expect(datasetDataToNjArray(datasetData).flatten()).toEqual(njArray_flat);
  });

  it('nj.array.tolist[index] should work as expected', () => {
    expect(njArray.tolist()[0]).toEqual([1,2,3]);
    expect(njArray.tolist()[1]).toEqual([4,5,6]);
  });
});
