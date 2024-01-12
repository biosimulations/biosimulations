import { DatasetData } from './model/dataset-data';
import nj from '@d4c/numjs';
import { HDF5File } from './model/hdf5-file';
import { HDF5Group } from './model/hdf5-group';
import { HDF5Dataset } from './model/hdf5-dataset';
import { HDF5Attribute } from './model/hdf5-attribute';

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

export interface HDF5Visitor {
  visitFile(file: HDF5File): void;
  visitGroup(group: HDF5Group): void;
  visitDataset(dataset: HDF5Dataset): void;
  visitAttribute(attribute: HDF5Attribute): void;
}

export class BaseHDF5Visitor implements HDF5Visitor {
  visitFile(file: HDF5File): void {}
  visitGroup(group: HDF5Group): void {}
  visitDataset(dataset: HDF5Dataset): void {}
  visitAttribute(attribute: HDF5Attribute): void {}
}

export function visitHDF5File(file: HDF5File, visitor: HDF5Visitor): void {
  visitor.visitFile(file);

  // Visit each child group, dataset, and attribute
  for (const group of file.groups) {
    visitHDF5Group(group, visitor);
  }
  // for (const dataset of file.datasets) {
  //   visitHDF5Dataset(dataset, visitor);
  // }
  // for (const attribute of file.attributes) {
  //   visitHDF5Attribute(attribute, visitor);
  // }
}

export function visitHDF5Group(group: HDF5Group, visitor: HDF5Visitor): void {
  visitor.visitGroup(group);

  // Visit each child group, dataset, and attribute
  // for (const child_group of group.groups) {
  //   visitHDF5Group(child_group, visitor);
  // }
  for (const dataset of group.datasets) {
    visitHDF5Dataset(dataset, visitor);
  }
  for (const attribute of group.attributes) {
    visitHDF5Attribute(attribute, visitor);
  }
}

export function visitHDF5Dataset(dataset: HDF5Dataset, visitor: HDF5Visitor): void {
  visitor.visitDataset(dataset);

  // Visit each attribute
  for (const attribute of dataset.attributes) {
    visitHDF5Attribute(attribute, visitor);
  }
}

export function visitHDF5Attribute(attribute: HDF5Attribute, visitor: HDF5Visitor): void {
  visitor.visitAttribute(attribute);
}
