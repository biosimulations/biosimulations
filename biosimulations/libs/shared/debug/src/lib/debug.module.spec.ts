import { async, TestBed } from '@angular/core/testing';
import { DebugModule } from './debug.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('DebugModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DebugModule, RouterTestingModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(DebugModule).toBeDefined();
  });
});
