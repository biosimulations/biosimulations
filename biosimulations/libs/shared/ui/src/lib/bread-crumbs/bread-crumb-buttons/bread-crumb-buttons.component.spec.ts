import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadCrumbButtonsComponent } from './bread-crumb-buttons.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { BreadCrumbsButtonComponent } from '../bread-crumbs-button/bread-crumbs-button.component';
describe('BreadCrumbButtonsComponent', () => {
  let component: BreadCrumbButtonsComponent;
  let fixture: ComponentFixture<BreadCrumbButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadCrumbButtonsComponent, BreadCrumbsButtonComponent],
      imports: [RouterTestingModule, BiosimulationsIconsModule],
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
