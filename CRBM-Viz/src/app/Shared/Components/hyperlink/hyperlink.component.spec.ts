import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HyperlinkComponent } from './hyperlink.component';

describe('HyperlinkComponent', () => {
  let component: HyperlinkComponent;
  let fixture: ComponentFixture<HyperlinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HyperlinkComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HyperlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
