import { SystemManagmentComponent } from './system-managment/system-managment.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material';

import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { SystemManagmentRoutingModule } from './system-managment-routing.module';

@NgModule({
  declarations: [SystemManagmentComponent ],
  imports: [
    CommonModule,
    SystemManagmentRoutingModule,
    SharedComponentsModule,
    MatBadgeModule
  ]
})
export class SystemManagmentModule { }
