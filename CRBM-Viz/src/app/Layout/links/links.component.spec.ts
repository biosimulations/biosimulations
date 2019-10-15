import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LinksComponent } from './links.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LinksComponent', () => {
  let component: LinksComponent;
  let fixture: ComponentFixture<LinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LinksComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
