import {
  FilterQuery,
  isFilterDateRangeQuery,
  isFilterSetQuery,
  isFilterNumberRangeQuery,
  FilterDateRangeQuery,
  FilterNumberRangeQuery,
  FilterSetQuery,
} from '.';

export const passesFilters = (filterQuery: FilterQuery): boolean => {
  if (isFilterNumberRangeQuery(filterQuery)) {
    return passesNumberRangeFilter(filterQuery);
  } else if (isFilterDateRangeQuery(filterQuery)) {
    return passesDateRangeFilter(filterQuery);
  } else if (isFilterSetQuery(filterQuery)) {
    return passesSetFilter(filterQuery);
  }

  return true;
};

export const passesDateRangeFilter = (
  filterQuery: FilterDateRangeQuery,
): boolean => {
  const filterDef = filterQuery.filter;
  const value = filterQuery.value;
  const isBeforeLatest = !value || value <= filterDef.end;
  const isAfterEarliest = !value || value >= filterDef.start;
  return isBeforeLatest && isAfterEarliest;
};

const passesNumberRangeFilter = (
  filterQuery: FilterNumberRangeQuery,
): boolean => {
  const filterDef = filterQuery.filter;
  const value = filterQuery.value;

  const passesMin = !filterDef.min || value >= filterDef.min;
  const passesMax = !filterDef.max || value <= filterDef.max;
  return passesMin && passesMax;
};

const passesSetFilter = (filterQuery: FilterSetQuery): boolean => {
  const values = filterQuery.filter.values;
  const value = filterQuery.value;
  const filterVals: string[] = values || [];

  return filterVals.includes(value);
};
