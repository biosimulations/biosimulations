import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedUiModule } from '../shared-ui.module';
import { SpinnerComponent } from '../spinner/spinner.component';

import { VegaEmbedComponent } from './vega-embed.component';

describe('VegaEmbedComponent', () => {
  let component: VegaEmbedComponent;
  let fixture: ComponentFixture<VegaEmbedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VegaEmbedComponent, SpinnerComponent],
      imports: [MatProgressSpinnerModule],
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
