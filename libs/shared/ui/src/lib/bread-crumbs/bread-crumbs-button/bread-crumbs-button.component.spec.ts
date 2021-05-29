import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadCrumbsButtonComponent } from './bread-crumbs-button.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { MaterialWrapperModule } from '../../material-wrapper.module';

describe('BreadCrumbsButtonComponent', () => {
  let component: BreadCrumbsButtonComponent;
  let fixture: ComponentFixture<BreadCrumbsButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BiosimulationsIconsModule,
        MaterialWrapperModule,
      ],
      declarations: [BreadCrumbsButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadCrumbsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
