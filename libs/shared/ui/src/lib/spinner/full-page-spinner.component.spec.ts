import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullPageSpinnerComponent } from './full-page-spinner.component';
import { SpinnerComponent } from './spinner.component';
import { MaterialWrapperModule } from '../material-wrapper.module';

describe('FullPageSpinnerComponent', () => {
  let component: FullPageSpinnerComponent;
  let fixture: ComponentFixture<FullPageSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialWrapperModule],
      declarations: [FullPageSpinnerComponent, SpinnerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullPageSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
