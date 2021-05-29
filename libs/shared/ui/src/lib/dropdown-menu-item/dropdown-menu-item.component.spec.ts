import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { DropdownMenuItemComponent } from './dropdown-menu-item.component';

describe('DropdownMenuItemComponent', () => {
  let component: DropdownMenuItemComponent;
  let fixture: ComponentFixture<DropdownMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownMenuItemComponent],
      imports: [BiosimulationsIconsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
