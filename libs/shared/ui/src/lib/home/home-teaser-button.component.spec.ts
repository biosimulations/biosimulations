import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeTeaserButtonComponent } from './home-teaser-button.component';
import { MatButtonModule } from '@angular/material/button';

describe('HomeTeaserButtonComponent', () => {
  let component: HomeTeaserButtonComponent;
  let fixture: ComponentFixture<HomeTeaserButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeTeaserButtonComponent],
      imports: [RouterTestingModule, MatButtonModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTeaserButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
