import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackComponent } from './callback.component';

import { AuthService } from 'src/app/Services/auth0.service';
import { RouterTestingModule } from '@angular/router/testing';
//  TODO This test does nothing, fix
describe('CallbackComponent', () => {
  // let component: CallbackComponent;
  // let fixture: ComponentFixture<CallbackComponent>;

  beforeEach(async(() => {
    // tslint:disable-next-line:max-line-length
    // TestBed.configureTestingModule({ imports: [RouterTestingModule], providers: [RouterTestingModule, AuthService],declarations: [CallbackComponent],}).compileComponents();
  }));

  beforeEach(() => {
    // fixture = TestBed.createComponent(CallbackComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component.ngOnInit).toThrowError();
  });
});
