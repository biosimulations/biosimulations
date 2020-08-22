import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsViewComponent } from './authors-view.component';

describe('AuthorsViewComponent', () => {
  let component: AuthorsViewComponent;
  let fixture: ComponentFixture<AuthorsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
