import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { DispatchComponent } from './components/dispatch/dispatch.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ViewVisualisationComponent } from './components/view-visualisation/view-visualisation.component';
import { UiMaterialModule } from '@biosimulations/ui/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BiosimulationsAppModule } from '@biosimulations/shared/biosimulations-ng-utils';
// import * as PlotlyJS from 'plotly.js';
import { PlotlyViaCDNModule } from 'angular-plotly.js';
import { VisualisationContainerComponent } from './components/visualisation-container/visualisation-container.component';
import { ResultsPageComponent } from './components/results-page/results-page.component';
import {MatSelectModule} from '@angular/material/select';


PlotlyViaCDNModule.plotlyVersion = '1.49.4'; 
PlotlyViaCDNModule.plotlyBundle = 'basic'; 

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'dispatch', component: DispatchComponent
  },
  {
    path: 'result/:uuid', component: ResultsPageComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HomeComponent,
    DispatchComponent,
    ViewVisualisationComponent,
    VisualisationContainerComponent,
    ResultsPageComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    PlotlyViaCDNModule,
    MatSelectModule,
    UiMaterialModule,
    BrowserAnimationsModule,
    BiosimulationsAppModule,
    FormsModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
