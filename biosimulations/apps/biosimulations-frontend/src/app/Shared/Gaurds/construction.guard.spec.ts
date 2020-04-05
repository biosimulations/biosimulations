import { TestBed } from '@angular/core/testing';

import { ConstructionGuard } from './construction.guard';

describe('ConstructionGuard', () => {
  let guard: ConstructionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ConstructionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
