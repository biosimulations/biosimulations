import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadCrumbButtonsComponent } from './bread-crumb-buttons.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { BreadCrumbsButtonComponent } from '../bread-crumbs-button/bread-crumbs-button.component';
import { MaterialWrapperModule } from '../../material-wrapper.module';
describe('BreadCrumbButtonsComponent', () => {
  let component: BreadCrumbButtonsComponent;
  let fixture: ComponentFixture<BreadCrumbButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadCrumbButtonsComponent, BreadCrumbsButtonComponent],
      imports: [
        RouterTestingModule,
        BiosimulationsIconsModule,
        MaterialWrapperModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadCrumbButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
