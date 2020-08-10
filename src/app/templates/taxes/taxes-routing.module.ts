import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllTaxesComponent } from './all-taxes/all-taxes.component';
import { AddTaxComponent } from './add-tax/add-tax.component';

const routes: Routes = [
  //
  { path: '', component: AllTaxesComponent },
  { path: 'add-tax', component: AddTaxComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxesRoutingModule { }
