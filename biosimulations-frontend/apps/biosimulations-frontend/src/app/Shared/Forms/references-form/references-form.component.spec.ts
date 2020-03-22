import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencesFormComponent } from './references-form.component';

describe('ReferencesFormComponent', () => {
  let component: ReferencesFormComponent;
  let fixture: ComponentFixture<ReferencesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferencesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
