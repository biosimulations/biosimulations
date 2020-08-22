import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectModule } from '@angular/material/select';

import { DispatchComponent } from './dispatch.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('DispatchComponent', () => {
  let component: DispatchComponent;
  let fixture: ComponentFixture<DispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        SharedUiModule,
        MatSelectModule,
        NoopAnimationsModule,
      ],
      declarations: [DispatchComponent],
      providers: [HttpClient, HttpHandler],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
