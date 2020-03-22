import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// TODO The indiviudal components should be mocked
import { NavigationComponent } from './navigation.component';
import { NavIconsComponent } from '../nav-icons/nav-icons.component';
import { LogoComponent } from '../logo/logo.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/Modules/app-material.module';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { FilterPipe } from 'src/app/Shared/Pipes/filter.pipe';
import { SidebarComponent } from '../sidebar/sidebar.component';
// TODO Sample content is needed and component compiled with it as input for <ng-content>
import { HelpComponent } from 'src/app/Modules/about/help/help.component';
import { AboutComponent } from 'src/app/Modules/about/about/about.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavigationComponent,
        NavIconsComponent,
        LogoComponent,
        SidebarComponent,
        UserMenuComponent,
        FilterPipe,
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        FontAwesomeModule,
      ],
      providers: [
        HttpClientTestingModule,
        BreadCrumbsService,
      ],
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
