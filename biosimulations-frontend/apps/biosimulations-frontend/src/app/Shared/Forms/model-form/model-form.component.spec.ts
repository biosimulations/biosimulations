import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelFormComponent } from './model-form.component';

describe('ModelFormComponent', () => {
  let component: ModelFormComponent;
  let fixture: ComponentFixture<ModelFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
