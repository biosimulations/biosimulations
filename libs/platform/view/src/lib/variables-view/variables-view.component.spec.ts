import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablesViewComponent } from './variables-view.component';
import { MatTableModule } from '@angular/material/table';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { RouterTestingModule } from '@angular/router/testing';
describe('VariablesViewComponent', () => {
  let component: VariablesViewComponent;
  let fixture: ComponentFixture<VariablesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTableModule, SharedDebugModule, RouterTestingModule],
      declarations: [VariablesViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
