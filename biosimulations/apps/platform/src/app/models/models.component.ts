import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'biosimulations-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.sass']
})
export class ModelsComponent  {
  // TODO: get from app config
  issueUrl = 'https://github.com/biosimulations/Biosimulations/issues/new/choose'
}
