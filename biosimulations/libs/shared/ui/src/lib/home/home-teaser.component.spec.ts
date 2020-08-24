import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTeaserComponent } from './home-teaser.component';

describe('HomeTeaserComponent', () => {
  let component: HomeTeaserComponent;
  let fixture: ComponentFixture<HomeTeaserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeTeaserComponent],
      imports: [],
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
