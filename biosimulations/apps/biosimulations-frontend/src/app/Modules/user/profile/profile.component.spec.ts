import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../Modules/app-material.module';
import { SharedModule } from '../../../Shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule,
        SharedModule,
      ],
      providers: [
        { provide: RouterTestingModule, useValue: RouterTestingModule },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO enable this after mocking a auth service
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
