import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackComponent } from './callback.component';

import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/Modules/app-material.module';

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MaterialModule],
      providers: [RouterTestingModule, AuthService],
      declarations: [CallbackComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call login', () => {
    const debugelement = fixture.debugElement;
    const authService = debugelement.injector.get(AuthService);
    const authSpy = spyOn(authService, 'handleAuthCallback').and.callFake(
      () => {}
    );
    component.ngOnInit();
    expect(authSpy).toHaveBeenCalled();
  });
});
