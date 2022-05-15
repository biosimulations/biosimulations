import { Column } from '../columns';

export enum ColumnFilterType {
  string = 'string',
  stringAutoComplete = 'stringAutoComplete',
  number = 'number',
  date = 'date',
}
// make type definition for the enum automatically
//export type ColumnFilterType = `${ColumnFilter}`;

export type StringFilterDefinition = {
  type: ColumnFilterType.string;
  value: {
    label: string;
    selected: boolean;
  }[];
};
export type DateFilterDefinition = {
  type: ColumnFilterType.date;
  value: DateFilterRange;
};
export type NumberFilterRange = {
  min: number;
  max: number;
  step: number;
  minSelected: number;
  maxSelected: number;
};

export type DateFilterRange = {
  start: Date | null;
  end: Date | null;
};
export type NumberFilterDefinition = {
  type: ColumnFilterType.number;
  value: NumberFilterRange;
};

export type StringAutoCompleteFilterDefinition = {
  type: ColumnFilterType.stringAutoComplete;
  value: {
    label: string;
    selected: boolean;
  }[];
};

export type FilterDefinition =
  | StringFilterDefinition
  | NumberFilterDefinition
  | DateFilterDefinition
  | StringAutoCompleteFilterDefinition;

export type FilterState = {
  [columnId: string]: FilterDefinition | undefined;
};

export type SearchDefinition = string;

export type FilterStateDefinition = {
  filter: FilterDefinition;
  search: SearchDefinition;
};

export type FilterSetQuery = {
  filter: StringFilterDefinition;
  value: string;
  column: Column;
};
export type FilterDateRangeQuery = {
  filter: DateFilterDefinition;
  value: Date;
  column: Column;
};
export type FilterNumberRangeQuery = {
  filter: NumberFilterDefinition;
  value: number;
  column: Column;
};
export type FilterQuery = FilterSetQuery | FilterDateRangeQuery | FilterNumberRangeQuery;

export const isStringFilterDefinition = (
  filterSetDefinition: FilterDefinition | undefined,
): filterSetDefinition is StringFilterDefinition => {
  return filterSetDefinition?.type === ColumnFilterType.string;
};

export const isDateFilterDefinition = (
  filterDateRangeDefinition: FilterDefinition | undefined,
): filterDateRangeDefinition is DateFilterDefinition => {
  return filterDateRangeDefinition?.type === ColumnFilterType.date;
};

export const isNumberFilterDefinition = (
  filterNumberRangeDefinition: FilterDefinition | undefined,
): filterNumberRangeDefinition is NumberFilterDefinition => {
  return filterNumberRangeDefinition?.type === ColumnFilterType.number;
};

export const isFilterDateRangeQuery = (filterQuery: FilterQuery): filterQuery is FilterDateRangeQuery => {
  return isDateFilterDefinition(filterQuery.filter);
};
export const isFilterNumberRangeQuery = (filterQuery: FilterQuery): filterQuery is FilterNumberRangeQuery => {
  return isNumberFilterDefinition(filterQuery.filter);
};
export const isFilterSetQuery = (filterQuery: FilterQuery): filterQuery is FilterSetQuery => {
  return isStringFilterDefinition(filterQuery.filter);
};
