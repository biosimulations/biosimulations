import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavIconsComponent } from './nav-icons.component';
import { MaterialModule } from 'src/app/Modules/app-material.module';
import { RouterTestingModule } from '@angular/router/testing';
// TODO mock account menu
import { AccountMenuComponent } from '../account-menu/account-menu.component';

describe('NavIconsComponent', () => {
  let component: NavIconsComponent;
  let fixture: ComponentFixture<NavIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, RouterTestingModule],
      providers: [MaterialModule, RouterTestingModule],
      declarations: [NavIconsComponent, AccountMenuComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
