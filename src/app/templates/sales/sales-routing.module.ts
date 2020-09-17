import { DraftSalesComponent } from './draft-sales/draft-sales.component';
import { MapComponent } from './../../components/map/map.component';
import { AddSaleComponent } from './add-sale/add-sale.component';
import { AllSalesComponent } from './all-sales/all-sales.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  //
  { path: 'all-sales', component: AllSalesComponent },
  { path: 'add-sale', component: AddSaleComponent },
  { path: 'update-sale', component: AddSaleComponent },
  { path: 'orders-sales-map', component: MapComponent },
  { path: 'draft-sales', component: DraftSalesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
