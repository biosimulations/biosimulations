import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { VisualizationCardsComponent } from './visualization-cards.component';

describe('VisualizationCardsComponent', () => {
  let component: VisualizationCardsComponent;
  let fixture: ComponentFixture<VisualizationCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizationCardsComponent ],
      imports: [ RouterTestingModule, NgPipesModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizationCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
