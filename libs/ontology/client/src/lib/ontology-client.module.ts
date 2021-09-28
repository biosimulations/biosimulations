import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntologyService } from './ontology.service';

@NgModule({
  imports: [CommonModule],
  providers: [OntologyService],
})
export class OntologyClientModule {}
