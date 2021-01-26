import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceAttributesComponent } from './resource-attributes.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

describe('ResourceAttributesComponent', () => {
  let component: ResourceAttributesComponent;
  let fixture: ComponentFixture<ResourceAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedUiModule, BiosimulationsIconsModule],
      declarations: [ResourceAttributesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
