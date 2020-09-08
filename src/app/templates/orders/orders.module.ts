import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AgmCoreModule } from '@agm/core';

import { ToolsModule } from './../../tools/tools.module';
import { OrdersRoutingModule } from './orders-routing.module';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import {
  MatInputModule,
  MatTableModule,
  MatSlideToggleModule,
  MatBadgeModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSelectModule,
  MatCheckboxModule,
  MatGridListModule
} from '@angular/material';
import { AddOrderComponent } from './add-order/add-order.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrdersTableComponent } from './orders-table/orders-table.component';
import { SuspendedOrdersComponent } from './suspended-orders/suspended-orders.component';
import { PostponedOrdersComponent } from './postponed-orders/postponed-orders.component';

@NgModule({
  declarations: [
    AllOrdersComponent,
    AddOrderComponent,
    OrderDetailsComponent,
    OrdersTableComponent,
    SuspendedOrdersComponent,
    PostponedOrdersComponent
  ],
  imports: [
    //
    CommonModule,
    OrdersRoutingModule,
    SharedComponentsModule,
    MatInputModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    CKEditorModule,
    ToolsModule,
    MatSlideToggleModule,
    NgxMaterialTimepickerModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatSelectModule,
    MatGridListModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB43NW6QmXMMqA8vv0iFmCKmklFcG4pofs',
      libraries: ['geometry', 'places']
    })
  ]
})
export class OrdersModule { }
