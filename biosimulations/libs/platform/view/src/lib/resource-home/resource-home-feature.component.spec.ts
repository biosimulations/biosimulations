import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceHomeFeatureComponent } from './resource-home-feature.component';

describe('ResourceHomeFeatureComponent', () => {
  let component: ResourceHomeFeatureComponent;
  let fixture: ComponentFixture<ResourceHomeFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceHomeFeatureComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceHomeFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
