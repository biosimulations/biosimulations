import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HtmlSnackBarComponent } from './html-snack-bar.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

describe('HtmlSnackBarComponent', () => {
  let component: HtmlSnackBarComponent;
  let fixture: ComponentFixture<HtmlSnackBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BiosimulationsIconsModule, MatSnackBarModule],
      declarations: [HtmlSnackBarComponent],
      providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
