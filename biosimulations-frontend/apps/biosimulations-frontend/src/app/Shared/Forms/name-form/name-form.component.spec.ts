import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameFormComponent } from './name-form.component';

describe('NameFormComponent', () => {
  let component: NameFormComponent;
  let fixture: ComponentFixture<NameFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
