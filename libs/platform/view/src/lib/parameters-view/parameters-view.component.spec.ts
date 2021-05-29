import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersViewComponent } from './parameters-view.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { MatTableModule } from '@angular/material/table';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { RouterTestingModule } from '@angular/router/testing';

describe('ParametersViewComponent', () => {
  let component: ParametersViewComponent;
  let fixture: ComponentFixture<ParametersViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedUiModule,
        MatTableModule,
        SharedDebugModule,
        RouterTestingModule,
      ],
      declarations: [ParametersViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
