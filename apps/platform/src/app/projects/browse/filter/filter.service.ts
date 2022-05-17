import { Injectable } from '@angular/core';
import {
  isDateFilterDefinition,
  isNumberFilterDefinition,
  isStringFilterDefinition,
  isAutoCompleteFilterDefinition,
  DateFilterDefinition,
  NumberFilterDefinition,
  StringFilterDefinition,
  StringAutoCompleteFilterDefinition,
  Column,
  passesFilters,
  FilterQuery,
  FilterDateRangeQuery,
  FilterNumberRangeQuery,
} from '@biosimulations/grid';
import { isDate, isNumber } from 'class-validator';

import { FormattedProjectSummary } from '../browse.model';

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
