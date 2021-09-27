import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ViewService } from './view.service';

describe('ViewService', () => {
  let service: ViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    service = TestBed.inject(ViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
