import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeTeaserComponent } from './home-teaser.component';
import { HomeTeaserButtonComponent } from './home-teaser-button.component';
import { MatButtonModule } from '@angular/material/button';

describe('HomeTeaserComponent', () => {
  let component: HomeTeaserComponent;
  let fixture: ComponentFixture<HomeTeaserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeTeaserComponent, HomeTeaserButtonComponent],
      imports: [RouterTestingModule, MatButtonModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
