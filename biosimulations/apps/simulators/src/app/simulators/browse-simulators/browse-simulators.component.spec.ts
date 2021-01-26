import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseSimulatorsComponent } from './browse-simulators.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
describe('BrowseSimulatorsComponent', () => {
  let component: BrowseSimulatorsComponent;
  let fixture: ComponentFixture<BrowseSimulatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedUiModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      declarations: [BrowseSimulatorsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseSimulatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
