import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ProjectsChipsComponent } from './projects-chips.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectFilterQueryItem, ProjectFilterStatsItem, ProjectFilterTarget } from '@biosimulations/datamodel/common';
import { Observable, of } from 'rxjs';
import { Component } from '@angular/core';

@Component({
  template: ` <biosimulations-projects-chips
    [filterStats$]="filterStats$"
    (filterQueries$)="onFilterQueryChanged($event)">
  </biosimulations-projects-chips>`,
})
class TestHostComponent {
  public filterStats$: Observable<ProjectFilterStatsItem[]> = of([
    { target: ProjectFilterTarget.keywords, valueFrequencies: [{ value: 'keyworkd', count: 1 }] },
  ]);
  public filterQueryItems: ProjectFilterQueryItem[] | undefined;
  public onFilterQueryChanged(filterQueryItems: ProjectFilterQueryItem[]): void {
    this.filterQueryItems = filterQueryItems;
  }
}

describe('ProjectsChipsComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(fakeAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectsChipsComponent, TestHostComponent],
      imports: [SharedUiModule, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
