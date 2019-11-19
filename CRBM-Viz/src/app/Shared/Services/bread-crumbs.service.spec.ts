import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadCrumbsService } from './bread-crumbs.service';

describe('BreadCrumbsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        providers: [RouterTestingModule],
    })
  );

  it('should be created', () => {
    const service: BreadCrumbsService = TestBed.get(BreadCrumbsService);
    expect(service).toBeTruthy();
  });
});
