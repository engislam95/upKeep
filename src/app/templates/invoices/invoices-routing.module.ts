import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { AllInvoicesComponent } from './all-invoices/all-invoices.component';
import { SendInvoiceComponent } from './send-invoice/send-invoice.component';
import { OrderInvoiceComponent } from './order-invoice/order-invoice.component';
import { ResourceInvoiceComponent } from './resource-invoice/resource-invoice.component';
import { ClientInvoiceComponent } from './client-invoice/client-invoice.component';
import { DetailsInvoiceComponent } from './details-invoice/details-invoice.component';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';

const routes: Routes = [
  //
  { path: 'add-invoice', component: AddInvoiceComponent },
  { path: 'send-invoice', component: SendInvoiceComponent },
  { path: 'order-invoice', component: OrderInvoiceComponent },
  { path: 'resource-invoice', component: ResourceInvoiceComponent },
  { path: 'client-invoice', component: ClientInvoiceComponent },
  { path: 'details-invoice', component: DetailsInvoiceComponent },
  { path: 'all-invoices', component: AllInvoicesComponent },
  { path: 'inovice-report', component: PrintInvoiceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }
