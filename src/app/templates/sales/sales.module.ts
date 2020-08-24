import { SalesRoutingModule } from './sales-routing.module';
import { SaleDetailsComponent } from './sale-details/sale-details.component';
import { AddSaleComponent } from './add-sale/add-sale.component';
import { AllSalesComponent } from './all-sales/all-sales.component';
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AgmCoreModule } from '@agm/core';

import { ToolsModule } from './../../tools/tools.module';
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

@NgModule({
  declarations: [AllSalesComponent, AddSaleComponent, SaleDetailsComponent],
  imports: [
    //
    CommonModule,
    SalesRoutingModule,
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
      apiKey: 'AIzaSyCW4r_HcOqZfIGdz-ZxvFUE1R1AwpTZKBs',
      libraries: ['geometry']
    })
  ]
})
export class SalesModule {}
