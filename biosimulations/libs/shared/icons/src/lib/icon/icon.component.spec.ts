import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponent } from './icon.component';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  BiosimulationsIcon,
  BiosimulationsIconsModule,
} from '../shared-icons.module';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: `host-component`,
  template: `<biosimulations-icon
    #iconComponent
    [icon]="icon"
  ></biosimulations-icon>`,
})
class TestHostComponent {
  @ViewChild(IconComponent)
  iconComponent!: IconComponent;
  public icon!: string;
}
describe('IconComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BiosimulationsIconsModule, MatIconModule, FontAwesomeModule],
      declarations: [TestHostComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should contain all needed icons', () => {
    const iconMap = fixture.componentInstance.iconComponent.iconMap;
    for (const key in iconMap) {
      component.icon = key as BiosimulationsIcon;
      fixture.detectChanges();

      expect(fixture.componentInstance.iconComponent.iconInfo.name).toEqual(
        iconMap[key as BiosimulationsIcon].name,
      );
    }
  });
});
