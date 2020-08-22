import { async, TestBed } from '@angular/core/testing';
import { SharedDebugModule } from './debug.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('SharedDebugModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedDebugModule, RouterTestingModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedDebugModule).toBeDefined();
  });
});
