import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ErrorComponent } from './error.component';
import { Error404Component } from './error-404.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

describe('Error404Component', () => {
  let component: Error404Component;
  let fixture: ComponentFixture<Error404Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorComponent, Error404Component],
      imports: [RouterTestingModule, BiosimulationsIconsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Error404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
