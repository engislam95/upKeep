import { ManagmentRoutingModule } from './managment-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material';

import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { ManagmentComponent } from './managment/managment.component';

@NgModule({
  declarations: [ManagmentComponent],
  imports: [
    CommonModule,
    ManagmentRoutingModule,
    SharedComponentsModule,
    MatBadgeModule
  ]
})
export class ManagmentModule { }
