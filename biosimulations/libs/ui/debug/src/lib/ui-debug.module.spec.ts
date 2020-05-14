import { async, TestBed } from '@angular/core/testing';
import { UiDebugModule } from './ui-debug.module';

describe('UiDebugModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiDebugModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(UiDebugModule).toBeDefined();
  });
});
