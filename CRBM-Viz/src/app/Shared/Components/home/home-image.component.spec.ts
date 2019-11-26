import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomeImageComponent } from './home-image.component';

describe('HomeImageComponent', () => {
  let component: HomeImageComponent;
  let fixture: ComponentFixture<HomeImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeImageComponent ],
      imports: [ RouterTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
