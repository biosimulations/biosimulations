import { Column } from '../columns';
import { AutoCompleteFilterComponent } from '../filter/auto-complete-filter/auto-complete-filter.component';

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
  | NumberFilterDefinition
  | DateFilterDefinition
  | StringFilterDefinition
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
  filter: StringFilterDefinition | StringAutoCompleteFilterDefinition;
  value: string;
};
export type FilterDateRangeQuery = {
  filter: DateFilterDefinition;
  value: Date;
};
export type FilterNumberRangeQuery = {
  filter: NumberFilterDefinition;
  value: number;
};
export type FilterQuery = FilterDateRangeQuery | FilterNumberRangeQuery | FilterSetQuery | undefined;

export const isStringFilterDefinition = (
  filterSetDefinition: FilterDefinition | undefined,
): filterSetDefinition is StringFilterDefinition => {
  return filterSetDefinition?.type === ColumnFilterType.string;
};

export const isAutoCompleteFilterDefinition = (
  filterSetDefinition: FilterDefinition | undefined,
): filterSetDefinition is StringAutoCompleteFilterDefinition => {
  return filterSetDefinition?.type === ColumnFilterType.stringAutoComplete;
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
  return !!filterQuery && isDateFilterDefinition(filterQuery.filter);
};
export const isFilterNumberRangeQuery = (filterQuery: FilterQuery): filterQuery is FilterNumberRangeQuery => {
  return !!filterQuery && isNumberFilterDefinition(filterQuery.filter);
};
export const isFilterSetQuery = (filterQuery: FilterQuery): filterQuery is FilterSetQuery => {
  return (
    !!filterQuery &&
    (isStringFilterDefinition(filterQuery.filter) || isAutoCompleteFilterDefinition(filterQuery.filter))
  );
};
