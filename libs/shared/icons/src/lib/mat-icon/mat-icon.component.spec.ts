import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatIconComponent } from './mat-icon.component';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('MatIconComponent', () => {
  let component: MatIconComponent;
  let fixture: ComponentFixture<MatIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, FontAwesomeModule],
      declarations: [MatIconComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
