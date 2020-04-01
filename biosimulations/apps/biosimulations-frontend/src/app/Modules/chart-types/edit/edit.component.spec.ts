import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../Modules/app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../Shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EditComponent } from './edit.component';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  // TODO mock the data service and remove http and router
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        SharedModule,
      ],
      providers: [
        HttpClientTestingModule,
        { provide: RouterTestingModule, useValue: RouterTestingModule },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
