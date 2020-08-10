import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllServicesComponent } from './all-services/all-services.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { AddSubServiceComponent } from './add-sub-service/add-sub-service.component';
import { AllInnerServicesComponent } from './all-sub-services/all-sub-services.component';

const routes: Routes = [
  //
  { path: 'all-services', component: AllServicesComponent },
  { path: 'add-service', component: AddServiceComponent },
  { path: 'add-sub-service', component: AddSubServiceComponent },
  { path: 'all-inner-services', component: AllInnerServicesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule { }
