import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextPageSideBarSectionsModule } from './text-page-side-bar-sections/text-page-side-bar-sections.module';
@NgModule({
  imports: [CommonModule, TextPageSideBarSectionsModule],
  exports: [TextPageSideBarSectionsModule],
  declarations: [],
})
export class SharedContentModule {}
