import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliciesModule } from './policies/policies.module';
import { TextPageSideBarSectionsModule } from './text-page-side-bar-sections/text-page-side-bar-sections.module';
@NgModule({
  imports: [CommonModule, PoliciesModule, TextPageSideBarSectionsModule],
  exports: [PoliciesModule, TextPageSideBarSectionsModule],
  declarations: [],
})
export class SharedContentModule {}
