import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { SimulationCardsComponent } from './simulation-cards.component';

describe('SimulationCardsComponent', () => {
  let component: SimulationCardsComponent;
  let fixture: ComponentFixture<SimulationCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationCardsComponent ],
      imports: [ RouterTestingModule, NgPipesModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
