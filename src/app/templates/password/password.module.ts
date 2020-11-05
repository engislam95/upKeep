import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsModule } from '../../tools/tools.module';
/* ---------------------- Modules ------------------------ */
import { SharedComponentsModule } from '../../components/shared-components.module';
/* ---------------------- Angular Material ------------------------ */
import { MatIconModule } from '@angular/material';
/* --------------------- Routing Module ------------------------ */

import { ChangePasswordComponent } from './change-password/change-password.component';
import { PasswordRoutingModule } from './password-routing.module';
import {
  MatInputModule,
} from '@angular/material';

/* --------------------- Component ---------------------------- */

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    PasswordRoutingModule,
    MatIconModule,
    ToolsModule,
    SharedComponentsModule,
    MatInputModule
  ]
})
export class PasswordModule {}
