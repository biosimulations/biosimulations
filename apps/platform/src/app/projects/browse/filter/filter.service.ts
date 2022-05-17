import { Injectable } from '@angular/core';
import {
  isDateFilterDefinition,
  isNumberFilterDefinition,
  isStringFilterDefinition,
  isAutoCompleteFilterDefinition,
  Column,
  passesFilters,
  FilterDateRangeQuery,
  FilterNumberRangeQuery,
} from '@biosimulations/grid';


@Injectable({
  providedIn: 'root',
})
export class FilterService {
  public passesColumnFilter(value: number | string | Date, column: Column): boolean {
    if (isDateFilterDefinition(column.filterDefinition)) {
      const filterQuery: FilterDateRangeQuery = { value: value as Date, filter: column.filterDefinition };
      return passesFilters(filterQuery);
    } else if (isNumberFilterDefinition(column.filterDefinition)) {
      const filterQuery: FilterNumberRangeQuery = { value: value as number, filter: column.filterDefinition };
      return passesFilters(filterQuery);
    } else if (
      isStringFilterDefinition(column.filterDefinition) ||
      isAutoCompleteFilterDefinition(column.filterDefinition)
    ) {
      return passesFilters({ value: value as string, filter: column.filterDefinition });
    } else {
      return true;
    }
  }
}
