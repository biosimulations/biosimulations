import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VegaEmbedComponent } from './vega-embed.component';
import { SharedUiModule } from '@biosimulations/shared/ui';

describe('VegaEmbedComponent', () => {
  let component: VegaEmbedComponent;
  let fixture: ComponentFixture<VegaEmbedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VegaEmbedComponent],
      imports: [SharedUiModule],
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
