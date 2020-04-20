import { TestBed } from '@angular/core/testing';

import { ConstructionGuard } from './construction.guard';
import { BiosimulationsFrontendTestingModule } from '../../testing/testing.module';

describe('ConstructionGuard', () => {
  let guard: ConstructionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BiosimulationsFrontendTestingModule],
    });
    guard = TestBed.inject(ConstructionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
