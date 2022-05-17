import { TestBed } from '@angular/core/testing';
import { ColumnFilterType } from '@biosimulations/grid';

import { FilterService } from './filter.service';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Date Filter', () => {
    it('should return true if the value is null', () => {
      expect(
        service.passesDateFilter(null, {
          type: ColumnFilterType.date,
          value: {
            start: null,
            end: null,
          },
        }),
      ).toBe(true);
    });

    it('should return true if the value is undefined', () => {
      expect(
        service.passesDateFilter(undefined, {
          type: ColumnFilterType.date,
          value: {
            start: null,
            end: null,
          },
        }),
      ).toBe(true);
    });

    it('should return true if the value is not a date', () => {
      expect(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        service.passesDateFilter('not a date', {
          type: ColumnFilterType.date,
          value: {
            start: null,
            end: null,
          },
        }),
      ).toBe(true);
    });

    it('should return true if the value is a date and the filter is null', () => {
      expect(
        service.passesDateFilter(new Date(), {
          type: ColumnFilterType.date,
          value: {
            start: null,
            end: null,
          },
        }),
      ).toBe(true);
    });

    it('should return true if the value is a date and the filter is undefined', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(service.passesDateFilter(new Date(), undefined)).toBe(true);
    });

    it('should return true if the value is a date and the filter is a date range with null start', () => {
      expect(
        service.passesDateFilter(new Date(), {
          type: ColumnFilterType.date,
          value: {
            start: null,
            end: new Date(),
          },
        }),
      ).toBe(true);
    });

    it('should return true if the value is a date and the filter is a date range with null end', () => {
      expect(
        service.passesDateFilter(new Date(), {
          type: ColumnFilterType.date,
          value: {
            start: new Date(),
            end: null,
          },
        }),
      ).toBe(true);
    });
  });
});
