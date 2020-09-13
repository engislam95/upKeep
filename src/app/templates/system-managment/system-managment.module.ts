import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material';
import { SystemManagmentRoutingModule } from './system-managment-routing.module'
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { SystemManagmentComponent } from './system-managment/system-managment.component';

@NgModule({
  declarations: [SystemManagmentComponent ],
  imports: [
    CommonModule,
    SystemManagmentRoutingModule,
    SharedComponentsModule,
    MatBadgeModule
  ]
})
export class SystemManagmentModule {}
