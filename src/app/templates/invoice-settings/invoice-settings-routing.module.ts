import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceSettingsComponent } from './invoice-settings/invoice-settings.component';

const routes: Routes = [
  //
  { path: '', component: InvoiceSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceSettingsRoutingModule { }
