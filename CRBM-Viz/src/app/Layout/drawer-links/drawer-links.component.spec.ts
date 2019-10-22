import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerLinksComponent } from './drawer-links.component';
import { MaterialModule } from 'src/app/Modules/app-material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DrawerLinksComponent', () => {
  let component: DrawerLinksComponent;
  let fixture: ComponentFixture<DrawerLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawerLinksComponent ],
      imports: [MaterialModule, RouterTestingModule],
      providers: [
        { provide: RouterTestingModule, useValue: RouterTestingModule },
        { provide: ActivatedRoute, useValue: ActivatedRoute },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
