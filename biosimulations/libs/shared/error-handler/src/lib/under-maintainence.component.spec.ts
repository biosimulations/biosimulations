import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorComponent } from './error.component';
import { UnderMaintainenceComponent } from './under-maintainence.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

describe('UnderMaintainenceComponent', () => {
  let component: UnderMaintainenceComponent;
  let fixture: ComponentFixture<UnderMaintainenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorComponent, UnderMaintainenceComponent],
      imports: [BiosimulationsIconsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderMaintainenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
