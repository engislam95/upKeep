import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsModule } from '../../tools/tools.module';
/* ---------------------- Modules ------------------------ */
import { SharedComponentsModule } from '../../components/shared-components.module';
/* ---------------------- Angular Material ------------------------ */
import { MatIconModule } from '@angular/material';
/* --------------------- Routing Module ------------------------ */
import { AccessRoutingModule } from './access-routing.module';
/* --------------------- Component ---------------------------- */
import { LoginComponent } from './login/login.component';
@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    AccessRoutingModule,
    MatIconModule,
    ToolsModule,
    SharedComponentsModule
  ]
})
export class AccessModule { }
