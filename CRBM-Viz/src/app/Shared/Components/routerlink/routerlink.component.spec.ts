import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterlinkComponent } from './routerlink.component';

describe('RouterlinkComponent', () => {
  let component: RouterlinkComponent;
  let fixture: ComponentFixture<RouterlinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterlinkComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
