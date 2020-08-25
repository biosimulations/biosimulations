import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DispatchComponent } from './components/dispatch/dispatch.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewVisualisationComponent } from './components/view-visualisation/view-visualisation.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VisualisationContainerComponent } from './components/visualisation-container/visualisation-container.component';
import { ResultsPageComponent } from './components/results-page/results-page.component';
import { MatSelectModule } from '@angular/material/select';
import { PlotlyViaWindowModule } from 'angular-plotly.js';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'run',
    component: DispatchComponent,
    data: {
      breadcrumb: 'Run'
    }
  },
  {
    path: 'simulation/:uuid',
    component: ResultsPageComponent,
    data: {
      breadcrumb: 'Simulation results'
    }
  },
  {
    path: 'help',
    loadChildren: () =>
      import('./components/help/help.module').then((m) => m.HelpModule),
    data: {
      breadcrumb: 'Help'
    }
  },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DispatchComponent,
    ViewVisualisationComponent,
    VisualisationContainerComponent,
    ResultsPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    PlotlyViaWindowModule,
    MatSelectModule,
    SharedUiModule,
    BiosimulationsIconsModule,
    BrowserAnimationsModule,

    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled', scrollPositionRestoration: 'enabled' }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
