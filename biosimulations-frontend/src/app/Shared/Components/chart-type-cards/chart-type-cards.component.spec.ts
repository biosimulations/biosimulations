import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgPipesModule } from 'ngx-pipes';
import { ChartTypeCardsComponent } from './chart-type-cards.component';

describe('ChartTypeCardsComponent', () => {
  let component: ChartTypeCardsComponent;
  let fixture: ComponentFixture<ChartTypeCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartTypeCardsComponent ],
      imports: [ RouterTestingModule, NgPipesModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartTypeCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
