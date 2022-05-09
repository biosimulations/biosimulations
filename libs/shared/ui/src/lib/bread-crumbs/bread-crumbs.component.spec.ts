import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadCrumbsComponent } from './bread-crumbs.component';
import { MaterialWrapperModule } from '../material-wrapper.module';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadCrumbsButtonsComponent } from './bread-crumbs-buttons/bread-crumbs-buttons.component';
import { BreadCrumbsButtonComponent } from './bread-crumbs-button/bread-crumbs-button.component';

describe('BreadCrumbsComponent', () => {
  let component: BreadCrumbsComponent;
  let fixture: ComponentFixture<BreadCrumbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialWrapperModule, BiosimulationsIconsModule, RouterTestingModule],
      declarations: [BreadCrumbsComponent, BreadCrumbsButtonsComponent, BreadCrumbsButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadCrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
