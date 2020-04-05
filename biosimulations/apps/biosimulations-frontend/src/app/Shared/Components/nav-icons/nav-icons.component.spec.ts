import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NavIconsComponent } from './nav-icons.component';
import { MaterialModule } from '../../../app-material.module';
import { RouterTestingModule } from '@angular/router/testing';
// TODO mock user menu
import { UserMenuComponent } from '../user-menu/user-menu.component';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
describe('NavIconsComponent', () => {
  let component: NavIconsComponent;
  let fixture: ComponentFixture<NavIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MaterialModule, RouterTestingModule],
      providers: [HttpClientTestingModule, MaterialModule, RouterTestingModule],
      declarations: [NavIconsComponent, UserMenuComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
