import { TestBed } from '@angular/core/testing';

import { ConstructionGuard } from './construction.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing/testing';

describe('ConstructionGuard', () => {
  let guard: ConstructionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
    });
    guard = TestBed.inject(ConstructionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
