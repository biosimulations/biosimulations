import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigService } from '@biosimulations/shared/services';
import { LogoTextComponent } from './logo-text.component';

describe('LogoTextComponent', () => {
  let component: LogoTextComponent;
  let fixture: ComponentFixture<LogoTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoTextComponent ],
      providers: [ ConfigService ],
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
