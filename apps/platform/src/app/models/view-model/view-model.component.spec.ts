import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModelComponent } from './view-model.component';
import { ResourceViewModule } from '@biosimulations/platform/view';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('ViewModelComponent', () => {
  let component: ViewModelComponent;
  let fixture: ComponentFixture<ViewModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ResourceViewModule,
        SharedUiModule,
        SharedDebugModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [ViewModelComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
