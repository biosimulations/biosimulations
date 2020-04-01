import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProjectsComponent } from './projects.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../..//Shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsComponent],
      imports: [RouterTestingModule, SharedModule, HttpClientTestingModule],
      providers: [
        { provide: RouterTestingModule, useValue: RouterTestingModule },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
