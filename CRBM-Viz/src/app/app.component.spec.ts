import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TopbarComponent } from './components/Layout/topbar/topbar.component';
import { SearchBarComponent } from './components/Layout/search-bar/search-bar.component';
import { SidebarComponent } from './components/Layout/sidebar/sidebar.component';
import { LogoComponent } from './components/Layout/logo/logo.component';

import{CUSTOM_ELEMENTS_SCHEMA} from '@angular/core'
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent,SidebarComponent,TopbarComponent],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'CRBM-Viz'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('CRBM-Viz');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    // expect(compiled.querySelector('.content span').textContent).toContain('CRBM-Viz app is running!');
  });
});
