import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoImageComponent } from './logo-image.component';

describe('LogoImageComponent', () => {
  let component: LogoImageComponent;
  let fixture: ComponentFixture<LogoImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LogoImageComponent],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
