import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should generate a 16 character token', () => {
    expect(UtilsService.genAccessToken(16).length).toEqual(16);
  });

  it('should format time for humans', () => {
    expect(UtilsService.formatTimeForHumans(1e-22)).toEqual('100 ys');
    expect(UtilsService.formatTimeForHumans(1e-19)).toEqual('100 zs');
    expect(UtilsService.formatTimeForHumans(1e-16)).toEqual('100 as');
    expect(UtilsService.formatTimeForHumans(1e-13)).toEqual('100 fs');
    expect(UtilsService.formatTimeForHumans(1e-10)).toEqual('100 ps');
    expect(UtilsService.formatTimeForHumans(1e-7)).toEqual('100 ns');
    expect(UtilsService.formatTimeForHumans(1e-4)).toEqual('100 us');
    expect(UtilsService.formatTimeForHumans(1e-1)).toEqual('100 ms');
    expect(UtilsService.formatTimeForHumans(10)).toEqual('10 s');
    expect(UtilsService.formatTimeForHumans(1 + 60)).toEqual('1 m');
    expect(UtilsService.formatTimeForHumans(1 + 60 * 60)).toEqual('1 h');
    expect(UtilsService.formatTimeForHumans(1 + 60 * 60 * 24)).toEqual('1 d');
    expect(UtilsService.formatTimeForHumans(1 + 60 * 60 * 24 * 365)).toEqual('1 y');
  });
});
