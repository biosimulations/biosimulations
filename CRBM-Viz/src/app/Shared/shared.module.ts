import { NgModule } from '@angular/core';
import { FilterPipe } from './Pipes/filter.pipe';

@NgModule({
  declarations: [FilterPipe],
  exports: [FilterPipe],
})
export class SharedModule {}
