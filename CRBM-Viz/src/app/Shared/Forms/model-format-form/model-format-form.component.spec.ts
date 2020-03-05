import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelFormatFormComponent } from './model-format-form.component';

describe('ModelFormatFormComponent', () => {
  let component: ModelFormatFormComponent;
  let fixture: ComponentFixture<ModelFormatFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelFormatFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelFormatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
