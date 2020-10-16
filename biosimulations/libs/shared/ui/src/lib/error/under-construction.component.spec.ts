import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorComponent } from './error.component';
import { UnderConstructionComponent } from './under-construction.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

describe('UnderConstructionComponent', () => {
  let component: UnderConstructionComponent;
  let fixture: ComponentFixture<UnderConstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorComponent, UnderConstructionComponent],
      imports: [BiosimulationsIconsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
