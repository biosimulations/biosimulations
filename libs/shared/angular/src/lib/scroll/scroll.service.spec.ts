import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  let service: ScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [ScrollService],
    });
    service = TestBed.inject(ScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
