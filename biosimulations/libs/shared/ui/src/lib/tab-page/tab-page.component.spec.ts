import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPageComponent } from './tab-page.component';

describe('TabPageComponent', () => {
  let component: TabPageComponent;
  let fixture: ComponentFixture<TabPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabPageComponent],
      imports: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
