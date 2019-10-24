import { TestBed } from '@angular/core/testing';

import { CustomLoaderService } from './custom-loader.service';

describe('CustomLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomLoaderService = TestBed.get(CustomLoaderService);
    expect(service).toBeTruthy();
  });
});
