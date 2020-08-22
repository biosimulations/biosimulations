import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceHomeComponent } from './resource-home.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { RouterTestingModule } from '@angular/router/testing';

describe('ResourceHomeComponent', () => {
  let component: ResourceHomeComponent;
  let fixture: ComponentFixture<ResourceHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceHomeComponent],
      imports: [BiosimulationsIconsModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
