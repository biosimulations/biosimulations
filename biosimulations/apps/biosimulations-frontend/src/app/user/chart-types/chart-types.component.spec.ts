import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ChartTypesComponent } from './chart-types.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../Shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChartTypesComponent', () => {
  let component: ChartTypesComponent;
  let fixture: ComponentFixture<ChartTypesComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChartTypesComponent],
      imports: [RouterTestingModule, SharedModule, HttpClientTestingModule],
      providers: [
        { provide: RouterTestingModule, useValue: RouterTestingModule },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
