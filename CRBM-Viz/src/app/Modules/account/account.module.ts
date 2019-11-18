import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { AccountRoutingModule } from './account-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile/profile-edit.component';
import { SharedModule } from 'src/app/Shared/shared.module';
import { MaterialModule } from '../app-material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [ProfileComponent, ProfileEditComponent],

  imports: [CommonModule, FormsModule, AccountRoutingModule, SharedModule, MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountModule {}
