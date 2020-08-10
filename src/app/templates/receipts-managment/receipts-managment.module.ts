import { ReceiptsManagmentRoutingModule } from './receipts-managment-routing.module';
import { ReceiptsManagmentComponent } from './receipts-managment/receipts-managment.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule, MatTabsModule, MatInputModule } from '@angular/material';


import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  declarations: [ReceiptsManagmentComponent],
  imports: [
    CommonModule,
    ReceiptsManagmentRoutingModule,
    MatTabsModule,
    MatInputModule,
    SharedComponentsModule,
    MatBadgeModule
  ]
})
export class ReceiptsManagmentModule { }
