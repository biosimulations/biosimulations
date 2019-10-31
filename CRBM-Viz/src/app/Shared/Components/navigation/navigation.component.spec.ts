import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// TODO The indiviudal components should be mocked
import { NavigationComponent } from './navigation.component';
import { NavIconsComponent } from '../nav-icons/nav-icons.component';
import { LogoComponent } from '../logo/logo.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/Modules/app-material.module';
import { AccountMenuComponent } from '../account-menu/account-menu.component';
import { FilterPipe } from 'src/app/Shared/Pipes/filter.pipe';
import { SidebarComponent } from '../sidebar/sidebar.component';
// TODO Sample content is needed and component compiled with it as input for <ng-content>
import { AboutComponent } from 'src/app/Pages/about/about.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavigationComponent,
        NavIconsComponent,
        LogoComponent,
        SearchBarComponent,
        FooterComponent,
        SidebarComponent,
        AccountMenuComponent,
        FilterPipe,
      ],
      imports: [MaterialModule, BrowserAnimationsModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
