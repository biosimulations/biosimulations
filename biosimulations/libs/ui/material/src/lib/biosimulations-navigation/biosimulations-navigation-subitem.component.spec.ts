import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BiosimulationsNavigationSubitemComponent } from './biosimulations-navigation-subitem.component';

describe('BiosimulationsNavigationSubitemComponent', () => {
  let component: BiosimulationsNavigationSubitemComponent;
  let fixture: ComponentFixture<BiosimulationsNavigationSubitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BiosimulationsNavigationSubitemComponent],
      imports: [
        RouterTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiosimulationsNavigationSubitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
