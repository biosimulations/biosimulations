import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModelsComponent } from './edit-models.component';

describe('EditModelsComponent', () => {
  let component: EditModelsComponent;
  let fixture: ComponentFixture<EditModelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditModelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
