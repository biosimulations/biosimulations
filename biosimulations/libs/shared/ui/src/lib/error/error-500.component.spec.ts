import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ErrorComponent } from './error.component';
import { Error500Component } from './error-500.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

describe('Error500Component', () => {
  let component: Error500Component;
  let fixture: ComponentFixture<Error500Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorComponent, Error500Component],
      imports: [RouterTestingModule, BiosimulationsIconsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Error500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
