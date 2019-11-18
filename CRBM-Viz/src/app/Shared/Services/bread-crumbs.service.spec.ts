import { TestBed } from '@angular/core/testing';

import { BreadCrumbsService } from './bread-crumbs.service';

describe('BreadCrumbsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({})
  );

  it('should be created', () => {
    const service: BreadCrumbsService = TestBed.get(BreadCrumbsService);
    expect(service).toBeTruthy();
  });
});
