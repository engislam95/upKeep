import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllOrdersComponent } from './all-orders/all-orders.component';
import { AddOrderComponent } from './add-order/add-order.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { MapComponent } from '../../components/map/map.component';
import { OrdersTableComponent } from './orders-table/orders-table.component';
import { SuspendedOrdersComponent } from './suspended-orders/suspended-orders.component';
import { PostponedOrdersComponent } from './postponed-orders/postponed-orders.component';
import { map } from 'rxjs/operators';

const routes: Routes = [
  //
  { path: 'all-orders', component: AllOrdersComponent },
  { path: 'add-order', component: AddOrderComponent },
  { path: 'orders-table', component: OrdersTableComponent },
  { path: 'orders-map', component: MapComponent },
  { path: 'update-order', component: AddOrderComponent },
  { path: 'order-details', component: OrderDetailsComponent },
  { path: 'suspended-orders', component: SuspendedOrdersComponent },
  { path: 'postponed-orders', component: PostponedOrdersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule {}
