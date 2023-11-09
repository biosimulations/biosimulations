import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AgreementComponent } from './agreement.component';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MarkdownModule, MarkdownService } from 'ngx-markdown';
//import { SharedUiModule } from '@biosimulations/shared/ui';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedDebugModule } from '@biosimulations/shared/debug';
import { BrowserModule } from '@angular/platform-browser';

describe('AgreementComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AgreementComponent, TestHostComponent],
      imports: [
        MarkdownModule.forRoot(),
        //SharedUiModule,
        MatCardModule,
        MatCheckboxModule,
        SharedDebugModule,
        RouterTestingModule,
        HttpClientModule,
      ],

      providers: [ChangeDetectorRef, HttpClient, MarkdownService],
    }).compileComponents();
  }));

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
  });

  @Component({
    // tslint:disable-next-line: component-selector
    selector: `host-component`,
    template: `
      <biosimulations-login-agreement
        agreementUrl="https://raw.githubusercontent.com/biosimulations/biosimulations/dev/docs/src/developers/conduct.md"></biosimulations-login-agreement>
    `,
  })
  class TestHostComponent {}
});
