import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditModelsComponent } from './edit-models.component';
import { BiosimulationsFrontendTestingModule } from '../../testing/testing.module';
import { EditPreviewComponent } from '../../Shared/Components/edit-preview/edit-preview.component';
import { NO_ERRORS_SCHEMA, Component, forwardRef } from '@angular/core';
import { ModelFormComponent } from '../../Shared/Forms/model-form/model-form.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ObjectSubForm } from '../../Shared/Forms/object-sub-form';

@Component({
  selector: 'app-model-form',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockModelFormComponent),
      multi: true,
    },
  ],
})
class MockModelFormComponent extends ObjectSubForm {
  set value(value) {}
}
describe('EditModelsComponent', () => {
  let component: EditModelsComponent;
  let fixture: ComponentFixture<EditModelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditModelsComponent,
        EditPreviewComponent,
        MockModelFormComponent,
      ],
      imports: [BiosimulationsFrontendTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
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
