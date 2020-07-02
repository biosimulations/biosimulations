import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule } from 'ngx-markdown';
/**
 * Angular Module to be imported into the root app module of biosimulations angular apps
 * Should not be imported by any other modules. Contains imports of singleton services
 */
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
  ],
})
export class BiosimulationsAppModule {}
