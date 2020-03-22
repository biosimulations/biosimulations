import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionFormComponent } from './description-form.component';

describe('DescriptionFormComponent', () => {
  let component: DescriptionFormComponent;
  let fixture: ComponentFixture<DescriptionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
