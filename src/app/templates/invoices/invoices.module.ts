import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from './../../components/shared-components.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ToolsModule } from './../../tools/tools.module';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { AllInvoicesComponent } from './all-invoices/all-invoices.component';
import {
  MatInputModule,
  MatTableModule,
  MatCheckboxModule,
  MatBadgeModule,
  MatSlideToggleModule
} from '@angular/material';
import { SendInvoiceComponent } from './send-invoice/send-invoice.component';
import { OrderInvoiceComponent } from './order-invoice/order-invoice.component';
import { ResourceInvoiceComponent } from './resource-invoice/resource-invoice.component';
import { ClientInvoiceComponent } from './client-invoice/client-invoice.component';
import { DetailsInvoiceComponent } from './details-invoice/details-invoice.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';

@NgModule({
  declarations: [
    //
    AddInvoiceComponent,
    AllInvoicesComponent,
    SendInvoiceComponent,
    OrderInvoiceComponent,
    ResourceInvoiceComponent,
    ClientInvoiceComponent,
    PrintInvoiceComponent,
    DetailsInvoiceComponent
  ],
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    SharedComponentsModule,
    MatInputModule,
    MatTableModule,
    CKEditorModule,
    ToolsModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatSlideToggleModule
  ]
})
export class InvoicesModule { }
