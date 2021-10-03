import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VegaEmbedComponent } from './vega-embed.component';

describe('VegaEmbedComponent', () => {
  let component: VegaEmbedComponent;
  let fixture: ComponentFixture<VegaEmbedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VegaEmbedComponent],
      imports: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VegaEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
