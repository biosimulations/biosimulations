import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifiersFormComponent } from './identifiers-form.component';
import { BiosimulationsFrontendTestingModule } from '../../../testing/testing.module';

describe('IdentifiersFormComponent', () => {
  let component: IdentifiersFormComponent;
  let fixture: ComponentFixture<IdentifiersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IdentifiersFormComponent],
      imports: [BiosimulationsFrontendTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifiersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
