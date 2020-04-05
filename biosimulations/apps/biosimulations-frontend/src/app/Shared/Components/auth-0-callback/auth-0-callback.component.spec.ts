import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Auth0CallbackComponent } from './auth-0-callback.component';

import { AuthService } from '../../Services/auth0.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../app-material.module';
import { ActivatedRoute } from '@angular/router';

describe('Auth0CallbackComponent', () => {
  let component: Auth0CallbackComponent;
  let fixture: ComponentFixture<Auth0CallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MaterialModule],
      providers: [RouterTestingModule, AuthService],
      declarations: [Auth0CallbackComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Auth0CallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  // TODO fix this
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
  xit('should call login', () => {
    const debugelement = fixture.debugElement;
    const authService = debugelement.injector.get(AuthService);
    const authSpy = spyOn(
      authService,
      'handleAuthCallback',
    ).and.callFake(() => {});
    component.ngOnInit();
    expect(authSpy).toHaveBeenCalled();
  });
});
