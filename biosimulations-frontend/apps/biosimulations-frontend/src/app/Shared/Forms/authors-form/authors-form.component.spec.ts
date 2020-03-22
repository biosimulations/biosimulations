import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsFormComponent } from './authors-form.component';

describe('AuthorsFormComponent', () => {
  let component: AuthorsFormComponent;
  let fixture: ComponentFixture<AuthorsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
