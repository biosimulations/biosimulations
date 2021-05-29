import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { HomeComponent } from './home.component';
import { ConfigService } from '@biosimulations/shared/services';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule, SharedUiModule, BiosimulationsIconsModule],
      providers: [ConfigService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO: Fix this test
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
