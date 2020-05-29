import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementComponent } from './agreement.component';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
import { UiMaterialModule } from '@biosimulations/ui/material';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DebugModule } from '@biosimulations/shared/debug';

describe('AgreementComponent', () => {

  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgreementComponent, TestHostComponent],
      imports: [
        MarkdownModule.forRoot(),
        UiMaterialModule,
        MatCardModule,
        MatCheckboxModule,
        DebugModule,
        RouterTestingModule,
        HttpClientModule,
      ],

      providers: [ChangeDetectorRef, HttpClient, MarkdownService],
    }).compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  it('should display markdown', async(() => {
    testHostFixture.detectChanges();
    testHostFixture.whenStable().then(() => {
      expect(
        testHostFixture.nativeElement.querySelector(
          'biosimulations-login-agreement > div > mat-card > markdown > h1',
        ).textContent,
      ).toEqual('Biosimulations Code of Conduct');
    });
  }));

  @Component({
    selector: `host-component`,
    template: `
      <biosimulations-login-agreement
        agreementUrl="https://raw.githubusercontent.com/reproducible-biomedical-modeling/Biosimulations/dev/CODE_OF_CONDUCT.md"
      ></biosimulations-login-agreement>
    `,
  })
  class TestHostComponent { }
});
