import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaIconComponent } from './fa-icon.component';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BiosimulationsIconsModule } from '../shared-icons.module';

describe('FaIconComponent', () => {
  let component: FaIconComponent;
  let fixture: ComponentFixture<FaIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, FontAwesomeModule, BiosimulationsIconsModule],
      declarations: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaIconComponent);
    component = fixture.componentInstance;
    component.icon = ['fas', 'question'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
