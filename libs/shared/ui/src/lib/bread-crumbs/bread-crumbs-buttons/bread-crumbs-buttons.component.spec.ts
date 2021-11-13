import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadCrumbsButtonsComponent } from './bread-crumbs-buttons.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { BreadCrumbsButtonComponent } from '../bread-crumbs-button/bread-crumbs-button.component';
import { MaterialWrapperModule } from '../../material-wrapper.module';
describe('BreadCrumbsButtonsComponent', () => {
  let component: BreadCrumbsButtonsComponent;
  let fixture: ComponentFixture<BreadCrumbsButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadCrumbsButtonsComponent, BreadCrumbsButtonComponent],
      imports: [
        RouterTestingModule,
        BiosimulationsIconsModule,
        MaterialWrapperModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadCrumbsButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
