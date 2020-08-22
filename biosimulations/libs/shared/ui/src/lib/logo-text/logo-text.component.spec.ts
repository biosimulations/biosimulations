import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoTextComponent } from './logo-text.component';

describe('LogoTextComponent', () => {
  let component: LogoTextComponent;
  let fixture: ComponentFixture<LogoTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
