import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditComponent } from './profile-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/Modules/app-material.module';
import { SharedModule } from 'src/app/Shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('ProfileEditComponent', () => {
  let component: ProfileEditComponent;
  let fixture: ComponentFixture<ProfileEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileEditComponent],
      imports: [
        RouterTestingModule,
        MaterialModule,
        SharedModule,
        HttpClientTestingModule,
        FormsModule,
      ],
      providers: [
        { provide: RouterTestingModule, useValue: RouterTestingModule },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
