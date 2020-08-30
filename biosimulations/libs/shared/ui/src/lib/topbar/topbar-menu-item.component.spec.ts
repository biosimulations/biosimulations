import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { TopbarMenuItemComponent } from './topbar-menu-item.component';

describe('TopbarMenuItemComponent', () => {
  let component: TopbarMenuItemComponent;
  let fixture: ComponentFixture<TopbarMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TopbarMenuItemComponent],
      imports: [RouterTestingModule, BiosimulationsIconsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
