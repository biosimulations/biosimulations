import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateService } from './prompt-update.service';

@NgModule({
  imports: [CommonModule],
  providers: [UpdateService],
})
export class PwaModule {}
