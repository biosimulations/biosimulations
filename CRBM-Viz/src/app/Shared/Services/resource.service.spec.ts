import { TestBed } from '@angular/core/testing';

import { ResourceService } from './resource.service';

describe('ResourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResourceService = TestBed.get(ResourceService);
    expect(service).toBeTruthy();
  });
});
