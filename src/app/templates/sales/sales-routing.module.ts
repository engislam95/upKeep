import { AddSaleComponent } from './add-sale/add-sale.component';
import { AllSalesComponent } from './all-sales/all-sales.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  //
  { path: 'all-sales', component: AllSalesComponent },
  { path: 'add-sale', component: AddSaleComponent },
  { path: 'update-sale', component: AddSaleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule {}
