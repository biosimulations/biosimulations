import { async, TestBed } from '@angular/core/testing';
import { UiMaterialModule } from './ui-material.module';

describe('UiMaterialModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiMaterialModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(UiMaterialModule).toBeDefined();
  });
});
