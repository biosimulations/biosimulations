import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatExpansionModule } from '@angular/material/expansion';

import { BiosimulationsNavigationItemComponent } from './biosimulations-navigation-item.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { MaterialWrapperModule } from '../material-wrapper.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BiosimulationsNavigationItemComponent', () => {
  let component: BiosimulationsNavigationItemComponent;
  let fixture: ComponentFixture<BiosimulationsNavigationItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BiosimulationsNavigationItemComponent],
      imports: [
        RouterTestingModule,
        MatExpansionModule,
        BiosimulationsIconsModule,
        MaterialWrapperModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiosimulationsNavigationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
